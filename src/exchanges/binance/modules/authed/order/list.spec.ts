import { PARSED_ORDERS } from '../../../../../../test/fixtures/parsedOrders'
import { testList } from '../../../../../../test/macros/testList'
import { binanceAuthed } from '../../../binanceAuthed'
import { BINANCE_RAW_ORDERS } from '../../../test/fixtures/binanceOrders'
import * as listRawMod from './listRaw'
import * as parseManyMod from './parseMany'



describe(__filename, () => {

  testList({
    AuthedClass: binanceAuthed,
    exchangeId: 'binance',
    methodModuleName: 'order',
    listModule: listRawMod,
    parseManyModule: parseManyMod,
    rawList: { rawOrders: BINANCE_RAW_ORDERS },
    parsedList: { orders: PARSED_ORDERS },
  })

})
