import { expect } from 'chai'
import { each } from 'lodash'

import { PARSED_ORDERS } from '../../../../../../test/fixtures/parsedOrders'
import { mockParse } from '../../../../../../test/mocks/exchange/modules/mockParse'
import { IAlunaCredentialsSchema } from '../../../../../lib/schemas/IAlunaCredentialsSchema'
import { PoloniexAuthed } from '../../../PoloniexAuthed'
import { POLONIEX_RAW_ORDERS } from '../../../test/fixtures/poloniexOrders'
import * as parseMod from './parse'



describe(__filename, () => {

  const credentials: IAlunaCredentialsSchema = {
    key: 'key',
    secret: 'secret',
  }

  it('should parse many Poloniex raw orders just fine', async () => {

    // preparing data
    const parsedOrders = PARSED_ORDERS
    const rawOrders = POLONIEX_RAW_ORDERS


    // mocking
    const { parse } = mockParse({ module: parseMod })

    each(parsedOrders, (order, index) => {
      parse.onCall(index).returns({ order })
    })


    // executing
    const exchange = new PoloniexAuthed({ credentials })

    const { orders } = exchange.order.parseMany({ rawOrders })


    // validating
    expect(orders).to.deep.eq(parsedOrders)

    expect(parse.callCount).to.be.eq(rawOrders.length)

  })

})
