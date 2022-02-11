import {
  AlunaAccountEnum,
  AlunaPositionStatusEnum,
  AlunaSideEnum,
  IAlunaPositionSchema,
} from '../../../..'
import { BitfinexPositionStatusEnum } from '../../enums/BitfinexPositionStatusEnum'
import { IBitfinexPositionSchema } from '../../schemas/IBitfinexPositionSchema'



export const BITFINEX_RAW_POSITIONS: IBitfinexPositionSchema[] = [
  [
    'tADAUSD',
    'ACTIVE' as BitfinexPositionStatusEnum,
    2,
    1.1643,
    0,
    0,
    null,
    null,
    null,
    null,
    null,
    151970561,
    1644589292,
    1644589292,
    null,
    0,
    null,
    0,
    0,
    {
      reason: 'TRADE',
      order_id: 86603979103,
      order_id_oppo: 86604123998,
      liq_stage: null,
      trade_price: '1.1643',
      trade_amount: '2.0',
      order_cid: 1644587967037,
      order_gid: null,
    },
  ],
  [
    'tETHBTC',
    'CLOSED' as BitfinexPositionStatusEnum,
    3,
    1.1643,
    0,
    0,
    -0.006852799999999758,
    -0.09447736837583776,
    0,
    0.07746639479288778,
    null,
    151970562,
    1644589292,
    1574002216000,
    null,
    0,
    null,
    0,
    0,
    {
      reason: 'TRADE',
      order_id: 86603979103,
      order_id_oppo: 86604123998,
      liq_stage: null,
      trade_price: '1.1643',
      trade_amount: '2.0',
      order_cid: 1644587967037,
      order_gid: null,
    },
  ],
  [
    'tATOMBTC',
    'CLOSED' as BitfinexPositionStatusEnum,
    4,
    3.1643,
    0,
    0,
    -0.006852799999999758,
    -0.09447736837583776,
    0,
    0.07746639479288778,
    null,
    151970563,
    1644589292,
    null,
    null,
    0,
    null,
    0,
    0,
    {
      reason: 'TRADE',
      order_id: 86603979103,
      order_id_oppo: 86604123998,
      liq_stage: null,
      trade_price: '1.1643',
      trade_amount: '2.0',
      order_cid: 1644587967037,
      order_gid: null,
    },
  ],
  [
    'tBTCUSD',
    'ACTIVE' as BitfinexPositionStatusEnum,
    4,
    3.1643,
    0,
    0,
    -0.006852799999999758,
    -0.09447736837583776,
    0,
    0.07746639479288778,
    null,
    151970564,
    1644589292,
    1644589292,
    null,
    0,
    null,
    0,
    0,
    {
      reason: 'TRADE',
      order_id: 86603979103,
      order_id_oppo: 86604123998,
      liq_stage: null,
      trade_price: '1.1643',
      trade_amount: '2.0',
      order_cid: 1644587967037,
      order_gid: null,
    },
  ],
  [
    'tDUSK:USD',
    'ACTIVE' as BitfinexPositionStatusEnum,
    4,
    3.1643,
    0,
    0,
    -0.006852799999999758,
    -0.09447736837583776,
    0,
    0.07746639479288778,
    null,
    151970565,
    null,
    null,
    null,
    0,
    null,
    0,
    0,
    {
      reason: 'TRADE',
      order_id: 86603979103,
      order_id_oppo: 86604123998,
      liq_stage: null,
      trade_price: '1.1643',
      trade_amount: '2.0',
      order_cid: 1644587967037,
      order_gid: null,
    },
  ],
  [
    'fEOS',
    'ACTIVE' as BitfinexPositionStatusEnum,
    4,
    3.1643,
    0,
    0,
    -0.006852799999999758,
    -0.09447736837583776,
    0,
    0.07746639479288778,
    null,
    151970566,
    null,
    null,
    null,
    0,
    null,
    0,
    0,
    {
      reason: 'TRADE',
      order_id: 86603979103,
      order_id_oppo: 86604123998,
      liq_stage: null,
      trade_price: '1.1643',
      trade_amount: '2.0',
      order_cid: 1644587967037,
      order_gid: null,
    },
  ],
  [
    'tBTCF0:USTF0',
    'ACTIVE' as BitfinexPositionStatusEnum,
    4,
    3.1643,
    0,
    0,
    -0.006852799999999758,
    -0.09447736837583776,
    0,
    0.07746639479288778,
    null,
    151970567,
    null,
    null,
    null,
    0,
    null,
    0,
    0,
    {
      reason: 'TRADE',
      order_id: 86603979103,
      order_id_oppo: 86604123998,
      liq_stage: null,
      trade_price: '1.1643',
      trade_amount: '2.0',
      order_cid: 1644587967037,
      order_gid: null,
    },
  ],
]



export const BITFINEX_PARSED_POSITIONS: IAlunaPositionSchema[] = [
  {
    id: 151970561,
    symbolPair: 'tADAUSD',
    baseSymbolId: 'ADA',
    quoteSymbolId: 'USD',
    exchangeId: 'bitfinex',
    total: 2.3286,
    amount: 2,
    account: 'margin' as AlunaAccountEnum,
    status: 'open' as AlunaPositionStatusEnum,
    side: 'long' as AlunaSideEnum,
    basePrice: 1.1643,
    openPrice: 1.1643,
    pl: -0.006852799999999758,
    plPercentage: -0.09447736837583776,
    leverage: 0.07746639479288778,
    liquidationPrice: 0,
    openedAt: new Date('1970-01-20T00:49:49.292Z'),
    meta: [
      'tADAUSD', 'ACTIVE',
      2, 1.1643,
      0, 0,
      -0.006852799999999758, -0.09447736837583776,
      0, 0.07746639479288778,
      null, 151970561,
      1644589292, 1644589292,
      null, 0,
      null, 0,
      0, [Object],
    ],
  },
  {
    id: 151970562,
    symbolPair: 'tETHBTC',
    baseSymbolId: 'ETH',
    quoteSymbolId: 'BTC',
    exchangeId: 'bitfinex',
    total: 3.4928999999999997,
    amount: 3,
    account: 'margin'as AlunaAccountEnum,
    status: 'closed'as AlunaPositionStatusEnum,
    side: 'long'as AlunaSideEnum,
    basePrice: 1.1643,
    openPrice: 1.1643,
    pl: -0.006852799999999758,
    plPercentage: -0.09447736837583776,
    leverage: 0.07746639479288778,
    liquidationPrice: 0,
    openedAt: new Date('1970-01-20T00:49:49.292Z'),
    meta: [
      'tETHBTC', 'CLOSED',
      3, 1.1643,
      0, 0,
      -0.006852799999999758, -0.09447736837583776,
      0, 0.07746639479288778,
      null, 151970562,
      1644589292, null,
      null, 0,
      null, 0,
      0, [Object],
    ],
  },
  {
    id: 151970563,
    symbolPair: 'tATOMBTC',
    baseSymbolId: 'ATO',
    quoteSymbolId: 'MBTC',
    exchangeId: 'bitfinex',
    total: 12.6572,
    amount: 4,
    account: 'margin' as AlunaAccountEnum,
    status: 'open' as AlunaPositionStatusEnum,
    side: 'long' as AlunaSideEnum,
    basePrice: 3.1643,
    openPrice: 3.1643,
    pl: -0.006852799999999758,
    plPercentage: -0.09447736837583776,
    leverage: 0.07746639479288778,
    liquidationPrice: 0,
    openedAt: new Date('1970-01-20T00:49:49.292Z'),
    meta: [
      'tATOMBTC', 'ACTIVE',
      4, 3.1643,
      0, 0,
      -0.006852799999999758, -0.09447736837583776,
      0, 0.07746639479288778,
      null, 151970563,
      1644589292, null,
      null, 0,
      null, 0,
      0, [Object],
    ],
  },
  {
    id: 151970564,
    symbolPair: 'tBTCUSD',
    baseSymbolId: 'BTC',
    quoteSymbolId: 'USD',
    exchangeId: 'bitfinex',
    total: 12.6572,
    amount: 4,
    account: 'margin' as AlunaAccountEnum,
    status: 'open' as AlunaPositionStatusEnum,
    side: 'long' as AlunaSideEnum,
    basePrice: 3.1643,
    openPrice: 3.1643,
    pl: -0.006852799999999758,
    plPercentage: -0.09447736837583776,
    leverage: 0.07746639479288778,
    liquidationPrice: 0,
    openedAt: new Date('1970-01-20T00:49:49.292Z'),
    meta: [
      'tBTCUSD', 'ACTIVE',
      4, 3.1643,
      0, 0,
      -0.006852799999999758, -0.09447736837583776,
      0, 0.07746639479288778,
      null, 151970564,
      1644589292, 1644589292,
      null, 0,
      null, 0,
      0, [Object],
    ],
  },
  {
    id: 151970565,
    symbolPair: 'tDUSK:USD',
    baseSymbolId: 'DUSK',
    quoteSymbolId: 'USD',
    exchangeId: 'bitfinex',
    total: 12.6572,
    amount: 4,
    account: 'margin' as AlunaAccountEnum,
    status: 'open' as AlunaPositionStatusEnum,
    side: 'long' as AlunaSideEnum,
    basePrice: 3.1643,
    openPrice: 3.1643,
    pl: -0.006852799999999758,
    plPercentage: -0.09447736837583776,
    leverage: 0.07746639479288778,
    liquidationPrice: 0,
    openedAt: new Date('2022-02-11T15:33:02.846Z'),
    meta: [
      'tDUSK:USD', 'ACTIVE',
      4, 3.1643,
      0, 0,
      -0.006852799999999758, -0.09447736837583776,
      0, 0.07746639479288778,
      null, 151970565,
      null, null,
      null, 0,
      null, 0,
      0, [Object],
    ],
  },
]
