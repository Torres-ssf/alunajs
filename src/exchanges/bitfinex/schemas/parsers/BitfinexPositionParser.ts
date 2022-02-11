import {
  AlunaAccountEnum,
  AlunaPositionStatusEnum,
  IAlunaPositionSchema,
} from '../../../..'
import { Bitfinex } from '../../Bitfinex'
import { BitfinexSideAdapter } from '../../enums/adapters/BitfinexSideAdapter'
import { BitfinexPositionStatusEnum } from '../../enums/BitfinexPositionStatusEnum'
import { IBitfinexPositionSchema } from '../IBitfinexPositionSchema'



export class BitfinexPositionParser {

  static parse (params: {
    rawPosition: IBitfinexPositionSchema,
  }) {

    const { rawPosition } = params

    const [
      symbol,
      status,
      amount,
      basePrice,
      _funding,
      _fundingType,
      pl,
      plPerc,
      priceLiq,
      leverage,
      _placeholder1,
      positionId,
      mtsCreate,
      mtsUpdate,
      _placeholder2,
      _type,
      _placeholder3,
      _collateral,
      _collateralMin,
      meta,
    ] = rawPosition


    let baseSymbolId: string
    let quoteSymbolId: string

    const spliter = symbol.indexOf(':')

    if (spliter >= 0) {

      baseSymbolId = symbol.slice(1, spliter)
      quoteSymbolId = symbol.slice(spliter + 1)

    } else {

      baseSymbolId = symbol.slice(1, 4)
      quoteSymbolId = symbol.slice(4)

    }

    const computedStatus = status === BitfinexPositionStatusEnum.ACTIVE
      ? AlunaPositionStatusEnum.OPEN
      : AlunaPositionStatusEnum.CLOSED

    const side = BitfinexSideAdapter.translateToAluna({
      value: amount,
    })

    const computedBasePrice = Number(basePrice)
    const computedAmount = Math.abs(Number(amount))
    const total = computedAmount * computedBasePrice

    const computedPl = pl !== null ? pl : 0
    const plPercentage = plPerc !== null ? plPerc : 0
    const liquidationPrice = priceLiq !== null ? priceLiq : 0
    const computedLeverage = leverage !== null ? leverage : 0

    const openedAt = mtsCreate
      ? new Date(mtsCreate)
      : new Date()

    let closedAt: Date | undefined
    let closePrice: number | undefined

    if (mtsUpdate && (computedStatus === AlunaPositionStatusEnum.CLOSED)) {

      closedAt = new Date(mtsUpdate)

      closePrice = Number(meta.trade_price)

    }

    const position: IAlunaPositionSchema = {
      id: positionId,
      symbolPair: symbol,
      exchangeId: Bitfinex.ID,
      baseSymbolId,
      quoteSymbolId,
      total,
      amount: computedAmount,
      account: AlunaAccountEnum.MARGIN,
      status: computedStatus,
      side,
      basePrice: Number(basePrice),
      openPrice: computedBasePrice,
      pl: computedPl,
      plPercentage,
      leverage: computedLeverage,
      liquidationPrice,
      openedAt,
      closedAt,
      closePrice,
      meta: rawPosition,
    }

    return position

  }

}
