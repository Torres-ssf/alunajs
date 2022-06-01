import { cloneDeep } from 'lodash'

import { AlunaError } from '../../lib/core/AlunaError'
import { AlunaAccountEnum } from '../../lib/enums/AlunaAccountEnum'
import { AlunaFeaturesModeEnum } from '../../lib/enums/AlunaFeaturesModeEnum'
import { AlunaOrderTypesEnum } from '../../lib/enums/AlunaOrderTypesEnum'
import { AlunaWalletEnum } from '../../lib/enums/AlunaWalletEnum'
import { AlunaExchangeErrorCodes } from '../../lib/errors/AlunaExchangeErrorCodes'
import {
  IAlunaExchangeOrderSpecsSchema,
  IAlunaExchangeSchema,
} from '../../lib/schemas/IAlunaExchangeSchema'
import { IAlunaSettingsSchema } from '../../lib/schemas/IAlunaSettingsSchema'



export const VALR_PRODUCTION_URL = 'https://api.valr.com/v1'



export const valrExchangeOrderTypes: IAlunaExchangeOrderSpecsSchema[] = [
  {
    type: AlunaOrderTypesEnum.LIMIT,
    supported: true,
    implemented: true,
    mode: AlunaFeaturesModeEnum.WRITE,
    options: {
      rate: 1,
      amount: 1,
    },
  },
  {
    type: AlunaOrderTypesEnum.MARKET,
    supported: true,
    implemented: true,
    mode: AlunaFeaturesModeEnum.WRITE,
    options: {
      rate: 1,
      amount: 1,
    },
  },
  {
    type: AlunaOrderTypesEnum.STOP_LIMIT,
    supported: true,
    implemented: true,
    mode: AlunaFeaturesModeEnum.READ,
    options: {
      rate: 1,
      amount: 1,
      limitRate: 1,
    },
  },
  {
    type: AlunaOrderTypesEnum.TRAILING_STOP,
    supported: true,
    implemented: true,
    mode: AlunaFeaturesModeEnum.READ,
    options: {
      rate: 1,
      amount: 1,
      limitRate: 1,
    },
  },
]



export const valrBaseSpecs: IAlunaExchangeSchema = {
  id: 'valr',
  name: 'Valr',
  signupUrl: 'https://www.valr.com/signup',
  connectApiUrl: 'https://www.valr.com/api-keys/create',
  rateLimitingPerMinute: {
    perApiKey: 180,
    perIp: 360,
  },
  features: {
    offersOrderEditing: false,
    offersPositionId: false,
  },
  accounts: [
    {
      type: AlunaAccountEnum.SPOT,
      supported: true,
      implemented: true,
      orderTypes: valrExchangeOrderTypes,
      wallet: AlunaWalletEnum.SPOT,
    },
    {
      type: AlunaAccountEnum.MARGIN,
      supported: false,
      implemented: false,
      orderTypes: [],
      wallet: AlunaWalletEnum.MARGIN,
    },
    {
      type: AlunaAccountEnum.DERIVATIVES,
      supported: false,
      implemented: false,
      orderTypes: [],
      wallet: AlunaWalletEnum.DERIVATIVES,
    },
    {
      type: AlunaAccountEnum.LENDING,
      supported: false,
      implemented: false,
      orderTypes: [],
      wallet: AlunaWalletEnum.FUNDING,
    },
  ],
  settings: {},
}



export const buildValrSpecs = (params: {
  settings: IAlunaSettingsSchema
}) => {

  const { settings } = params
  const { referralCode } = settings

  const specs = cloneDeep(valrBaseSpecs)

  if (referralCode) {

    specs.signupUrl = `${specs.signupUrl}?referralCode=${referralCode}`

  }

  specs.settings = settings

  return specs

}



export const getValrEndpoints = (settings: IAlunaSettingsSchema) => {

  const baseUrl = VALR_PRODUCTION_URL

  if (settings.useTestNet) {
    throw new AlunaError({
      code: AlunaExchangeErrorCodes.EXCHANGE_DONT_HAVE_TESTNET,
      message: 'Valr don\'t have a testnet.',
    })
  }

  return {
    symbol: {
      list: `${baseUrl}/public/currencies`,
    },
    market: {
      summaries: `${baseUrl}/public/marketsummary`,
      pairs: `${baseUrl}/public/pairs`,
    },
    key: {
      fetchDetails: `${baseUrl}/account/api-keys/current`,
    },
    balance: {
      list: `${baseUrl}/account/balances`,
    },
    order: {
      get: (id: string, symbolPair: string) => `${baseUrl}/orders/${symbolPair}/orderid/${id}`,
      list: `${baseUrl}/orders/open`,
      place: (orderType: string) => `${baseUrl}/orders/${orderType}`,
      cancel: `${baseUrl}/orders/order`,
    },
  }

}
