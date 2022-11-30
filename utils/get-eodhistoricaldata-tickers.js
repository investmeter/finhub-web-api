
const https = require('node:https');

// bootstrapping 

const EODHISTORICALDATA_API_KEY = process.env.EODHISTORICALDATA_API_KEY

const request_url = `https://eodhistoricaldata.com/api/search/GAZPROM?api_token=${EODHISTORICALDATA_API_KEY}&fmt=json`

https.get(request_url, (res) => {
  
  if(res.statusCode != 200 ) {
    console.log('statusCode:', res.statusCode);
    throw("Not a good response")
  } 

  console.log('statusCode:', res.statusCode);
  console.log('headers:', res.headers);
  let response = ""  
  
  res.on('data', (d) => {
    response += d
    process.stdout.write(d);
  });

  res.on('end', ()=>{
    console.log("=================")
    console.log(JSON.parse(response))
    }
)

}).on('error', (e) => {
  console.error(e);
});



// axios.get("https://eodhistoricaldata.com/api/search/GAZPROM",
//     {params : {
//     "api_token":`${EODHISTORICALDATA_API_KEY}`,
// //    "fmt":"json"
// },
//     headers: [
//        // {'User-Agent': 'test'},
//         {"Accept-Language": "en-US,en;q=0.5"},
//         {"Accept-Encoding":"gzip, deflate, br"},
//         {"User-Agent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:107.0) Gecko/20100101 Firefox/107.0"}
//     ],
// })
// .then(function (response) {
//     // handle success
//     console.log(response);


    
//     console.log(new TextDecoder().decode(response.data))
// })
// .catch(function (error) {
//     // handle error
//     console.log(error);
// })
// .finally(function () {
//     // always executed
// });


