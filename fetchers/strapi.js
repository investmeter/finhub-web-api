// fetch securities information from strapi

const { request } = require('graphql-request')
const { gql } = require('graphql-request');
const GraphQLJSON = require('graphql-type-json');


const typeDefs = `
     scalar JSON
     scalar DateTime
        
     enum ENUM_SECURITY_TYPE {
        bond
        stock
        crypto
        etf
        currency
        }
     
     type Security {
      id: ID!
      title: String
      ticker: String
      type: ENUM_SECURITY_TYPE
      provider_info: JSON
      published_at: DateTime
      # icon(sort: String, limit: Int, start: Int, where: JSON): [UploadFile]
    }
    
    
    type Query { 
        securities(sort: String,limit: Int,start: Int,where: JSON): [Security]
    }
`
const fetchSecurities = async (args, strapiConfig) =>  {
    const limit = args.limit || ""
    const query = args.query || {}

    const gqlQuery = gql`query securities($where:JSON){ 
                        securities(where: $where) {
                        company:title
                        ticker
                      }
                   }
        
      `
    try {
        const ret =await request(strapiConfig["graphql_endpoint"], gqlQuery, {where: args.where})
    return  ret.securities
    }
    catch(e){
        console.log(e)
        return []
    }

}

const resolvers = {
    Query: {
        securities(parent, args, context, info) {
            return fetchSecurities(args, context.config.get("strapi"))
        }
    },
    JSON: GraphQLJSON

}

const StrapiSchema = {
    typeDefs: typeDefs,
    resolvers: resolvers
}


module.exports = StrapiSchema

