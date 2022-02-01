import axios from 'axios'

import { AlunaHttpVerbEnum } from '..'

import { AlunaAccountEnum } from './enums/AlunaChainsEnum'


// QUESTION: where to save this const? it's supposed to be shared by
// multiple files i believe?

const API_URL = 'https://openapi.debank.com/'

export async function getTokenList (
  address: string,
  chain_id: AlunaAccountEnum,
) {

  let url = `${API_URL}v1/user/token_list?`
  url += `id=${address}`
  url += `&chain_id=${chain_id}`
  url += '&is_all=false'
  url += '&has_balance=true'

  const requestConfig = {
    url,
    method: AlunaHttpVerbEnum.GET,
  }

  try {

    const response = await axios.create().request(requestConfig)

    return response.data

  } catch (error) {

    console.log('error getting list of tokens for user')
    console.log(error)
    // throw handleRequestError(error);

  }

}
