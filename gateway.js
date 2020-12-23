const { ApolloServer, gql, mergeSchemas } = require('apollo-server');
const config = require("config")
// const { ApolloGateway, RemoteGraphQLDataSource, GatewayConfig } = require('@apollo/gateway');
const {_} = require('lodash');
const httpHeadersPlugin = require("apollo-server-plugin-http-headers");

const  isProd = false

const typeDefs = gql(require("./users").typeDefs+ require("./fetchers/strapi").typeDefs)
//const resolvers = _.merge(require("./users").resolvers, require("./fetchers/strapi").resolvers)

const gatewaySchema = mergeSchemas({schemas: [typeDefs],
    resolvers:[require("./users").resolvers, require("./fetchers/strapi").resolvers]})

const server = new ApolloServer({
    schema: gatewaySchema,
    plugins: [httpHeadersPlugin],
    context: ({req}) => {
            const token = req.headers.authorization || ''
            return {
                token,
                config: config,
                setHeaders: new Array({ key: "headername", value: "headercontent" })
                }

        }
    })

server.listen(4000).then(({ url }) => {
    console.log(`🚀 Server ready at ${url}`)
})
