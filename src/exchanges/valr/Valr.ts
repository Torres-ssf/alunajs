import { IAlunaPrivateRequest } from '@lib/abstracts/IAlunaPrivateRequest'

import { IAlunaExchange } from ''
import { AAlunaExchange } from '../../lib/abstracts/AAlunaExchange'
import { IAlunaBalanceModule } from '../../lib/modules/IAlunaBalanceModule'
import { IAlunaKeyModule } from '../../lib/modules/IAlunaKeyModule'
import { IAlunaOrderModule } from '../../lib/modules/IAlunaOrderModule'
import { IAlunaKeySecretSchema } from '../../lib/schemas/IAlunaKeySecretSchema'
import { IAlunaSettingsSchema } from '../../lib/schemas/IAlunaSettingsSchema'
import { ValrMarket } from './lib/modules/market/ValrMarket'
import { ValrSymbol } from './lib/modules/symbol/ValrSymbol'
import { ValrBalance } from './lib/modules/ValrBalance'
import { ValrPublicRequest } from './lib/requests/ValrPublicRequest'



export class Valr extends AAlunaExchange implements IAlunaExchange {

  static readonly ID = 'valr'

  static readonly publicRequest = new ValrPublicRequest()

  static readonly Symbol = new ValrSymbol(Valr.publicRequest)

  static readonly Market = new ValrMarket(Valr.publicRequest)



  Key: IAlunaKeyModule

  Order: IAlunaOrderModule

  Balance: IAlunaBalanceModule

  privateRequest: IAlunaPrivateRequest



  constructor (
    params: {
      keySecret: IAlunaKeySecretSchema
      settings?: IAlunaSettingsSchema
    },
  ) {

    super(params)

    this.Balance = new ValrBalance(this)
    // this.Order = new ValrOrder(this)
    // this.Key = new ValrKey(this)
    // this.Balance = new ValrOrder2(this.privateRequest)

  }

}
