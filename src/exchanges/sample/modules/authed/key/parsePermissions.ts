import { debug } from 'debug'

import { IAlunaExchangeAuthed } from '../../../../../lib/core/IAlunaExchange'
import {
  IAlunaKeyParsePermissionsParams,
  IAlunaKeyParsePermissionsReturns,
} from '../../../../../lib/modules/authed/IAlunaKeyModule'
import { IAlunaKeyPermissionSchema } from '../../../../../lib/schemas/IAlunaKeySchema'
import { SampleHttp } from '../../../SampleHttp'
import { ISampleKeySchema } from '../../../schemas/ISampleKeySchema'



const log = debug('@alunajs:sample/key/parsePermissions')



export const parsePermissions = (exchange: IAlunaExchangeAuthed) => (
  params: IAlunaKeyParsePermissionsParams<ISampleKeySchema>,
): IAlunaKeyParsePermissionsReturns => {

  log('parsing Sample key permissions', params)

  const {
    rawKey,
    http = new SampleHttp(),
  } = params

  const key: IAlunaKeyPermissionSchema = {
    read: rawKey.read,
    trade: rawKey.trade,
    withdraw: rawKey.withdraw,
  }

  const { requestCount } = http

  return {
    key,
    requestCount,
  }

}
