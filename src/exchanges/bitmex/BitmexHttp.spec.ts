import { AxiosError } from 'axios'
import { expect } from 'chai'
import crypto from 'crypto'
import { Agent as HttpAgent } from 'http'
import { Agent as HttpsAgent } from 'https'
import Sinon from 'sinon'
import { ImportMock } from 'ts-mock-imports'

import { mockAxiosRequest } from '../../../test/helpers/http'
import { AlunaError } from '../../lib/core/AlunaError'
import { IAlunaHttpPublicParams } from '../../lib/core/IAlunaHttp'
import { AlunaHttpVerbEnum } from '../../lib/enums/AlunaHtttpVerbEnum'
import { AlunaGenericErrorCodes } from '../../lib/errors/AlunaGenericErrorCodes'
import { IAlunaKeySecretSchema } from '../../lib/schemas/IAlunaKeySecretSchema'
import {
  IAlunaProxySchema,
  IAlunaSettingsSchema,
} from '../../lib/schemas/IAlunaSettingsSchema'
import {
  mockAlunaCache,
  validateCache,
} from '../../utils/cache/AlunaCache.mock'
import { Bitmex } from './Bitmex'
import * as BitmexHttpMod from './BitmexHttp'



describe('BitmexHttp', () => {

  const {
    generateAuthHeader,
    bitmexRequestErrorHandler,
  } = BitmexHttpMod

  const {
    publicRequest,
    privateRequest,
  } = BitmexHttpMod.BitmexHttp

  const dummyUrl = 'http://dummy.com/path/XXXDUMMY/dummy'
  const dummyBody = { ids: ['id'] }
  const dummyResponse = { data: 'dummy-data' }
  const dummyKeysecret: IAlunaKeySecretSchema = {
    key: 'key',
    secret: 'secret',
  }
  const dummySignedHeaders: BitmexHttpMod.IBitmexRequestHeaders = {
    'api-expires': 'expires',
    'api-key': 'key',
    'api-signature': 'signature',
  }

  const host = 'localhost'
  const port = 3000

  const httpProxySettings: IAlunaProxySchema = {
    host,
    port,
    protocol: 'http',
    agent: new HttpAgent({ keepAlive: true }),
  }

  const httpsProxySettings: IAlunaProxySchema = {
    host,
    port,
    protocol: 'https',
    agent: new HttpsAgent({ keepAlive: true }),
  }

  const mockDeps = (
    params: {
      requestResponse?: any,
      getCache?: any,
      hasCache?: boolean,
      setCache?: boolean,
      signedheaderResponse?: BitmexHttpMod.IBitmexRequestHeaders,
      errorMsgRes?: string,
      mockedExchangeSettings?: IAlunaSettingsSchema,
    } = {},
  ) => {

    const {
      requestResponse = {},
      signedheaderResponse = dummySignedHeaders,
      getCache = {},
      hasCache = false,
      setCache = false,
      errorMsgRes = 'error',
      mockedExchangeSettings = {},
    } = params

    const throwedError = new AlunaError({
      code: AlunaGenericErrorCodes.UNKNOWN,
      message: errorMsgRes,
      httpStatusCode: 400,
    })

    const {
      requestSpy,
      axiosCreateMock,
    } = mockAxiosRequest(requestResponse)

    const exchangeMock = ImportMock.mockOther(
      Bitmex,
      'settings',
      mockedExchangeSettings,
    )

    const generateAuthHeaderMock = ImportMock.mockFunction(
      BitmexHttpMod,
      'generateAuthHeader',
      signedheaderResponse,
    )

    const formatRequestErrorSpy = ImportMock.mockFunction(
      BitmexHttpMod,
      'bitmexRequestErrorHandler',
      throwedError,
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
      throwedError,
      exchangeMock,
      axiosCreateMock,
      formatRequestErrorSpy,
      generateAuthHeaderMock,
    }

  }

  it(
    'should defaults the http verb to get on public requests',
    async () => {

      const {
        requestSpy,
        axiosCreateMock,
      } = mockDeps({
        requestResponse: Promise.resolve(dummyResponse),
      })

      await publicRequest({
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

    },
  )

  it('should execute public request just fine', async () => {

    const {
      requestSpy,
      axiosCreateMock,
    } = mockDeps({
      requestResponse: Promise.resolve(dummyResponse),
    })

    const responseData = await publicRequest({
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

    expect(responseData).to.deep.eq(dummyResponse.data)

  })

  it(
    'should defaults the http verb to POST on private requests',
    async () => {

      const {
        requestSpy,
        axiosCreateMock,
        generateAuthHeaderMock,
      } = mockDeps({
        requestResponse: Promise.resolve(dummyResponse),
      })


      await privateRequest({
      // http verb not informed
        keySecret: {} as IAlunaKeySecretSchema,
        url: 'http://dummy.com',
      })

      expect(axiosCreateMock.callCount).to.be.eq(1)

      expect(generateAuthHeaderMock.callCount).to.be.eq(1)

      expect(requestSpy.callCount).to.be.eq(1)

      expect(requestSpy.args[0]).to.deep.eq([{
        url: 'http://dummy.com',
        method: AlunaHttpVerbEnum.POST,
        data: undefined,
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
      requestResponse: Promise.resolve(dummyResponse),
    })

    const responseData = await privateRequest({
      verb: AlunaHttpVerbEnum.POST,
      url: dummyUrl,
      body: dummyBody,
      keySecret: {} as IAlunaKeySecretSchema,
    })

    expect(axiosCreateMock.callCount).to.be.eq(1)

    expect(generateAuthHeaderMock.callCount).to.be.eq(1)
    expect(generateAuthHeaderMock.calledWith({
      verb: AlunaHttpVerbEnum.POST,
      path: new URL(dummyUrl).pathname,
      body: dummyBody,
      keySecret: {},
    })).to.be.ok

    expect(requestSpy.callCount).to.be.eq(1)
    expect(requestSpy.args[0]).to.deep.eq([{
      url: dummyUrl,
      method: AlunaHttpVerbEnum.POST,
      data: dummyBody,
      headers: dummySignedHeaders,
    }])

    expect(responseData).to.deep.eq(dummyResponse.data)

  })

  it(
    "should ensure 'bitmexRequestErrorHandler' is call on resquest error",
    async () => {

      let error

      const message = 'Dummy error'

      const {
        formatRequestErrorSpy,
      } = mockDeps({
        requestResponse: Promise.reject(new Error(message)),
        errorMsgRes: message,
      })

      try {

        await publicRequest({
          url: dummyUrl,
        })

      } catch (err) {

        error = err

      }

      expect(error.message).to.be.eq(message)

      const calledArg1 = formatRequestErrorSpy.args[0][0]

      expect(formatRequestErrorSpy.callCount).to.be.eq(1)
      expect(calledArg1).to.be.ok
      expect(calledArg1.message).to.be.eq(message)

      try {

        await privateRequest({
          url: dummyUrl,
          body: dummyBody,
          keySecret: {} as IAlunaKeySecretSchema,
        })

      } catch (err) {

        error = err

      }

      expect(error.message).to.be.eq(message)

      const calledArg2 = formatRequestErrorSpy.args[1][0]

      expect(formatRequestErrorSpy.callCount).to.be.eq(2)
      expect(calledArg2).to.be.ok
      expect(calledArg2.message).to.be.eq(message)

    },
  )

  it('should ensure request error is being handle', async () => {

    const dummyError = 'dummy-error'

    const axiosError1 = {
      isAxiosError: true,
      response: {
        status: 400,
        data: {
          error: {
            message: dummyError,
          },
        },
      },
    }

    const error1 = bitmexRequestErrorHandler(axiosError1 as AxiosError)

    expect(error1 instanceof AlunaError).to.be.ok
    expect(error1.message).to.be.eq(dummyError)
    expect(error1.httpStatusCode).to.be.eq(400)

    const axiosError2 = {
      isAxiosError: true,
      response: {
        data: {
        },
      },
    }

    const error2 = bitmexRequestErrorHandler(axiosError2 as AxiosError)

    expect(error2 instanceof AlunaError).to.be.ok
    expect(
      error2.message,
    ).to.be.eq('Error while trying to execute Axios request')
    expect(error2.httpStatusCode).to.be.eq(400)

    const axiosError3 = {
      isAxiosError: true,
      response: {
      },
    }

    const error3 = bitmexRequestErrorHandler(axiosError3 as AxiosError)

    expect(error3 instanceof AlunaError).to.be.ok
    expect(
      error3.message,
    ).to.be.eq('Error while trying to execute Axios request')
    expect(error3.httpStatusCode).to.be.eq(400)

    const axiosError4 = {
      isAxiosError: true,
    }

    const error4 = bitmexRequestErrorHandler(axiosError4 as AxiosError)

    expect(error4 instanceof AlunaError).to.be.ok
    expect(error4.message).to.be
      .eq('Error while trying to execute Axios request')
    expect(error4.httpStatusCode).to.be.eq(400)


    const error = {
      message: dummyError,
    }

    const error5 = bitmexRequestErrorHandler(error as Error)

    expect(error5 instanceof AlunaError).to.be.ok
    expect(error5.message).to.be.eq(dummyError)
    expect(error5.httpStatusCode).to.be.eq(400)

    const unknown = {}

    const error6 = bitmexRequestErrorHandler(unknown as any)

    expect(error6 instanceof AlunaError).to.be.ok
    expect(
      error6.message,
    ).to.be.eq('Error while trying to execute Axios request')
    expect(error6.httpStatusCode).to.be.eq(400)

  })

  it('should generate signed auth header just fine', async () => {

    const createHmacSpy = Sinon.spy(crypto, 'createHmac')

    const updateSpy = Sinon.spy(crypto.Hmac.prototype, 'update')

    const digestSpy = Sinon.spy(crypto.Hmac.prototype, 'digest')

    const mockedNonce = Date.now().toString()

    const dateNowToStringMock = { toString: () => mockedNonce }

    const dateNowMock = ImportMock.mockFunction(
      Date,
      'now',
      dateNowToStringMock,
    )

    const stringifyBody = 'stringify-body'

    const stringfyMock = ImportMock.mockFunction(
      JSON,
      'stringify',
      stringifyBody,
    )

    const keySecret = {
      key: 'dummy-key',
      secret: 'dummy-secret',
    } as IAlunaKeySecretSchema

    const path = 'path'
    const verb = 'verb' as AlunaHttpVerbEnum
    const body = dummyBody

    const signedHash = generateAuthHeader({
      keySecret,
      path,
      verb,
      body,
    })

    expect(dateNowMock.callCount).to.be.eq(1)

    expect(createHmacSpy.callCount).to.be.eq(1)
    expect(createHmacSpy.calledWith('sha256', keySecret.secret)).to.be.ok

    expect(updateSpy.callCount).to.be.eq(4)
    expect(updateSpy.calledWith(mockedNonce)).to.be.ok
    expect(updateSpy.calledWith(verb.toUpperCase())).to.be.ok
    expect(updateSpy.calledWith(path)).to.be.ok
    expect(updateSpy.calledWith(stringifyBody)).to.be.ok

    expect(stringfyMock.callCount).to.be.eq(1)
    expect(stringfyMock.calledWith(body)).to.be.ok

    expect(digestSpy.callCount).to.be.eq(1)
    expect(digestSpy.calledWith('hex')).to.be.ok

    expect(signedHash['api-expires']).to.deep.eq(mockedNonce)
    expect(signedHash['api-key']).to.deep.eq(keySecret.key)
    expect(signedHash['api-signature']).to.deep.eq(digestSpy.returnValues[0])

    const signedHash2 = generateAuthHeader({
      keySecret,
      path,
      verb,
      // without a body
    })

    expect(dateNowMock.callCount).to.be.eq(2)

    expect(createHmacSpy.callCount).to.be.eq(2)

    // when no body is passed must not call stringfy on empty string
    expect(stringfyMock.callCount).to.be.eq(1)
    expect(stringfyMock.calledWith('')).not.to.be.ok

    expect(updateSpy.callCount).to.be.eq(8)

    expect(digestSpy.callCount).to.be.eq(2)

    expect(signedHash2['api-expires']).to.deep.eq(mockedNonce)
    expect(signedHash2['api-key']).to.deep.eq(keySecret.key)
    expect(signedHash2['api-signature']).to.deep.eq(digestSpy.returnValues[1])

  })

  it("should use http proxy when it's available", async () => {

    const { requestSpy } = mockDeps({
      requestResponse: Promise.resolve(dummyResponse),
      mockedExchangeSettings: {
        proxySettings: httpProxySettings,
      },
    })

    const publicRes = await publicRequest({
      url: dummyUrl,
      body: dummyBody as any,
    })

    expect(publicRes).to.be.eq(dummyResponse.data)

    expect(requestSpy.args[0]).to.deep.eq([
      {
        url: dummyUrl,
        method: AlunaHttpVerbEnum.GET,
        proxy: {
          host: httpProxySettings.host,
          port: httpProxySettings.port,
          protocol: httpProxySettings.protocol,
        },
        httpAgent: httpProxySettings.agent,
        data: dummyBody,
      },
    ])

    const privateRes = await privateRequest({
      url: dummyUrl,
      body: dummyBody as any,
      keySecret: dummyKeysecret,
    })

    expect(privateRes).to.be.eq(dummyResponse.data)

    expect(requestSpy.args[1]).to.deep.eq([
      {
        url: dummyUrl,
        method: AlunaHttpVerbEnum.POST,
        headers: dummySignedHeaders,
        data: dummyBody,
        proxy: {
          host: httpProxySettings.host,
          port: httpProxySettings.port,
          protocol: httpProxySettings.protocol,
        },
        httpAgent: httpProxySettings.agent,
      },
    ])

  })

  it("should use https proxy when it's available", async () => {

    const { requestSpy } = mockDeps({
      requestResponse: Promise.resolve(dummyResponse),
      mockedExchangeSettings: {
        proxySettings: httpsProxySettings,
      },
    })

    const publicRes = await publicRequest({
      url: dummyUrl,
      body: dummyBody as any,
    })

    expect(publicRes).to.be.eq(dummyResponse.data)

    expect(requestSpy.args[0]).to.deep.eq([
      {
        url: dummyUrl,
        method: AlunaHttpVerbEnum.GET,
        proxy: {
          host: httpsProxySettings.host,
          port: httpsProxySettings.port,
          protocol: httpsProxySettings.protocol,
        },
        httpsAgent: httpsProxySettings.agent,
        data: dummyBody,
      },
    ])

    const privateRes = await privateRequest({
      url: dummyUrl,
      body: dummyBody as any,
      keySecret: dummyKeysecret,
    })

    expect(privateRes).to.be.eq(dummyResponse.data)

    expect(requestSpy.args[1]).to.deep.eq([
      {
        url: dummyUrl,
        method: AlunaHttpVerbEnum.POST,
        headers: dummySignedHeaders,
        data: dummyBody,
        proxy: {
          host: httpsProxySettings.host,
          port: httpsProxySettings.port,
          protocol: httpsProxySettings.protocol,
        },
        httpsAgent: httpsProxySettings.agent,
      },
    ])

  })

  it('should validate cache usage', async () => {

    mockAxiosRequest(dummyResponse)

    await validateCache({
      cacheResult: dummyResponse,
      callMethod: async () => {

        const params: IAlunaHttpPublicParams = {
          url: dummyUrl,
          body: dummyBody,
          verb: AlunaHttpVerbEnum.GET,
        }

        await publicRequest(params)

      },

    })

  })

})
