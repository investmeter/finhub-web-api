const { gql } = require('apollo-server');

const { v4 } = require('uuid');
const config = require('config');

const database = require("./core/database");

const typeDefs = `
  type Query {
    user(email:String): User,
    authUser(email:String, passHash:String): User
    users: [User]
  }
  
  type Mutation {
     registerUser(email: String, passHash:String): RegisterUserResult
  }

  type User{
    user_uuid: ID!
    email: String!
  }
  
  type RegisterUserResult{
    user: User,
    result: String
  }
 
`;



const knexConfig = config.get('database')
const db = new database(knexConfig);

// knex = Knex(knexConfig)

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

const authUser = async ( email, passHash) =>{
    try {
        return await db.authUser(email, passHash)
    }
    catch (err){
        console.log(err)
        return undefined

    }

}

 const registerUser = async (email, passHash) => {
   const u = {
       user_uuid: v4(),
       email: email,
       passHash: passHash
   }

   try {
   let uss = await db.createUser(u)
   console.log(uss)
   return  {
       user: {
           user_uuid:u.user_uuid,
           email:u.email,
       },
       result:"OK"
    }
   }
   catch (error){
       console.log("Error ", error)
       return {
           user: undefined,
           result:"ERROR"
       }
   }
}

const resolvers = {
    Query: {
        user(parent, args, context, info) {
            return fetchUserByEmail(args.email)
        },

        users(parent, args, context, info) {
            return users
        },
        authUser(parent, args, context, info){
            return authUser(args.email, args.passHash)
        }
    },
    Mutation: {
        registerUser(parent, args, context, info){
            return registerUser(args.email, args.passHash)
        }
    },

    // User: {
    //     __resolveReference(user, {fetchUserByEmail}){
    //         return fetchUserByEmail(user.email)
    //     }
    //}
}

// const server = new ApolloServer({
//     schema: buildFederatedSchema([{typeDefs, resolvers, dataSources: () => ({ db }) }])
// });
//
// server.listen(4001).then(({ url }) => {
//     console.log(`🚀 Server ready at ${url}`);
// });

const UserSchema = {
    typeDefs: typeDefs,
    resolvers: resolvers
}

module.exports = UserSchema
