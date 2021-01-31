const  server = require('./api/gateway')

server.listen().then(({url}) => {
    logger.info(`🚀 Server ready at ${url}`)
    //console.log(`🚀 Server ready at ${url}`)
})
