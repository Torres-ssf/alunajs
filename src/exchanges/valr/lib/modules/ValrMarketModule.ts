import { AAlunaModule } from '@lib/abstracts/AAlunaModule'
import { IAlunaMarketModule } from '@lib/modules/IAlunaMarketModule'
import { IAlunaMarketSchema } from '@lib/schemas/IAlunaMarketSchema'

import { ValrRequests } from '../requests/ValrRequests'
import { IValrCurrencyPairs } from '../schemas/IValrCurrencyPairs'
import { IValrMarketSchema } from '../schemas/IValrMarketSchema'
import { ValrCurrencyPairsParser } from './parsers/ValrCurrencyPairParser'
import { ValrMarketParser } from './parsers/ValrMarketParser'



export interface IMarketWithCurrency extends IValrMarketSchema {
  baseCurrency: string
  quoteCurrency: string
}



export class ValrMarketModule extends AAlunaModule implements IAlunaMarketModule {

  async list (): Promise<IAlunaMarketSchema[]> {

    const request = new ValrRequests()

    const rawMarkets = await request.get<IValrMarketSchema[]>({
      url: 'https://api.valr.com/v1/public/marketsummary',
    })

    const rawSymbolPairs = await request.get<IValrCurrencyPairs[]>({
      url: 'https://api.valr.com/v1/public/pairs',
    })



    const {
      rawMarketsWithCurrency,
      currencyVolumes,
    } = ValrCurrencyPairsParser.parse({
      rawMarkets,
      rawSymbolPairs,
    })

    return this.parseMany({
      rawMarkets: rawMarketsWithCurrency,
      currencyVolumes,
    })

  }

  parse (params: {
    rawMarket: IMarketWithCurrency
    currencyVolumes: Record<string, string>
  }): IAlunaMarketSchema {

    return ValrMarketParser.parse(params)

  }

  parseMany (params: {
    rawMarkets: IMarketWithCurrency[]
    currencyVolumes: Record<string, string>
  }): IAlunaMarketSchema[] {

    return params.rawMarkets.map((rawMarket) => this.parse({
      rawMarket,
      currencyVolumes: params.currencyVolumes,
    }))

  }

}
