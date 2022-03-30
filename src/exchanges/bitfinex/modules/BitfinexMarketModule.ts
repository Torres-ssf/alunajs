import {
  IAlunaMarketListRawReturns,
  IAlunaMarketListReturns,
  IAlunaMarketModule,
  IAlunaMarketParseManyReturns,
  IAlunaMarketParseReturns,
} from '../../../lib/modules/IAlunaMarketModule'
import { IAlunaMarketSchema } from '../../../lib/schemas/IAlunaMarketSchema'
import { BitfinexHttp } from '../BitfinexHttp'
import { BitfinexLog } from '../BitfinexLog'
import {
  IBitfinexMarketSchema,
  IBitfinexTicker,
} from '../schemas/IBitfinexMarketSchema'
import {
  BitfinexMarketParser,
  IBitfinexMarketParseParams,
} from '../schemas/parsers/BitfinexMarketParser'



export const BitfinexMarketModule: IAlunaMarketModule = class {

  static enabledMarginMarketsPath = 'pub:list:pair:margin'

  public static async listRaw (): Promise<IAlunaMarketListRawReturns<any>> {

    BitfinexLog.info('fetching Bitfinex markets')

    const { publicRequest } = BitfinexHttp

    const apiRequestCount = 0

    const {
      data: rawMarkets,
      apiRequestCount: marketsRequestCount,
    } = await publicRequest<IBitfinexTicker[]>({
      url: 'https://api-pub.bitfinex.com/v2/tickers?symbols=ALL',
    })

    const baseUrl = 'https://api-pub.bitfinex.com/v2/conf/'

    const url = `${baseUrl}${this.enabledMarginMarketsPath}`

    const {
      data,
      apiRequestCount: enabledMarginMarketsRequestCount,
    } = await publicRequest<[string[]]>({
      url,
    })

    const totalApiRequestCount = apiRequestCount
      + marketsRequestCount
      + enabledMarginMarketsRequestCount

    const [enabledMarginMarkets] = data

    const output: IBitfinexMarketSchema = [
      rawMarkets,
      enabledMarginMarkets,
    ]

    return {
      rawMarkets: output,
      apiRequestCount: totalApiRequestCount,
    }

  }

  public static async list (): Promise<IAlunaMarketListReturns> {

    let apiRequestCount = 0

    const {
      rawMarkets,
      apiRequestCount: listRawCount,
    } = await BitfinexMarketModule.listRaw()

    apiRequestCount += 1

    const {
      markets: parsedMarkets,
      apiRequestCount: parseManyCount,
    } = BitfinexMarketModule.parseMany({ rawMarkets })

    apiRequestCount += 1

    const totalApiRequestCount = apiRequestCount
      + listRawCount
      + parseManyCount

    return {
      markets: parsedMarkets,
      apiRequestCount: totalApiRequestCount,
    }

  }

  public static parse (params: {
    rawMarket: IBitfinexMarketParseParams,
  }): IAlunaMarketParseReturns {

    const { rawMarket } = params

    const parsedMarket = BitfinexMarketParser.parse(rawMarket)

    return {
      market: parsedMarket,
      apiRequestCount: 1,
    }

  }

  public static parseMany (params: {
    rawMarkets: IBitfinexMarketSchema,
  }): IAlunaMarketParseManyReturns {

    const { rawMarkets } = params

    const [
      rawBitfinexTickers,
      enabledMarginMarkets,
    ] = rawMarkets

    const enabledMarginMarketsDict: Record<string, string> = {}

    enabledMarginMarkets.forEach((market) => {

      enabledMarginMarketsDict[market] = market

    })

    let apiRequestCount = 0

    const parsedMarkets = rawBitfinexTickers.reduce((acc, ticker) => {

      const [symbol] = ticker

      // skipping 'funding' and 'derivative' markets for now
      if (/f|F0/.test(symbol)) {

        return acc

      }

      const rawMarket: IBitfinexMarketParseParams = {
        rawTicker: ticker,
        enabledMarginMarketsDict,
      }

      const {
        market: parsedMarket,
        apiRequestCount: parseCount,
      } = this.parse({
        rawMarket,
      })

      apiRequestCount += parseCount + 1

      acc.push(parsedMarket)

      return acc

    }, [] as IAlunaMarketSchema[])

    BitfinexLog.info(`parsed ${parsedMarkets.length} markets for Bitfinex`)

    return {
      markets: parsedMarkets,
      apiRequestCount,
    }

  }

}
