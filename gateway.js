const { ApolloServer } = require('apollo-server');
const { ApolloGateway, RemoteGraphQLDataSource, GatewayConfig } = require('@apollo/gateway');

const  isProd = false


const gatewayOptions = {
    serviceList: [
        { name: "strapi", url: "http://localhost:1337/graphql" }

    ],
    debug: isProd ? false : true
}

const gateway = new ApolloGateway(gatewayOptions);
const server = new ApolloServer({
    gateway,
    subscriptions: false, // Must be disabled with the gateway; see above.
});

const port = process.env.PORT || 4000;
server.listen({ port }).then(({ url }) => {
    console.log(`🚀 Server ready at ${url}`);
});

