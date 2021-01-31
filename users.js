const { gql } = require('apollo-server');

const { v4 } = require('uuid');
const config = require('config');
const security = require('./core/security');

const logger=require("./core/logger")

const database = require("./core/database");

const typeDefs = `
  type Query {
    user(email:String): User
    authUser(email:String, passHash:String): User
    userProfile(user_uuid:String): UserProfile
    users: [User]
    webClientToken(user_uuid:String):String 
    refreshToken:String
    
  }
  
  type Mutation {
     registerUser(email: String, passHash:String): RegisterUserResult
  }

  type User{
    user_uuid: ID!
    email: String!,
    token: String
   
  }
  
  type UserProfile{
    user_uuid: ID,
    email: String,
    error: String
  }
  
  type RegisterUserResult{
    user: User,
    result: String
  }
 
`;



const knexConfig = config.get('database')
const db = new database(knexConfig);

// knex = Knex(knexConfig)

const authUser = async ( email, passHash) =>{
    try {
        const user = await db.authUser(email, passHash)
        console.log(user)
        return {
            ...user,
            token: webClientToken(user.user_uuid,config.get('token').secret, config.get('token').expiresIn )
        }
    }
    catch (err){
        logger.warning(`Error ${err}`)
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
           email:u.email
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

const fetchUserProfile  = async (userUuid) =>{
    try {
        let user = await db.userProfile(userUuid)
        return  {
            ...user,
            error:undefined
        }

    }
    catch (e){
        return {
            user: undefined,
            error: e.toString()
        }
    }
}



const webClientToken= (userUuid, webClientSecret, exipiersIn = 60*60) => {
    return security.jwtToken(userUuid, {}, webClientSecret, exipiersIn)
}


const resolvers = {
    Query: {

        authUser(parent, args, context, info){
            return authUser(args.email, args.passHash)
        },

        refreshToken(parent, args, context, info){
            return context.newToken? context.newToken : undefined
        },
        userProfile(parent, args, context, info) {
            if (context.userUuid) {
                return fetchUserProfile(args.user_uuid)
            } else
                {
                    return {
                        error: "Permission denied"
                    }
                }
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
