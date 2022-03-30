import { IAlunaSymbolSchema } from '../../../../lib/schemas/IAlunaSymbolSchema'
import {
  IPoloniexSymbolSchema,
  IPoloniexSymbolWithCurrency,
} from '../../schemas/IPoloniexSymbolSchema'



export const POLONIEX_RAW_SYMBOL: IPoloniexSymbolSchema = {
  LTC: {
    id: 125,
    name: 'Litecoin',
    humanType: 'BTC Clone',
    currencyType: 'address',
    txFee: '0.00100000',
    minConf: 4,
    depositAddress: '',
    disabled: 0,
    frozen: 0,
    depositDisabled: 0,
    hexColor: '509BCA',
    blockchain: 'LTC',
    delisted: 0,
    isGeofenced: 0,
  },
  BTC: {
    id: 28,
    name: 'Bitcoin',
    humanType: 'BTC Clone',
    currencyType: 'address',
    txFee: '0.00050000',
    minConf: 2,
    depositAddress: '',
    disabled: 0,
    frozen: 0,
    depositDisabled: 0,
    hexColor: 'F59C3D',
    blockchain: 'BTC',
    delisted: 0,
    isGeofenced: 0,
  },
  ETH: {
    id: 267,
    name: 'Ethereum',
    humanType: 'Sweep to Main Account',
    currencyType: 'address',
    txFee: '0.01387773',
    minConf: 12,
    depositAddress: '',
    disabled: 0,
    frozen: 0,
    depositDisabled: 0,
    hexColor: '1C1CE1',
    blockchain: 'ETH',
    delisted: 0,
    isGeofenced: 0,
  },
}

export const POLONIEX_RAW_SYMBOLS_WITH_CURRENCY
: IPoloniexSymbolWithCurrency[] = [
  {
    currency: 'LTC',
    id: 125,
    name: 'Litecoin',
    humanType: 'BTC Clone',
    currencyType: 'address',
    txFee: '0.00100000',
    minConf: 4,
    depositAddress: '',
    disabled: 0,
    frozen: 0,
    depositDisabled: 0,
    hexColor: '509BCA',
    blockchain: 'LTC',
    delisted: 0,
    isGeofenced: 0,
  },
  {
    currency: 'BTC',
    id: 28,
    name: 'Bitcoin',
    humanType: 'BTC Clone',
    currencyType: 'address',
    txFee: '0.00050000',
    minConf: 2,
    depositAddress: '',
    disabled: 0,
    frozen: 0,
    depositDisabled: 0,
    hexColor: 'F59C3D',
    blockchain: 'BTC',
    delisted: 0,
    isGeofenced: 0,
  },
  {
    currency: 'ETH',
    id: 267,
    name: 'Ethereum',
    humanType: 'Sweep to Main Account',
    currencyType: 'address',
    txFee: '0.01387773',
    minConf: 12,
    depositAddress: '',
    disabled: 0,
    frozen: 0,
    depositDisabled: 0,
    hexColor: '1C1CE1',
    blockchain: 'ETH',
    delisted: 0,
    isGeofenced: 0,
  },
]

export const POLONIEX_PARSED_SYMBOLS: IAlunaSymbolSchema[] = [
  {
    id: 'LTC',
    name: 'Litecoin',
    exchangeId: 'poloniex',
    meta: {},
  },
  {
    id: 'BTC',
    name: 'Bitcoin',
    exchangeId: 'poloniex',
    meta: {},
  },
  {
    id: 'ETH',
    name: 'Ethereum',
    exchangeId: 'poloniex',
    meta: {},
  },
]
