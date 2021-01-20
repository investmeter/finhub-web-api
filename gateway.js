const {ApolloServer, gql, mergeSchemas} = require('apollo-server');
const config = require("config")
// const { ApolloGateway, RemoteGraphQLDataSource, GatewayConfig } = require('@apollo/gateway');
const {_} = require('lodash');
const httpHeadersPlugin = require("apollo-server-plugin-http-headers");
const security = require('./core/security')
const logger = require('./core/logger')

const isProd = false

const typeDefs = gql(require("./users").typeDefs + require("./fetchers/strapi").typeDefs)
//const resolvers = _.merge(require("./users").resolvers, require("./fetchers/strapi").resolvers)

const gatewaySchema = mergeSchemas({
    schemas: [typeDefs],
    resolvers: [require("./users").resolvers, require("./fetchers/strapi").resolvers]
})

const server = new ApolloServer({
    schema: gatewaySchema,
    plugins: [httpHeadersPlugin],
    context: ({req}) => {
        const secret = config.get("token").secret
        const expiresIN = config.get("token").expiresIn
        const token = security.parseAuthorizationBearer(req)

        const tokenPayloadUserUuid = _.result(security.verifyToken(token, secret), 'data.userUuid')

        return {
            token,
            config: config,
            setHeaders:
                tokenPayloadUserUuid ? new Array({
                    key: "Authorization",
                    value: security.createAuthorizationBearer(
                        security.refreshToken(token, config.get("token").secret, config.get("token").expiresIn)
                    )
                }) : []
        }
    }
})

server.listen(4000).then(({url}) => {
    logger.info(`🚀 Server ready at ${url}`)
    //console.log(`🚀 Server ready at ${url}`)
})
