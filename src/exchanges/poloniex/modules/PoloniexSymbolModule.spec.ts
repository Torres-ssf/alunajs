import { expect } from 'chai'
import { each } from 'lodash'
import { ImportMock } from 'ts-mock-imports'

import { mockAlunaSymbolMapping } from '../../../utils/mappings/AlunaSymbolMapping.mock'
import { Poloniex } from '../Poloniex'
import { PoloniexHttp } from '../PoloniexHttp'
import {
  POLONIEX_PARSED_SYMBOLS,
  POLONIEX_RAW_SYMBOL,
  POLONIEX_RAW_SYMBOLS_WITH_CURRENCY,
} from '../test/fixtures/poloniexSymbol'
import { PoloniexSymbolModule } from './PoloniexSymbolModule'



describe('PoloniexSymbolModule', () => {


  it('should list Poloniex raw symbols just fine', async () => {

    const requestMock = ImportMock.mockFunction(
      PoloniexHttp,
      'publicRequest',
      Promise.resolve(POLONIEX_RAW_SYMBOL),
    )

    const rawSymbols = await PoloniexSymbolModule.listRaw()

    expect(rawSymbols).to.deep.eq(POLONIEX_RAW_SYMBOL)

    expect(requestMock.callCount).to.be.eq(1)

  })

  it('should list Poloniex parsed symbols just fine', async () => {

    const listRawMock = ImportMock.mockFunction(
      PoloniexSymbolModule,
      'listRaw',
      Promise.resolve(POLONIEX_RAW_SYMBOL),
    )

    const parseManyMock = ImportMock.mockFunction(
      PoloniexSymbolModule,
      'parseMany',
      POLONIEX_PARSED_SYMBOLS,
    )

    const parsedSymbols = await PoloniexSymbolModule.list()

    expect(parsedSymbols).to.deep.eq(POLONIEX_PARSED_SYMBOLS)

    expect(listRawMock.callCount).to.eq(1)

    expect(parseManyMock.callCount).to.eq(1)
    expect(parseManyMock.args[0][0]).to.deep.eq({
      rawSymbols: POLONIEX_RAW_SYMBOL,
    })

  })

  it('should parse a Poloniex symbol just fine', async () => {

    const translateSymbolId = 'ETH'

    const { alunaSymbolMappingMock } = mockAlunaSymbolMapping({
      returnSymbol: translateSymbolId,
    })

    const rawSymbol1 = POLONIEX_RAW_SYMBOLS_WITH_CURRENCY[1]
    const rawSymbol2 = POLONIEX_RAW_SYMBOLS_WITH_CURRENCY[2]

    const parsedSymbol1 = PoloniexSymbolModule.parse({
      rawSymbol: rawSymbol1,
    })

    expect(parsedSymbol1.exchangeId).to.be.eq(Poloniex.ID)
    expect(parsedSymbol1.id).to.be.eq(translateSymbolId)
    expect(parsedSymbol1.name).to.be.eq(rawSymbol1.name)
    expect(parsedSymbol1.alias).to.be.eq(rawSymbol1.currency)

    expect(alunaSymbolMappingMock.callCount).to.be.eq(1)
    expect(alunaSymbolMappingMock.args[0][0]).to.deep.eq({
      exchangeSymbolId: rawSymbol1.currency,
      symbolMappings: Poloniex.settings.mappings,
    })

    alunaSymbolMappingMock.returns(rawSymbol2.currency)

    const parsedSymbol2 = PoloniexSymbolModule.parse({
      rawSymbol: rawSymbol2,
    })

    expect(parsedSymbol2.exchangeId).to.be.eq(Poloniex.ID)
    expect(parsedSymbol2.id).to.be.eq(rawSymbol2.currency)
    expect(parsedSymbol2.name).to.be.eq(rawSymbol2.name)
    expect(parsedSymbol2.alias).not.to.be.ok

    expect(alunaSymbolMappingMock.callCount).to.be.eq(2)
    expect(alunaSymbolMappingMock.args[1][0]).to.deep.eq({
      exchangeSymbolId: rawSymbol2.currency,
      symbolMappings: Poloniex.settings.mappings,
    })

  })

  it('should parse many Poloniex symbols just fine', async () => {

    const parseMock = ImportMock.mockFunction(
      PoloniexSymbolModule,
      'parse',
      POLONIEX_PARSED_SYMBOLS,
    )

    parseMock
      .onFirstCall()
      .returns(POLONIEX_PARSED_SYMBOLS[0])
      .onSecondCall()
      .returns(POLONIEX_PARSED_SYMBOLS[1])
      .onThirdCall()
      .returns(POLONIEX_PARSED_SYMBOLS[2])

    const parsedSymbols = PoloniexSymbolModule.parseMany({
      rawSymbols: POLONIEX_RAW_SYMBOL,
    })

    expect(parsedSymbols).to.deep.eq(POLONIEX_PARSED_SYMBOLS)

    each(parsedSymbols, (symbol, index) => {

      const rawSymbol = POLONIEX_RAW_SYMBOL[symbol.id]

      expect(parseMock.args[index][0]).to.deep.eq({
        rawSymbol: {
          currency: symbol.id,
          ...rawSymbol,
        },
      })

    })

    expect(parseMock.callCount).to.be.eq(3)

  })

})
