const { ApolloServer, gql } = require('apollo-server');
const config = require("config")
// const { ApolloGateway, RemoteGraphQLDataSource, GatewayConfig } = require('@apollo/gateway');
const {_} = require('lodash');
const  isProd = false

const typeDefs = gql(require("./users").typeDefs+ require("./fetchers/strapi").typeDefs)
const resolvers = _.merge(require("./users").resolvers, require("./fetchers/strapi").resolvers)

const server = new ApolloServer({typeDefs, resolvers, context: {config: config}})

server.listen(4000).then(({ url }) => {
    console.log(`🚀 Server ready at ${url}`)
})
