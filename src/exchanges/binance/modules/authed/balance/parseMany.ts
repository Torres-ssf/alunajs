import { debug } from 'debug'
import { map } from 'lodash'

import { IAlunaExchangeAuthed } from '../../../../../lib/core/IAlunaExchange'
import {
  IAlunaBalanceParseManyParams,
  IAlunaBalanceParseManyReturns,
} from '../../../../../lib/modules/authed/IAlunaBalanceModule'
import { IbinanceBalanceSchema } from '../../../schemas/IbinanceBalanceSchema'



const log = debug('@alunajs:binance/balance/parseMany')



export const parseMany = (exchange: IAlunaExchangeAuthed) => (
  params: IAlunaBalanceParseManyParams<IbinanceBalanceSchema>,
): IAlunaBalanceParseManyReturns => {

  const { rawBalances } = params

  // TODO: Review map implementation
  const parsedBalances = map(rawBalances, (rawBalance) => {

    const { balance } = exchange.balance.parse({ rawBalance })

    return balance

  })

  log(`parsed ${parsedBalances.length} balances`)

  return { balances: parsedBalances }

}
