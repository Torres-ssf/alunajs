import { expect } from 'chai'
import crypto from 'crypto'
import { Agent } from 'https'
import { random } from 'lodash'
import Sinon from 'sinon'
import { ImportMock } from 'ts-mock-imports'

import { testCache } from '../../../test/macros/testCache'
import { mockAxiosRequest } from '../../../test/mocks/axios/request'
import { AlunaHttpVerbEnum } from '../../lib/enums/AlunaHtttpVerbEnum'
import { AlunaProtocolsEnum } from '../../lib/enums/AlunaProxyAgentEnum'
import { IAlunaCredentialsSchema } from '../../lib/schemas/IAlunaCredentialsSchema'
import {
  IAlunaProxySchema,
  IAlunaSettingsSchema,
} from '../../lib/schemas/IAlunaSettingsSchema'
import { mockAssembleRequestConfig } from '../../utils/axios/assembleRequestConfig.mock'
import { mockAlunaCache } from '../../utils/cache/AlunaCache.mock'
import { executeAndCatch } from '../../utils/executeAndCatch'
import * as BinanceHttpMod from './BinanceHttp'
import * as handleBinanceRequestErrorMod from './errors/handleBinanceRequestError'



describe(__filename, () => {

  const { BinanceHttp } = BinanceHttpMod

  const url = 'https://binance.com/api/path'
  const response = 'response'

  const query = new URLSearchParams()
  query.append('data1', 'Hello Wolrd!')
  query.append('data2', '10')


  const credentials: IAlunaCredentialsSchema = {
    key: 'key',
    secret: 'key',
    passphrase: 'key',
  }
  const signedHeader = {
    signedHeader: {
      Dummy: 'Dummy',
    },
    signedUrl: url,
  }
  const proxySettings: IAlunaProxySchema = {
    host: 'host',
    port: 8080,
    agent: new Agent(),
    protocol: AlunaProtocolsEnum.HTTPS,
  }
  const settings: IAlunaSettingsSchema = {
    proxySettings,
  }



  const mockDeps = (
    params: {
      mockGenerateAuthHeader?: boolean
      cacheParams?: {
        get?: any
        has?: boolean
        set?: boolean
      }
    } = {},
  ) => {

    const { assembleRequestConfig } = mockAssembleRequestConfig()

    const { request } = mockAxiosRequest()

    const {
      mockGenerateAuthHeader = true,
      cacheParams = {
        get: {},
        has: false,
        set: true,
      },
    } = params

    const generateAuthHeader = ImportMock.mockFunction(
      BinanceHttpMod,
      'generateAuthHeader',
      signedHeader,
    )

    const handleBinanceRequestError = ImportMock.mockFunction(
      handleBinanceRequestErrorMod,
      'handleBinanceRequestError',
    )

    if (!mockGenerateAuthHeader) {

      generateAuthHeader.restore()

    }

    const {
      cache,
      hashCacheKey,
    } = mockAlunaCache(cacheParams)

    return {
      cache,
      request,
      hashCacheKey,
      generateAuthHeader,
      assembleRequestConfig,
      handleBinanceRequestError,
    }

  }

  it('should execute public request just fine', async () => {

    // preparing data
    const verb = AlunaHttpVerbEnum.POST


    // mocking
    const {
      cache,
      request,
      hashCacheKey,
      generateAuthHeader,
      assembleRequestConfig,
    } = mockDeps()

    const binanceHttp = new BinanceHttp({})

    request.returns(Promise.resolve({ data: response }))


    // executing
    const responseData = await binanceHttp.publicRequest({
      verb,
      url,
      query,
    })


    // validating
    expect(responseData).to.be.eq(response)

    expect(binanceHttp.requestWeight.public).to.be.eq(1)
    expect(binanceHttp.requestWeight.authed).to.be.eq(0)

    expect(request.callCount).to.be.eq(1)
    expect(request.firstCall.args[0]).to.deep.eq({
      url,
      method: verb,
    })

    expect(hashCacheKey.callCount).to.be.eq(1)

    expect(cache.has.callCount).to.be.eq(1)
    expect(cache.set.callCount).to.be.eq(1)
    expect(cache.get.callCount).to.be.eq(0)

    expect(assembleRequestConfig.callCount).to.be.eq(1)
    expect(assembleRequestConfig.firstCall.args[0]).to.deep.eq({
      url,
      method: verb,
      proxySettings: undefined,
    })

    expect(generateAuthHeader.callCount).to.be.eq(0)

  })

  it('should execute authed request just fine', async () => {

    // preparing data
    const binanceHttp = new BinanceHttp({})


    // mocking
    const {
      cache,
      request,
      hashCacheKey,
      generateAuthHeader,
      assembleRequestConfig,
    } = mockDeps()

    request.returns(Promise.resolve({ data: response }))


    // executing
    const responseData = await binanceHttp.authedRequest({
      verb: AlunaHttpVerbEnum.POST,
      url,
      query,
      credentials,
    })


    // validating
    expect(responseData).to.be.eq(response)

    expect(binanceHttp.requestWeight.public).to.be.eq(0)
    expect(binanceHttp.requestWeight.authed).to.be.eq(1)

    expect(request.callCount).to.be.eq(1)
    expect(request.firstCall.args[0]).to.deep.eq({
      url,
      method: AlunaHttpVerbEnum.POST,
      headers: signedHeader.signedHeader,
    })

    expect(assembleRequestConfig.callCount).to.be.eq(1)

    expect(generateAuthHeader.callCount).to.be.eq(1)
    expect(generateAuthHeader.args[0][0]).to.deep.eq({
      credentials,
      query,
      url,
    })

    expect(hashCacheKey.callCount).to.be.eq(0)

    expect(cache.has.callCount).to.be.eq(0)
    expect(cache.get.callCount).to.be.eq(0)
    expect(cache.set.callCount).to.be.eq(0)

  })

  it('should properly increment request count on public requests', async () => {

    // preparing data
    const binanceHttp = new BinanceHttp({})

    const weight = random()
    const pubRequestCount = random()
    const authRequestCount = random()

    binanceHttp.requestWeight.public = pubRequestCount
    binanceHttp.requestWeight.authed = authRequestCount


    // mocking
    const { request } = mockDeps()

    request.returns(Promise.resolve({ data: response }))


    // executing
    await binanceHttp.publicRequest({
      url,
      query,
      weight,
    })


    // validating
    expect(binanceHttp.requestWeight.public).to.be.eq(pubRequestCount + weight)
    expect(binanceHttp.requestWeight.authed).to.be.eq(authRequestCount)

    expect(request.callCount).to.be.eq(1)

  })

  it('should properly increment request count on authed requests', async () => {

    // preparing data
    const binanceHttp = new BinanceHttp({})

    const weight = random()
    const pubRequestCount = random()
    const authRequestCount = random()

    binanceHttp.requestWeight.public = pubRequestCount
    binanceHttp.requestWeight.authed = authRequestCount


    // mocking
    const { request } = mockDeps()

    request.returns(Promise.resolve({ data: response }))


    // executing
    await binanceHttp.authedRequest({
      url,
      query,
      weight,
      credentials,
    })


    // validating
    expect(binanceHttp.requestWeight.public).to.be.eq(pubRequestCount)
    expect(binanceHttp.requestWeight.authed).to.be.eq(authRequestCount + weight)

    expect(request.callCount).to.be.eq(1)

  })

  it('should properly handle request error on public requests', async () => {

    // preparing data
    const binanceHttp = new BinanceHttp({})

    const throwedError = new Error('unknown error')


    // mocking
    const {
      request,
      handleBinanceRequestError,
    } = mockDeps()

    request.returns(Promise.reject(throwedError))


    // executing
    const publicRes = await executeAndCatch(() => binanceHttp.publicRequest({
      url,
      query,
    }))


    // validating
    expect(publicRes.result).not.to.be.ok

    expect(request.callCount).to.be.eq(1)

    expect(handleBinanceRequestError.callCount).to.be.eq(1)

  })

  it('should properly handle request error on authed requests', async () => {

    // preparing data
    const binanceHttp = new BinanceHttp({})

    const throwedError = new Error('unknown error')


    // mocking
    const {
      request,
      handleBinanceRequestError,
    } = mockDeps()

    request.returns(Promise.reject(throwedError))


    // executing
    const autheRes = await executeAndCatch(() => binanceHttp.authedRequest({
      url,
      query,
      credentials,
    }))


    // validating
    expect(autheRes.result).not.to.be.ok

    expect(request.callCount).to.be.eq(1)

    expect(handleBinanceRequestError.callCount).to.be.eq(1)

  })

  it('should properly use proxy settings on public requests', async () => {

    // preparing data
    const binanceHttp = new BinanceHttp({})


    // mocking
    const {
      request,
      assembleRequestConfig,
    } = mockDeps()

    request.returns(Promise.resolve({ data: response }))


    // executing
    await binanceHttp.publicRequest({
      url,
      query,
      settings,
    })


    // validating
    expect(request.callCount).to.be.eq(1)

    expect(assembleRequestConfig.callCount).to.be.eq(1)
    expect(assembleRequestConfig.firstCall.args[0]).to.deep.eq({
      url,
      method: AlunaHttpVerbEnum.GET,
      proxySettings: settings.proxySettings,
    })

  })

  it('should properly use proxy settings on authed requests', async () => {

    // preparing data
    const binanceHttp = new BinanceHttp({})


    // mocking
    const {
      request,
      assembleRequestConfig,
    } = mockDeps()

    request.returns(Promise.resolve({ data: response }))


    // executing
    await binanceHttp.authedRequest({
      url,
      query,
      settings,
      credentials,
    })


    // validating
    expect(request.callCount).to.be.eq(1)

    expect(assembleRequestConfig.callCount).to.be.eq(1)
    expect(assembleRequestConfig.firstCall.args[0]).to.deep.eq({
      url,
      method: AlunaHttpVerbEnum.POST,
      headers: signedHeader.signedHeader,
      proxySettings: settings.proxySettings,
    })

  })

  it('should generate signed auth header just fine w/o query', async () => {

    // preparing data
    const currentDate = Date.now()

    const timestampParams = new URLSearchParams()
    timestampParams.append('recvWindow', '60000')
    timestampParams.append('timestamp', `${currentDate}`)

    const signedHeader: BinanceHttpMod.IBinanceSignedHeaders = {
      'X-MBX-APIKEY': credentials.key,
    }

    // mocking
    const dateMock = ImportMock.mockFunction(
      Date,
      'now',
      currentDate,
    )

    const createHmacSpy = Sinon.spy(crypto, 'createHmac')
    const updateSpy = Sinon.spy(crypto.Hmac.prototype, 'update')
    const digestHmacSpy = Sinon.spy(crypto.Hmac.prototype, 'digest')

    // executing
    const signedHash = BinanceHttpMod.generateAuthHeader({
      credentials,
      url,
    })

    // validating
    expect(dateMock.callCount).to.be.eq(1)
    expect(createHmacSpy.callCount).to.be.eq(1)
    expect(createHmacSpy
      .firstCall
      .calledWith('sha256', credentials.secret)).to.be.ok

    expect(updateSpy.callCount).to.be.eq(1)
    expect(updateSpy.calledWith(timestampParams.toString())).to.be.ok

    expect(digestHmacSpy.callCount).to.be.eq(1)
    expect(digestHmacSpy.calledWith('hex')).to.be.ok

    timestampParams.append('signature', digestHmacSpy.returnValues[0])

    const signedUrl = `${url}?${timestampParams.toString()}`

    expect(signedHash.signedHeader).to.deep.eq(signedHeader)
    expect(signedHash.signedUrl).to.deep.eq(signedUrl)

  })

  it('should generate signed auth header just fine w/ query', async () => {

    // preparing data
    const currentDate = Date.now()

    const queryWithTimestampParams = new URLSearchParams(query)
    queryWithTimestampParams.append('recvWindow', '60000')
    queryWithTimestampParams.append('timestamp', `${currentDate}`)

    const signedHeader: BinanceHttpMod.IBinanceSignedHeaders = {
      'X-MBX-APIKEY': credentials.key,
    }

    // mocking
    const dateMock = ImportMock.mockFunction(
      Date,
      'now',
      currentDate,
    )

    const createHmacSpy = Sinon.spy(crypto, 'createHmac')
    const updateSpy = Sinon.spy(crypto.Hmac.prototype, 'update')
    const digestHmacSpy = Sinon.spy(crypto.Hmac.prototype, 'digest')

    // executing
    const signedHash = BinanceHttpMod.generateAuthHeader({
      credentials,
      url,
      query,
    })

    // validating
    expect(dateMock.callCount).to.be.eq(1)
    expect(createHmacSpy.callCount).to.be.eq(1)
    expect(createHmacSpy
      .firstCall
      .calledWith('sha256', credentials.secret)).to.be.ok

    expect(updateSpy.callCount).to.be.eq(1)
    expect(updateSpy.calledWith(queryWithTimestampParams.toString())).to.be.ok

    expect(digestHmacSpy.callCount).to.be.eq(1)
    expect(digestHmacSpy.calledWith('hex')).to.be.ok

    queryWithTimestampParams.append('signature', digestHmacSpy.returnValues[0])

    const signedUrl = `${url}?${queryWithTimestampParams.toString()}`

    expect(signedHash.signedHeader).to.deep.eq(signedHeader)
    expect(signedHash.signedUrl).to.deep.eq(signedUrl)

  })

  /**
   * Executes macro test.
   * */
  testCache({ HttpClass: BinanceHttp })

})
