import { expect } from 'chai'
import crypto from 'crypto'
import Sinon from 'sinon'
import { ImportMock } from 'ts-mock-imports'

import { mockAxiosRequest } from '../../../test/helpers/http/axios'
import { AlunaError } from '../../lib/core/AlunaError'
import { IAlunaHttpPublicParams } from '../../lib/core/IAlunaHttp'
import { AlunaHttpVerbEnum } from '../../lib/enums/AlunaHtttpVerbEnum'
import { AlunaHttpErrorCodes } from '../../lib/errors/AlunaHttpErrorCodes'
import { IAlunaKeySecretSchema } from '../../lib/schemas/IAlunaKeySecretSchema'
import { IAlunaSettingsSchema } from '../../lib/schemas/IAlunaSettingsSchema'
import { mockAssembleRequestConfig } from '../../utils/axios/assembleAxiosRequestConfig.mock'
import {
  mockAlunaCache,
  validateCache,
} from '../../utils/cache/AlunaCache.mock'
import { executeAndCatch } from '../../utils/executeAndCatch'
import * as handleFtxRequestErrorMod from './errors/handleFtxRequestError'
import { Ftx } from './Ftx'
import * as FtxHttpMod from './FtxHttp'



describe('FtxHttp', () => {

  const { FtxHttp, generateAuthSignature } = FtxHttpMod

  const dummyUrl = 'http://dummy.com/path/XXXDUMMY/dummy'
  const dummyBody = { dummy: 'dummy-body' }
  const dummyResponse = 'dummy-response'
  const dummyKeysecret: IAlunaKeySecretSchema = {
    key: 'key',
    secret: 'secret',
  }
  const dummySignedHeaders = {
    'FTX-KEY': 'string',
    'FTX-TS': 0,
    'FTX-SIGN': 'string',
  }



  const mockDeps = (
    params: {
      requestResponse?: any,
      requestError?: AlunaError | Error,
      getCache?: any,
      hasCache?: boolean,
      setCache?: boolean,
      signedheaderResponse?: FtxHttpMod.IFtxSignedHeaders,
      mockedExchangeSettings?: IAlunaSettingsSchema,
    } = {},
  ) => {

    const {
      requestResponse = {},
      signedheaderResponse = dummySignedHeaders,
      getCache = {},
      hasCache = false,
      setCache = false,
      requestError,
      mockedExchangeSettings = {},
    } = params

    const { assembleAxiosRequestMock } = mockAssembleRequestConfig()

    const {
      requestSpy,
      axiosCreateMock,
    } = mockAxiosRequest({
      error: requestError,
      responseData: requestResponse,
    })

    const exchangeMock = ImportMock.mockOther(
      Ftx,
      'settings',
      mockedExchangeSettings,
    )

    const generateAuthHeaderMock = ImportMock.mockFunction(
      FtxHttpMod,
      'generateAuthSignature',
      signedheaderResponse,
    )

    const handleRequestErrorSpy = ImportMock.mockFunction(
      handleFtxRequestErrorMod,
      'handleFtxRequestError',
      requestError,
    )

    const {
      cache,
      hashCacheKey,
    } = mockAlunaCache({
      get: getCache,
      has: hasCache,
      set: setCache,
    })

    return {
      cache,
      requestSpy,
      hashCacheKey,
      exchangeMock,
      axiosCreateMock,
      handleRequestErrorSpy,
      generateAuthHeaderMock,
      assembleAxiosRequestMock,
    }

  }

  it('should defaults the http verb to get on public requests', async () => {

    const {
      requestSpy,
      axiosCreateMock,
    } = mockDeps({
      requestResponse: dummyResponse,
    })

    await FtxHttp.publicRequest({
      // http verb not informed
      url: dummyUrl,
      body: dummyBody,
    })

    expect(axiosCreateMock.callCount).to.be.eq(1)

    expect(requestSpy.callCount).to.be.eq(1)

    expect(requestSpy.args[0]).to.deep.eq([{
      url: dummyUrl,
      method: AlunaHttpVerbEnum.GET,
      data: dummyBody,
    }])

  })

  it('should execute public request just fine', async () => {

    const {
      requestSpy,
      axiosCreateMock,
    } = mockDeps({
      requestResponse: dummyResponse,
    })

    const responseData = await FtxHttp.publicRequest({
      verb: AlunaHttpVerbEnum.GET,
      url: dummyUrl,
      body: dummyBody,
    })

    expect(axiosCreateMock.callCount).to.be.eq(1)

    expect(requestSpy.callCount).to.be.eq(1)
    expect(requestSpy.args[0]).to.deep.eq([{
      url: dummyUrl,
      method: AlunaHttpVerbEnum.GET,
      data: dummyBody,
    }])

    expect(responseData).to.deep.eq({
      data: dummyResponse,
      requestCount: 1,
    })

  })

  it(
    'should defaults the http verb to post on private requests',
    async () => {

      const {
        requestSpy,
        axiosCreateMock,
        generateAuthHeaderMock,
      } = mockDeps({
        requestResponse: dummyResponse,
      })

      await FtxHttp.privateRequest({
      // http verb not informed
        keySecret: dummyKeysecret,
        url: 'http://dummy.com',
      })

      expect(axiosCreateMock.callCount).to.be.eq(1)

      expect(generateAuthHeaderMock.callCount).to.be.eq(1)

      expect(requestSpy.callCount).to.be.eq(1)

      expect(requestSpy.args[0]).to.deep.eq([{
        data: undefined,
        url: 'http://dummy.com',
        method: AlunaHttpVerbEnum.POST,
        headers: dummySignedHeaders,
      }])

    },
  )

  it('should execute private request just fine', async () => {

    const {
      requestSpy,
      axiosCreateMock,
      generateAuthHeaderMock,
    } = mockDeps({
      requestResponse: dummyResponse,
      signedheaderResponse: dummySignedHeaders,
    })

    const responseData = await FtxHttp.privateRequest({
      verb: AlunaHttpVerbEnum.POST,
      url: dummyUrl,
      body: dummyBody,
      keySecret: dummyKeysecret,

    })

    expect(axiosCreateMock.callCount).to.be.eq(1)

    expect(generateAuthHeaderMock.callCount).to.be.eq(1)
    expect(generateAuthHeaderMock.calledWith({
      verb: AlunaHttpVerbEnum.POST,
      body: dummyBody,
      keySecret: dummyKeysecret,
      path: new URL(dummyUrl).pathname,
    })).to.be.ok

    expect(requestSpy.callCount).to.be.eq(1)
    expect(requestSpy.args[0]).to.deep.eq([{
      data: dummyBody,
      url: `${dummyUrl}`,
      method: AlunaHttpVerbEnum.POST,
      headers: dummySignedHeaders,
    }])

    expect(responseData).to.deep.eq({
      data: dummyResponse,
      requestCount: 1,
    })

  })

  it(
    'should ensure handleFtxRequestError is call on request error',
    async () => {

      const errMsg = 'Dummy error'

      const alunaError = new AlunaError({
        code: AlunaHttpErrorCodes.REQUEST_ERROR,
        message: errMsg,
        httpStatusCode: 401,
        metadata: { error: errMsg },
      })

      const {
        handleRequestErrorSpy,
      } = mockDeps({
        requestError: alunaError,
      })

      let res = await executeAndCatch(() => FtxHttp.publicRequest({
        url: dummyUrl,
      }))

      expect(res.result).not.to.be.ok

      expect(res.error!.message).to.be.eq(errMsg)
      expect(res.error!.code).to.be.eq(alunaError.code)
      expect(res.error!.httpStatusCode).to.be.eq(alunaError.httpStatusCode)
      expect(res.error!.metadata).to.be.eq(alunaError.metadata)

      expect(handleRequestErrorSpy.callCount).to.be.eq(1)
      expect(handleRequestErrorSpy.args[0][0]).to.deep.eq({
        error: alunaError,
      })


      res = await executeAndCatch(() => FtxHttp.privateRequest({
        url: dummyUrl,
        body: dummyBody,
        keySecret: dummyKeysecret,
      }))

      expect(res.result).not.to.be.ok

      expect(res.error!.message).to.be.eq(errMsg)
      expect(res.error!.code).to.be.eq(alunaError.code)
      expect(res.error!.httpStatusCode).to.be.eq(alunaError.httpStatusCode)
      expect(res.error!.metadata).to.be.eq(alunaError.metadata)

      expect(handleRequestErrorSpy.callCount).to.be.eq(2)
      expect(handleRequestErrorSpy.args[1][0]).to.deep.eq({
        error: alunaError,
      })

    },
  )

  it('should generate signed auth header just fine with body', async () => {

    const createHmacSpy = Sinon.spy(crypto, 'createHmac')

    const updateSpy = Sinon.spy(crypto.Hmac.prototype, 'update')

    const digestSpy = Sinon.spy(crypto.Hmac.prototype, 'digest')

    const currentDate = 'current-date'

    const timestampMock = { toString: () => currentDate }

    const dateMock = ImportMock.mockFunction(
      Date.prototype,
      'getTime',
      timestampMock,
    )

    const keySecret = {
      key: 'dummy-key',
      secret: 'dummy-secret',
    } as IAlunaKeySecretSchema
    const verb = 'verb' as AlunaHttpVerbEnum
    const body = dummyBody

    const signedHash = generateAuthSignature({
      keySecret,
      verb,
      body,
      path: new URL(dummyUrl).pathname,
    })

    expect(dateMock.callCount).to.be.eq(1)

    expect(createHmacSpy.callCount).to.be.eq(1)
    expect(createHmacSpy.calledWith('sha256', keySecret.secret)).to.be.ok

    expect(updateSpy.callCount).to.be.eq(4)
    expect(updateSpy.calledWith(currentDate.toString())).to.be.ok
    expect(updateSpy.calledWith(verb.toUpperCase())).to.be.ok
    expect(updateSpy.calledWith(verb.toUpperCase())).to.be.ok
    expect(updateSpy.calledWith(JSON.stringify(body))).to.be.ok
    expect(updateSpy.calledWith('')).not.to.be.ok

    expect(digestSpy.callCount).to.be.eq(1)
    expect(digestSpy.calledWith('hex')).to.be.ok

    expect(signedHash['FTX-SIGN']).to.deep.eq(digestSpy.returnValues[0])

    const signedHash2 = generateAuthSignature({
      keySecret,
      verb,
      path: new URL(dummyUrl).pathname,
      // without a body
    })

    expect(dateMock.callCount).to.be.eq(2)

    expect(createHmacSpy.callCount).to.be.eq(2)

    expect(updateSpy.calledWith('')).to.be.ok

    expect(updateSpy.callCount).to.be.eq(8)

    expect(digestSpy.callCount).to.be.eq(2)

    expect(signedHash2['FTX-SIGN']).to.deep.eq(digestSpy.returnValues[1])

    Sinon.restore()

  })

  it('should validate cache usage', async () => {

    mockAxiosRequest({ responseData: dummyResponse })

    await validateCache({
      cacheResult: dummyResponse,
      callMethod: async () => {

        const params: IAlunaHttpPublicParams = {
          url: dummyUrl,
          body: dummyBody,
          verb: AlunaHttpVerbEnum.GET,
        }

        await FtxHttp.publicRequest(params)

      },

    })

  })

})
