
const restClient = require('../core/rest-client')

const Ajv = require("ajv")
const ajv = new Ajv() 

const schema_eod_tickers_info = require("./schema_eod_tickers.json")
const validate_eod_tickers_info = ajv.compile(schema_eod_tickers_info)

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
        console.log("Validation: ", validate_eod_tickers_info(resp))

        }

    catch(e) {
        console.log("Runtime Error +",e)
    }
}

start()