import { expect } from 'chai'
import { ImportMock } from 'ts-mock-imports'

import { IValrSymbolSchema } from '../schemas/IValrSymbolSchema'
import { VALR_SEEDS } from '../test/fixtures'
import { ValrHttp } from '../ValrHttp'
import { ValrSymbolModule } from './ValrSymbolModule'



describe('ValrSymbolModule', () => {

  const { symbolsSeeds } = VALR_SEEDS


  it('should list Valr raw symbols just fine', async () => {

    const requestMock = ImportMock.mockFunction(
      ValrHttp,
      'publicRequest',
      symbolsSeeds.rawSymbols,
    )

    const rawSymbols = await ValrSymbolModule.listRaw()

    expect(requestMock.calledOnce).to.be.ok

    expect(rawSymbols.length).to.eq(3)
    expect(rawSymbols).to.deep.eq(requestMock.returnValues[0])

    expect(rawSymbols[0].symbol).to.be.eq('R')
    expect(rawSymbols[0].shortName).to.be.eq('ZAR')
    expect(rawSymbols[0].longName).to.be.eq('Rand')

    expect(rawSymbols[1].symbol).to.be.eq('BTC')
    expect(rawSymbols[1].shortName).to.be.eq('BTC')
    expect(rawSymbols[1].longName).to.be.eq('Bitcoin')

    expect(rawSymbols[2].symbol).to.be.eq('ETH')
    expect(rawSymbols[2].shortName).to.be.eq('ETH')
    expect(rawSymbols[2].longName).to.be.eq('Ethereum')

  })



  it('should list Valr parsed symbols just fine', async () => {

    const listRawMock = ImportMock.mockFunction(
      ValrSymbolModule,
      'listRaw',
      'raw-symbols',
    )

    const parseManyMock = ImportMock.mockFunction(
      ValrSymbolModule,
      'parseMany',
      symbolsSeeds.parsedSymbols,
    )


    const rawSymbols = await ValrSymbolModule.list()

    expect(listRawMock.callCount).to.eq(1)

    expect(parseManyMock.callCount).to.eq(1)
    expect(parseManyMock.calledWith({
      rawSymbols: listRawMock.returnValues[0],
    })).to.be.true

    expect(rawSymbols.length).to.eq(3)
    expect(rawSymbols).to.deep.eq(parseManyMock.returnValues[0])

    expect(rawSymbols[0].id).to.be.eq('ZAR')
    expect(rawSymbols[0].name).to.be.eq('Rand')

    expect(rawSymbols[1].id).to.be.eq('BTC')
    expect(rawSymbols[1].name).to.be.eq('Bitcoin')

    expect(rawSymbols[2].id).to.be.eq('ETH')
    expect(rawSymbols[2].name).to.be.eq('Ethereum')

  })



  it('should parse a Valr symbol just fine', async () => {

    const parsedSymbol1 = ValrSymbolModule.parse({
      rawSymbol: symbolsSeeds.rawSymbols[1],
    })

    expect(parsedSymbol1).to.be.ok
    expect(parsedSymbol1.id).to.be.eq('BTC')
    expect(parsedSymbol1.name).to.be.eq('Bitcoin')

    const parsedSymbol2 = ValrSymbolModule.parse({
      rawSymbol: symbolsSeeds.rawSymbols[2],
    })

    expect(parsedSymbol2).to.be.ok
    expect(parsedSymbol2.id).to.be.eq('ETH')
    expect(parsedSymbol2.name).to.be.eq('Ethereum')

  })



  it('should parse many Valr symbols just fine', async () => {

    const parseMock = ImportMock.mockFunction(
      ValrSymbolModule,
      'parse',
    )

    parseMock
      .onFirstCall()
      .returns(symbolsSeeds.parsedSymbols[0])
      .onSecondCall()
      .returns(symbolsSeeds.parsedSymbols[1])
      .onThirdCall()
      .returns(symbolsSeeds.parsedSymbols[2])

    const parsedSymbols = ValrSymbolModule.parseMany({
      rawSymbols: new Array(3).fill(() => ({}) as IValrSymbolSchema),
    })

    expect(parsedSymbols[0].id).to.be.eq('ZAR')
    expect(parsedSymbols[0].name).to.be.eq('Rand')

    expect(parsedSymbols[1].id).to.be.eq('BTC')
    expect(parsedSymbols[1].name).to.be.eq('Bitcoin')

    expect(parsedSymbols[2].id).to.be.eq('ETH')
    expect(parsedSymbols[2].name).to.be.eq('Ethereum')

  })

})
