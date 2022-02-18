import axios, { AxiosError } from 'axios'
import { expect } from 'chai'
import Sinon from 'sinon'
import { ImportMock } from 'ts-mock-imports'

import { AlunaError } from '../../lib/core/AlunaError'
import { AlunaHttpVerbEnum } from '../../lib/enums/AlunaHtttpVerbEnum'
import { IAlunaKeySecretSchema } from '../../lib/schemas/IAlunaKeySecretSchema'
import * as BitmexHttpMod from './BitmexHttp'



describe('BitmexHttp', () => {

  const { bitmexRequestErrorHandler } = BitmexHttpMod

  const {
    publicRequest,
    privateRequest,
  } = BitmexHttpMod.BitmexHttp



  const dummyUrl = 'http://dummy.com/path/XXXDUMMY/dummy'

  const dummyBody = { dummy: 'dummy-body' }

  // const dummySignedHeaders = { 'X-DUMMY': 'dummy' }

  const dummyData = { data: 'dummy-data' }

  it('should defaults the http verb to get on public requests', async () => {

    const requestSpy = Sinon.spy(async () => dummyData)

    const axiosCreate = ImportMock.mockFunction(
      axios,
      'create',
      {
        request: requestSpy,
      },
    )

    await publicRequest({
      // http verb not informed
      url: dummyUrl,
      body: dummyBody,
    })

    expect(axiosCreate.callCount).to.be.eq(1)

    expect(requestSpy.callCount).to.be.eq(1)

    expect(requestSpy.args[0]).to.deep.eq([{
      url: dummyUrl,
      method: AlunaHttpVerbEnum.GET,
      data: dummyBody,
    }])

  })

  it('should execute public request just fine', async () => {

    const requestSpy = Sinon.spy(() => dummyData)

    const axiosMock = ImportMock.mockFunction(
      axios,
      'create',
      {
        request: requestSpy,
      },
    )

    const responseData = await publicRequest({
      verb: AlunaHttpVerbEnum.GET,
      url: dummyUrl,
      body: dummyBody,
    })

    expect(axiosMock.callCount).to.be.eq(1)

    expect(requestSpy.callCount).to.be.eq(1)
    expect(requestSpy.args[0]).to.deep.eq([{
      url: dummyUrl,
      method: AlunaHttpVerbEnum.GET,
      data: dummyBody,
    }])

    expect(responseData).to.deep.eq(requestSpy.returnValues[0].data)

  })

  // it('should defaults the http verb to post on private requests', \
  // async () => {

  //   const requestSpy = Sinon.spy(async () => ({ data: 'dummy-data' }))

  //   const generateAuthHeaderMock = ImportMock.mockFunction(
  //     BitmexHttp,
  //     'generateAuthHeader',
  //     dummySignedHeaders,
  //   )

  //   const axiosCreate = ImportMock.mockFunction(
  //     axios,
  //     'create',
  //     {
  //       request: requestSpy,
  //     },
  //   )

  //   await privateRequest({
  //     // http verb not informed
  //     keySecret: {} as IAlunaKeySecretSchema,
  //     url: 'http://dummy.com',
  //   })

  //   expect(axiosCreate.callCount).to.be.eq(1)

  //   expect(generateAuthHeaderMock.callCount).to.be.eq(1)

  //   expect(requestSpy.callCount).to.be.eq(1)

  //   expect(requestSpy.args[0]).to.deep.eq([{
  //     url: 'http://dummy.com',
  //     method: AlunaHttpVerbEnum.POST,
  //     data: undefined,
  //     headers: dummySignedHeaders,
  //   }])

  // })

  it('should execute private request just fine', async () => {

    let error
    let result

    try {

      result = await privateRequest({
        verb: AlunaHttpVerbEnum.POST,
        url: dummyUrl,
        body: dummyBody,
        keySecret: {} as IAlunaKeySecretSchema,
      })


    } catch (err) {

      error = err

    }

    expect(result).not.to.ok

    expect(error.message).to.be.eq('not implemented')

  })

  it('should ensure formatRequestError is call on resquest error', async (

  ) => {

    const message = 'Dummy error'

    const formatRequestErrorSpy = Sinon.spy(
      BitmexHttpMod,
      'bitmexRequestErrorHandler',
    )

    const requestSpy = Sinon.spy(() => {

      throw new Error(message)

    })

    ImportMock.mockFunction(
      axios,
      'create',
      {
        request: requestSpy,
      },
    )

    let result
    let error

    try {

      result = await publicRequest({
        url: dummyUrl,
      })

    } catch (err) {

      error = err

    }

    expect(result).not.to.be.ok
    expect(error.message).to.be.eq(message)

    const calledArg = formatRequestErrorSpy.args[0][0]

    expect(formatRequestErrorSpy.callCount).to.be.eq(1)
    expect(calledArg).to.be.ok
    expect(calledArg.message).to.be.eq(message)

  })

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

  // it('should generate signed auth header just fine', async () => {

  //   const createHmacSpy = Sinon.spy(crypto, 'createHmac')
  //   const createHashSpy = Sinon.spy(crypto, 'createHash')

  //   const updateSpy = Sinon.spy(crypto.Hmac.prototype, 'update')
  //   const updateHashSpy = Sinon.spy(crypto.Hash.prototype, 'update')

  //   const digestHmacSpy = Sinon.spy(crypto.Hmac.prototype, 'digest')
  //   const digestHashSpy = Sinon.spy(crypto.Hash.prototype, 'digest')

  //   const currentDate = 'current-date'

  //   const timestampMock = { toString: () => currentDate }

  //   const dateMock = ImportMock.mockFunction(
  //     Date.prototype,
  //     'getTime',
  //     timestampMock,
  //   )

  //   const stringifyBody = 'stringify-body'

  //   const stringfyMock = ImportMock.mockFunction(
  //     JSON,
  //     'stringify',
  //     stringifyBody,
  //   )

  //   const keySecret = {
  //     key: 'dummy-key',
  //     secret: 'dummy-secret',
  //   } as IAlunaKeySecretSchema

  //   const path = 'path'
  //   const verb = 'verb' as AlunaHttpVerbEnum
  //   const body = dummyBody
  //   const url = dummyUrl

  //   const contentHash = crypto
  //     .createHash('sha512')
  //     .update(body ? JSON.stringify(body) : '')
  //     .digest('hex')

  //   const preSigned = [
  //     timestampMock,
  //     url,
  //     verb.toUpperCase(),
  //     contentHash,
  //   ].join('')

  //   const signedHash = generateAuthHeader({
  //     keySecret,
  //     path,
  //     verb,
  //     body,
  //     url,
  //   })

  //   expect(dateMock.callCount).to.be.eq(1)

  //   expect(createHmacSpy.callCount).to.be.eq(1)
  //   expect(createHashSpy.callCount).to.be.eq(2)
  //   expect(createHashSpy
  //     .secondCall
  //     .calledWith('sha512')).to.be.ok
  //   expect(createHmacSpy
  //     .firstCall
  //     .calledWith('sha512', keySecret.secret)).to.be.ok

  //   expect(updateSpy.callCount).to.be.eq(1)
  //   expect(updateHashSpy.callCount).to.be.eq(2)
  //   expect(updateHashSpy.secondCall.calledWith(JSON.stringify(body))).to.be.
  // ok

  //   expect(stringfyMock.callCount).to.be.eq(3)
  //   expect(stringfyMock.calledWith(body)).to.be.ok

  //   expect(digestHmacSpy.callCount).to.be.eq(1)
  //   expect(digestHmacSpy.calledWith('hex')).to.be.ok

  //   expect(digestHashSpy.callCount).to.be.eq(2)
  //   expect(digestHashSpy.calledWith('hex')).to.be.ok

  //   const signedHeader = crypto
  //     .createHmac('sha512', keySecret.secret)
  //     .update(preSigned)
  //     .digest('hex')

  //   expect(signedHash['Api-Content-Hash']).to.deep.eq(contentHash)
  //   expect(signedHash['Api-Key']).to.deep.eq(keySecret.key)
  //   expect(signedHash['Api-Timestamp']).to.deep.eq(timestampMock)
  //   expect(signedHash['Api-Signature']).to.deep.eq(signedHeader)

  //   const signedHash2 = generateAuthHeader({
  //     keySecret,
  //     path,
  //     verb,
  //     url,
  //     // without a body
  //   })

  //   expect(dateMock.callCount).to.be.eq(2)

  //   expect(createHmacSpy.callCount).to.be.eq(3)

  //   // when no body is passed must not call stringfy on empty string
  //   expect(stringfyMock.callCount).to.be.eq(3)
  //   expect(stringfyMock.calledWith('')).not.to.be.ok

  //   expect(updateSpy.callCount).to.be.eq(3)

  //   expect(digestHmacSpy.callCount).to.be.eq(3)

  //   const contentHash2 = crypto.createHash('sha512').update('').digest('hex')

  //   expect(signedHash2['Api-Content-Hash']).to.deep.eq(contentHash2)
  //   expect(
  //     signedHash2['Api-Key'],
  //   ).to.deep.eq(keySecret.key)
  //   expect(signedHash2['Api-Timestamp']).to.deep.eq(timestampMock)

  //   Sinon.restore()

  // })

})
