const { ApolloServer, gql } = require('apollo-server');
const { buildFederatedSchema } = require('@apollo/federation');
const { v4 } = require('uuid');
const config = require('config');
const Knex = require('knex');

const typeDefs = gql`
  type Query {
    user(email:String): User,
    users: [User]
  }
  
  type Mutation {
     registerUser(email: String, passHash:String):User
  }

  type User @key(fields: "email" ) {
    id: ID!
    email: String!
  }
 
`;



const knexConfig = config.get('database')
knex = Knex(knexConfig)



let users = [
    {id:"1",
    email:"i.averin@gmail.com",
    passHash:"insect"}
]

const userCheckAuth = (emailToFind, passHashToFind ) => {
    return users.find( ({email, passHash}) => {return email === emailToFind && passHash === passHashToFind } )
}

const fetchUserByEmail= (emailToFind) =>{
    const user = users.find( ({email}) =>  email === emailToFind )
    if (user)
         {
             return ( {id, email} = user )
         }
     return undefined
}

const registerUser=(email, passHash) => {
   const u = {
       id: v4(),
       email: email,
       passHash: passHash
   }
    users.push(u)



    return u
}

const resolvers = {
    Query: {
        user(parent, args, context, info) {
            return fetchUserByEmail(args.email)
        },

        users(parent, args, context, info) {
            return users
        }
    },
    Mutation: {
        registerUser(parent, args, context, info){
            return registerUser(args.email, args.passHash)
        }
    },

    User: {
        __resolveReference(user, {fetchUserByEmail}){
            return fetchUserByEmail(user.email)
        }
    }
}

const server = new ApolloServer({
    schema: buildFederatedSchema([{ typeDefs, resolvers }])
});

server.listen(4001).then(({ url }) => {
    console.log(`🚀 Server ready at ${url}`);
});
