const { ApolloServer, gql } = require('apollo-server');
// const { ApolloGateway, RemoteGraphQLDataSource, GatewayConfig } = require('@apollo/gateway');
const {_} = require('lodash');
const  isProd = false

const typeDefs = _.merge(require("./users").typeDefs)
const resolvers = _.merge(require("./users").resolvers)

const server = new ApolloServer({typeDefs, resolvers})

server.listen(4000).then(({ url }) => {
    console.log(`🚀 Server ready at ${url}`)
})
