
const restClient = require('../core/rest-client');

const EODHISTORICALDATA_API_KEY = process.env.EODHISTORICALDATA_API_KEY

const requestUrl = `https://eod1historicaldata.com/api/search/GAZPROM?api_token=${EODHISTORICALDATA_API_KEY}&fmt=json`

const start = async () => {
    try {
        const resp =  await restClient.get(requestUrl) 
        console.log(resp)
        }

    catch(e) {
        console.log(e)
    }
}

start()