import { expect } from 'chai'
import { ImportMock } from 'ts-mock-imports'

import { AlunaError } from '../../../lib/core/AlunaError'
import { IAlunaExchange } from '../../../lib/core/IAlunaExchange'
import { AlunaAccountEnum } from '../../../lib/enums/AlunaAccountEnum'
import { AlunaHttpVerbEnum } from '../../../lib/enums/AlunaHtttpVerbEnum'
import { AlunaOrderSideEnum } from '../../../lib/enums/AlunaOrderSideEnum'
import { AlunaOrderStatusEnum } from '../../../lib/enums/AlunaOrderStatusEnum'
import { AlunaOrderTypesEnum } from '../../../lib/enums/AlunaOrderTypesEnum'
import { AlunaGenericErrorCodes } from '../../../lib/errors/AlunaGenericErrorCodes'
import { ValrOrderStatusEnum } from '../enums/ValrOrderStatusEnum'
import { ValrOrderTypesEnum } from '../enums/ValrOrderTypesEnum'
import { ValrSideEnum } from '../enums/ValrSideEnum'
import {
  IValrOrderGetSchema,
  IValrOrderListSchema,
} from '../schemas/IValrOrderSchema'
import { ValrOrderParser } from '../schemas/parsers/ValrOrderParser'
import { VALR_RAW_CURRENCY_PAIRS } from '../test/fixtures/valrMarket'
import {
  VALR_PARSED_OPEN_ORDERS,
  VALR_RAW_GET_ORDERS,
  VALR_RAW_LIST_OPEN_ORDERS,
} from '../test/fixtures/valrOrder'
import { ValrHttp } from '../ValrHttp'
import { ValrMarketModule } from './ValrMarketModule'
import { ValrOrderReadModule } from './ValrOrderReadModule'



describe('ValrOrderReadModule', () => {

  const valrOrderReadModule = ValrOrderReadModule.prototype

  it('should list all Valr raw open orders just fine', async () => {

    ImportMock.mockOther(
      valrOrderReadModule,
      'exchange',
      {
        keySecret: {
          key: '',
          secret: '',
        },
      } as IAlunaExchange,
    )

    const requestMock = ImportMock.mockFunction(
      ValrHttp,
      'privateRequest',
      {
        data: VALR_RAW_LIST_OPEN_ORDERS,
        apiRequestCount: 1,
      },
    )

    const { rawOrders } = await valrOrderReadModule.listRaw()

    expect(requestMock.callCount).to.be.eq(1)

    expect(rawOrders.length).to.be.eq(5)

    rawOrders.forEach((order, index) => {

      const {
        orderId,
        createdAt,
        currencyPair,
        filledPercentage,
        originalQuantity,
        price,
        remainingQuantity,
        side,
        status,
        timeInForce,
        type,
        updatedAt,
        customerOrderId,
        stopPrice,
      } = VALR_RAW_LIST_OPEN_ORDERS[index]

      expect(order.orderId).to.be.eq(orderId)
      expect(order.createdAt).to.be.eq(createdAt)
      expect(order.currencyPair).to.be.eq(currencyPair)
      expect(order.filledPercentage).to.be.eq(filledPercentage)
      expect(order.originalQuantity).to.be.eq(originalQuantity)
      expect(order.price).to.be.eq(price)
      expect(order.remainingQuantity).to.be.eq(remainingQuantity)
      expect(order.side).to.be.eq(side)
      expect(order.status).to.be.eq(status)
      expect(order.timeInForce).to.be.eq(timeInForce)
      expect(order.type).to.be.eq(type)
      expect(order.updatedAt).to.be.eq(updatedAt)
      expect(order.customerOrderId).to.be.eq(customerOrderId)
      expect(order.stopPrice).to.be.eq(stopPrice)

    })

  })

  it('should list all Valr parsed open orders just fine', async () => {

    const listRawMock = ImportMock.mockFunction(
      valrOrderReadModule,
      'listRaw',
      { rawOrders: ['raw-orders'], apiRequestCount: 1 },
    )

    const parseManyMock = ImportMock.mockFunction(
      valrOrderReadModule,
      'parseMany',
      {
        orders: VALR_PARSED_OPEN_ORDERS,
        apiRequestCount: 1,
      },
    )

    const { orders: parsedOrders } = await valrOrderReadModule.list()

    expect(listRawMock.callCount).to.be.eq(1)

    expect(parseManyMock.callCount).to.be.eq(1)

    expect(parsedOrders.length).to.be.eq(4)

    parsedOrders.forEach((order, index) => {

      const {
        account,
        amount,
        id,
        placedAt,
        side,
        status,
        symbolPair,
        total,
        type,
        canceledAt,
        filledAt,
        limitRate,
        rate,
        stopRate,
      } = VALR_PARSED_OPEN_ORDERS[index]

      expect(order.id).to.be.eq(id)
      expect(order.account).to.be.eq(account)
      expect(order.amount).to.be.eq(amount)
      expect(order.placedAt).to.be.eq(placedAt)
      expect(order.side).to.be.eq(side)
      expect(order.status).to.be.eq(status)
      expect(order.symbolPair).to.be.eq(symbolPair)
      expect(order.total).to.be.eq(total)
      expect(order.type).to.be.eq(type)
      expect(order.canceledAt).to.be.eq(canceledAt)
      expect(order.filledAt).to.be.eq(filledAt)
      expect(order.limitRate).to.be.eq(limitRate)
      expect(order.rate).to.be.eq(rate)
      expect(order.stopRate).to.be.eq(stopRate)

    })

  })

  it('should get a raw Valr order status just fine', async () => {

    const keySecret = {
      key: '',
      secret: '',
    }

    ImportMock.mockOther(
      valrOrderReadModule,
      'exchange',
      {
        keySecret,
      } as IAlunaExchange,
    )

    const requestMock = ImportMock.mockFunction(
      ValrHttp,
      'privateRequest',
      {
        data: VALR_RAW_GET_ORDERS[0],
        apiRequestCount: 1,
      },
    )

    const symbolPair = 'symbol'
    const id = 'id'

    const { rawOrder } = await valrOrderReadModule.getRaw({
      id,
      symbolPair,
    })

    expect(requestMock.callCount).to.be.eq(1)
    expect(requestMock.args[0][0]).to.includes({
      verb: AlunaHttpVerbEnum.GET,
      url: `https://api.valr.com/v1/orders/${symbolPair}/orderid/${id}`,
    })

    expect(rawOrder.orderType).to.be.eq(ValrOrderTypesEnum.STOP_LOSS_LIMIT)
    expect(rawOrder.orderStatusType).to.be.eq(ValrOrderStatusEnum.ACTIVE)
    expect(rawOrder.orderSide).to.be.eq(ValrSideEnum.BUY)

  })

  it('should get a parsed Valr order just fine', async () => {

    const rawOrderMock = ImportMock.mockFunction(
      valrOrderReadModule,
      'getRaw',
      {
        rawOrder: 'rawOrder',
        apiRequestCount: 1,
      },
    )

    const parseMock = ImportMock.mockFunction(
      valrOrderReadModule,
      'parse',
      {
        order: VALR_PARSED_OPEN_ORDERS[0],
        apiRequestCount: 1,
      },
    )

    const params = {
      id: 'id',
      symbolPair: 'symbolPair',
    }

    const { order: parsedOrder } = await valrOrderReadModule.get(params)

    expect(rawOrderMock.callCount).to.be.eq(1)
    expect(rawOrderMock.calledWith(params)).to.be.ok

    expect(parseMock.callCount).to.be.eq(1)
    expect(parseMock.calledWith({ rawOrder: 'rawOrder' })).to.be.ok

    expect(parsedOrder.status).to.be.eq(AlunaOrderStatusEnum.OPEN)
    expect(parsedOrder.type).to.be.eq(AlunaOrderTypesEnum.TAKE_PROFIT_LIMIT)
    expect(parsedOrder.side).to.be.eq(AlunaOrderSideEnum.BUY)

  })

  it('should parse a Valr raw order just fine', async () => {

    const rawOrder1: IValrOrderGetSchema = VALR_RAW_GET_ORDERS[0]
    const rawOrder2: IValrOrderListSchema = VALR_RAW_LIST_OPEN_ORDERS[1]

    const fetchCurrencyPairsMock = ImportMock.mockFunction(
      ValrMarketModule,
      'fetchCurrencyPairs',
      Promise.resolve({
        currencyPairs: VALR_RAW_CURRENCY_PAIRS,
        apiRequestCount: 1,
      }),
    )

    const parseMock = ImportMock.mockFunction(
      ValrOrderParser,
      'parse',
    )

    parseMock
      .onFirstCall()
      .returns(VALR_PARSED_OPEN_ORDERS[0])
      .onSecondCall()
      .returns(VALR_PARSED_OPEN_ORDERS[1])

    const { order: parsedOrder1 } = await valrOrderReadModule.parse({
      rawOrder: rawOrder1,
      currencyPair: VALR_RAW_CURRENCY_PAIRS[1],
    })

    expect(parseMock.callCount).to.be.eq(1)
    expect(parseMock.calledWithExactly({
      rawOrder: rawOrder1,
      currencyPair: VALR_RAW_CURRENCY_PAIRS[1],
    })).to.be.ok

    expect(fetchCurrencyPairsMock.callCount).to.be.eq(0)

    expect(parsedOrder1.symbolPair).to.be.ok
    expect(parsedOrder1.total).to.be.ok
    expect(parsedOrder1.amount).to.be.ok
    expect(parsedOrder1.rate).to.be.ok
    expect(parsedOrder1.placedAt).to.be.ok

    expect(parsedOrder1.status).to.be.eq(AlunaOrderStatusEnum.OPEN)
    expect(parsedOrder1.account).to.be.eq(AlunaAccountEnum.EXCHANGE)
    expect(parsedOrder1.type).to.be.eq(AlunaOrderTypesEnum.TAKE_PROFIT_LIMIT)
    expect(parsedOrder1.side).to.be.eq(AlunaOrderSideEnum.BUY)

    const { order: parsedOrder2 } = await valrOrderReadModule.parse({
      rawOrder: rawOrder2,
    })

    expect(parseMock.callCount).to.be.eq(2)

    expect(fetchCurrencyPairsMock.callCount).to.be.eq(1)

    expect(parsedOrder2.symbolPair).to.be.ok
    expect(parsedOrder2.total).to.be.ok
    expect(parsedOrder2.amount).to.be.ok
    expect(parsedOrder2.rate).to.be.ok
    expect(parsedOrder2.placedAt).to.be.ok

    expect(parsedOrder2.status).to.be.eq(AlunaOrderStatusEnum.OPEN)
    expect(parsedOrder2.account).to.be.eq(AlunaAccountEnum.EXCHANGE)
    expect(parsedOrder2.type).to.be.eq(AlunaOrderTypesEnum.LIMIT)
    expect(parsedOrder2.side).to.be.eq(AlunaOrderSideEnum.BUY)

  })

  it('should parse many Valr orders just fine', async () => {

    const rawOrders = VALR_RAW_LIST_OPEN_ORDERS
    const parsedOrders = VALR_PARSED_OPEN_ORDERS

    const parseMock = ImportMock.mockFunction(
      ValrOrderParser,
      'parse',
    )

    const fetchCurrencyPairsMock = ImportMock.mockFunction(
      ValrMarketModule,
      'fetchCurrencyPairs',
      Promise.resolve({
        currencyPairs: VALR_RAW_CURRENCY_PAIRS,
        apiRequestCount: 1,
      }),
    )

    parsedOrders.forEach((parsed, index) => {

      parseMock.onCall(index).returns(Promise.resolve(parsed))

    })

    const {
      orders: parsedManyResp,
    } = await valrOrderReadModule.parseMany({ rawOrders })

    expect(parsedManyResp.length).to.be.eq(5)
    expect(parseMock.callCount).to.be.eq(5)

    parsedManyResp.forEach((parsed, index) => {

      expect(parsed).to.deep.eq(parsedOrders[index])
      expect(parseMock.calledWith({
        rawOrders: parsed,
      }))

    })

    expect(fetchCurrencyPairsMock.callCount).to.be.eq(1)

  })

  it('should throw error if pair symbol is not found', async () => {

    const fetchCurrencyPairsMock = ImportMock.mockFunction(
      ValrMarketModule,
      'fetchCurrencyPairs',
      Promise.resolve({
        currencyPairs: [],
        apiRequestCount: 1,
      }),
    )

    let result
    let error

    const rawOrder = VALR_RAW_GET_ORDERS[0]

    try {

      const { order } = await valrOrderReadModule.parse({
        rawOrder,
      })

      result = order

    } catch (err) {

      error = err as AlunaError

    }

    expect(result).not.to.be.ok

    const msg = `No symbol pair found for ${rawOrder.currencyPair}`

    expect(error).to.be.ok
    expect(error?.code).to.be.eq(AlunaGenericErrorCodes.PARSER_ERROR)
    expect(error?.message).to.be.eq(msg)

    expect(fetchCurrencyPairsMock.callCount).to.be.eq(1)

  })

})
