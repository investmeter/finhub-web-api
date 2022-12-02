const https = require('node:https');
const { resolve } = require('node:path');

// bootstrapping 

async function get(requestUrl) {
  return new Promise((resolve, reject)=>{

    https.get(requestUrl, (res) => {
  
      if(res.statusCode != 200 ) {
        reject(`Server error ${res.statusCode}`)
      } 
      
      let response = ""  
      
      res.on('data', (d) => {
        response += d
      });
    
      res.on('end', ()=>{
        try {
          const resp = JSON.parse(response)
          resolve(JSON.parse(response))
        }
        catch(e) {
          reject(e)
        }
        
      }
    )
    
    }).on('error', (e) => {
      reject(e)
    });
   }
  )
}

    


module.exports = {get}
