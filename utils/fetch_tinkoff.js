const OpenAPI = require('@tinkoff/invest-openapi-js-sdk')

const apiURL = 'https://api-invest.tinkoff.ru/openapi/sandbox'
const socketURL = 'wss://api-invest.tinkoff.ru/openapi/md/v1/md-openapi/ws'
const secretToken = 't.Ay5qNdAVvqPiUWwyA4qm-RUBmgcMm8CrezGpfmkpFTDHcqH0APx9bXGQx6ojbutIi51ti5cf77buvqifj1JjDA' // токен для сандбокса
const api = new OpenAPI({ apiURL, secretToken, socketURL })

const knexConfig = require('../knexfile').development
const knex = require('knex')(knexConfig)

!(async () => {
  const stocks = await api.stocks()

  stocks.instruments.forEach( (stock) =>{
    console.log(stock)
    knex('securities').insert(
      {
        'type':'stock',
        'ticker':stock.ticker,
        'title':stock.name,
        'currency':stock.currency,
        'provider_info':JSON.stringify({
         'tinkoff': stock
        })

      }
    ).then((r)=>{
      console.log(r)
    })

  } )

  // console.log(stocks)


})()
