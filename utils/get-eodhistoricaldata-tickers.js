
const axios = require('axios');

// bootstrapping 

const EODHISTORICALDATA_API_KEY = process.env.EODHISTORICALDATA_API_KEY

axios.get(`https://eodhistoricaldata.com/api/exchange-symbol-list/MCX?api_token=${EODHISTORICALDATA_API_KEY}&fmt=json`)
.then(function (response) {
    // handle success
    console.log(response.data);
})
.catch(function (error) {
    // handle error
    console.log(error);
})
.finally(function () {
    // always executed
});


