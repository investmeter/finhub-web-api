const {ApolloServer, gql, mergeSchemas, makeExecutableSchema} = require('apollo-server');
const config = require("config")
// const { ApolloGateway, RemoteGraphQLDataSource, GatewayConfig } = require('@apollo/gateway');
const {_} = require('lodash');
const httpHeadersPlugin = require("apollo-server-plugin-http-headers");
const security = require('./core/security')
const logger = require('./core/logger')

const isProd = false

// const typeDefs = gql(require("./users").typeDefs +
//   require("./fetchers/securities").typeDefs +
//   require("./fetchers/portfolio").typeDefs)

const schemas = [(require("./users").typeDefs),
    (require("./fetchers/securities").typeDefs),
    (require("./fetchers/portfolio").typeDefs)]

//const resolvers = _.merge(require("./users").resolvers, require("./fetchers/strapi").resolvers)

const gatewaySchema = mergeSchemas({
    schemas: schemas,
    resolvers: [require("./users").resolvers,
        require("./fetchers/securities").resolvers,
        require("./fetchers/portfolio").resolvers]
    })

const server = new ApolloServer({
    schema: gatewaySchema,
    plugins: [httpHeadersPlugin],
    context: ({req}) => {

        console.log("Request headers: ", req.headers)
        console.log("Request body: ", req.body)

        const secret = config.get("token").secret
        const expiresIN = config.get("token").expiresIn
        const token = security.parseAuthorizationBearer(req)

        const tokenPayloadUserUuid = _.result(security.verifyToken(token, secret), 'data.userUuid')

        const newToken = tokenPayloadUserUuid ? security.refreshToken(
            token,config.get("token").secret, config.get("token").expiresIn) : undefined

        return {
            token,
            userUuid: tokenPayloadUserUuid,
            newToken: newToken,
            config: config,
            setHeaders:
                newToken ? new Array({
                    key: "Authorization",
                    value: security.createAuthorizationBearer(newToken)
                }) : []
        }
    }
})

server.listen(process.env.SERVER_PORT).then(({url}) => {
    logger.info(`🚀 Server ready at ${url}`)
    //console.log(`🚀 Server ready at ${url}`)
})
