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
        securities(sort: String,limit: Int,start: Int,search: String): [Security]
    }
`
const fetchSecurities = async (args, strapiConfig) =>  {
    const limit = args.limit || 0
    const search = args.search || ""

    const gqlQuery = gql`query securities($limit: Int, $search:String){ 
                        securities(limit:$limit, where: {_or:[{ticker_contains: $search},{title_contains: $search}]}) {
                        company:title
                        ticker
                      }
                   }
      `
    try {
        const ret =await request(strapiConfig["graphql_endpoint"], gqlQuery, {
            limit:limit,
            search: search})
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

