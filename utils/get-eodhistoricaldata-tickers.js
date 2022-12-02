
const restClient = require('../core/rest-client')

const Ajv = require("ajv")
const ajv = new Ajv() 

const schema_eod_tickers_info = require("./schema_eod_tickers.json")
const { map } = require('lodash')
const _validateTickersInfoFromEOD  =  ajv.compile(schema_eod_tickers_info)

const validateTickersInfoFromEOD = (resp) => {
  if (!_validateTickersInfoFromEOD(resp)) {
    throw("Tickers data not corresponding with scheme")
  }
}  

const mapEODtoSecuritiesTable = (eodTickers) => {
  
  const EOD_SECURITIES_TYPES_MAPPING = {
    "Common Stock":"stock", 
    "ETF":"etf"
  }  
  
  return eodTickers.map((eodTicker) => {
      return {
        "type": EOD_SECURITIES_TYPES_MAPPING[eodTicker.Type],
        "ticker": eodTicker["Code"],
        "title": eodTicker["Name"],
        "currency": eodTicker["Currency"],
        "provider_info": eodTicker
        }
      }
   )
} 
const knex = require('knex')({
    client: 'pg',
    connection: {
      host : process.env.DB_HOST,
      port : process.env.DB_PORT,
      user : process.env.DB_USER,
      password : process.env.DB_PASSWORD,
      database : process.env.DB_DATABASE
    }
  });

const EODHISTORICALDATA_API_KEY = process.env.EODHISTORICALDATA_API_KEY

const requestUrl = `https://eodhistoricaldata.com/api/exchange-symbol-list/MCX?api_token=${EODHISTORICALDATA_API_KEY}&fmt=json`

const start = async () => {
    try {
        const resp =  await restClient.get(requestUrl)
        validateTickersInfoFromEOD(resp)

        try{
          const r = await knex('securities').insert(mapEODtoSecuritiesTable(resp))
          console.log(r)
        }
        catch(e) {
          console.log("Error with DB", e)
        }
      }

    catch(e) {
        console.log("Runtime Error: ",e)
    }
    process.exit()
}

start()