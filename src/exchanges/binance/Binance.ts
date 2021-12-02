import {
  IAlunaBalanceModule,
  IAlunaExchange,
  IAlunaExchangeStatic,
  IAlunaKeyModule,
  IAlunaKeySecretSchema,
  IAlunaOrderWriteModule,
  IAlunaSettingsSchema,
} from '../../index'
import { AAlunaExchange } from '../../lib/core/abstracts/AAlunaExchange'
import { BinanceSpecs } from './BinanceSpecs'
import { BinanceBalanceModule } from './modules/BinanceBalanceModule'
import { BinanceKeyModule } from './modules/BinanceKeyModule'
import { BinanceMarketModule } from './modules/BinanceMarketModule'
import { BinanceOrderWriteModule } from './modules/BinanceOrderWriteModule'
import { BinanceSymbolModule } from './modules/BinanceSymbolModule'



// TODO: Move URLs to exchange specs
export const PROD_BINANCE_URL = 'https://api.binance.com'
export const DEV_BINANCE_URL = 'https://testnet.binance.vision'



export const Binance: IAlunaExchangeStatic = class extends AAlunaExchange implements IAlunaExchange {

    // static definitions
    static readonly ID = BinanceSpecs.id
    static readonly SPECS = BinanceSpecs

    static Symbol = BinanceSymbolModule
    static Market = BinanceMarketModule

    // local definitions
    key: IAlunaKeyModule
    order: IAlunaOrderWriteModule
    balance: IAlunaBalanceModule

    constructor (params: {
      keySecret: IAlunaKeySecretSchema,
      settings?: IAlunaSettingsSchema,
    }) {

      super(params)

      this.key = new BinanceKeyModule({ exchange: this })
      this.balance = new BinanceBalanceModule({ exchange: this })
      this.order = new BinanceOrderWriteModule({ exchange: this })

    }

}
