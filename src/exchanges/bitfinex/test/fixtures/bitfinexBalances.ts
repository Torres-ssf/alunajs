import {
  AlunaAccountEnum,
  IAlunaBalanceSchema,
} from '../../../..'
import { BitfinexAccountsEnum } from '../../enums/BitfinexAccountsEnum'
import { IBitfinexBalanceSchema } from '../../schemas/IBitfinexBalanceSchema'



export const BITFINEX_RAW_BALANCES: IBitfinexBalanceSchema[] = [
  [
    'exchange' as BitfinexAccountsEnum,
    'BTC',
    7.35296e-7,
    0,
    7.35296e-7,
    'Exchange 0.0008 ETH for BTC @ 0.065457',
    {
      reason: 'TRADE',
      order_id: 85415335168,
      order_id_oppo: 85414771121,
      trade_price: '0.065457',
      trade_amount: '0.0008',
      order_cid: 1643374392723,
      order_gid: null,
    },
  ],
  [
    'exchange' as BitfinexAccountsEnum,
    'ATO',
    0.1992,
    0,
    0.1992,
    'Exchange 0.2 ATO for USD @ 37.271',
    {
      reason: 'TRADE',
      order_id: 83954431710,
      order_id_oppo: 83976564149,
      trade_price: '37.271',
      trade_amount: '-0.2',
      order_cid: 1642169849457,
      order_gid: null,
    },
  ],
  [
    'exchange' as BitfinexAccountsEnum,
    'USD',
    13.89214731,
    0,
    13.89214731,
    'Exchange 0.002 ETH for USD @ 3296.6',
    {
      reason: 'TRADE',
      order_id: 83987077107,
      order_id_oppo: 83988987713,
      trade_price: '3296.6',
      trade_amount: '0.002',
      order_cid: 1642178828606,
      order_gid: null,
    },
  ],
  [
    'margin' as BitfinexAccountsEnum,
    'USD',
    1.13204658,
    0,
    1.13204658,
    'Trading fees for 0.0008 ETH (ETHBTC) @ 0.0657 on BFX (0.2%)',
    null,
  ],
  [
    'margin' as BitfinexAccountsEnum,
    'BTC',
    0.00000211,
    0,
    0.00000211,
    'Position closed @ 0.0657 (TRADE)',
    {
      reason: 'TRADE',
      order_id: 85420510379,
      order_id_oppo: 85420506392,
      liq_stage: null,
      trade_price: '0.065691',
      trade_amount: '0.0008',
      order_cid: null,
      order_gid: null,
    },
  ],
  [
    'margin' as BitfinexAccountsEnum,
    'ETH',
    0.0071264,
    0,
    0.0071264,
    null,
    null,
  ],
  [
    'funding' as BitfinexAccountsEnum,
    'ETH',
    0.0071264,
    0,
    0.0071264,
    null,
    null,
  ],
]



export const BITFINEX_PARSED_BALANCES: IAlunaBalanceSchema[] = [
  {
    account: AlunaAccountEnum.EXCHANGE,
    symbolId: 'BTC',
    available: 7.35296e-7,
    total: 7.35296e-7,
    meta: [
      'exchange',
      'BTC',
      7.35296e-7,
      0,
      7.35296e-7,
      'Exchange 0.0008 ETH for BTC @ 0.065457',
      [Object],
    ],
  },
  {
    account: AlunaAccountEnum.EXCHANGE,
    symbolId: 'ATO',
    available: 0.1992,
    total: 0.1992,
    meta: [
      'exchange',
      'ATO',
      0.1992,
      0,
      0.1992,
      'Exchange 0.2 ATO for USD @ 37.271',
      [Object],
    ],
  },
  {
    account: AlunaAccountEnum.EXCHANGE,
    symbolId: 'USD',
    available: 13.89214731,
    total: 13.89214731,
    meta: [
      'exchange',
      'USD',
      13.89214731,
      0,
      13.89214731,
      'Exchange 0.002 ETH for USD @ 3296.6',
      [Object],
    ],
  },
  {
    account: AlunaAccountEnum.MARGIN,
    symbolId: 'USD',
    available: 1.13204658,
    total: 1.13204658,
    meta: [
      'margin',
      'USD',
      1.13204658,
      0,
      1.13204658,
      'Trading fees for 0.0008 ETH (ETHBTC) @ 0.0657 on BFX (0.2%)',
      null,
    ],
  },
  {
    account: AlunaAccountEnum.MARGIN,
    symbolId: 'BTC',
    available: 0.00000211,
    total: 0.00000211,
    meta: [
      'margin',
      'BTC',
      0.00000211,
      0,
      0.00000211,
      'Position closed @ 0.0657 (TRADE)',
      [Object],
    ],
  },
  {
    account: AlunaAccountEnum.MARGIN,
    symbolId: 'ETH',
    available: 0.0071264,
    total: 0.0071264,
    meta: ['margin', 'ETH', 0.0071264, 0, 0.0071264, null, null],
  },
]
