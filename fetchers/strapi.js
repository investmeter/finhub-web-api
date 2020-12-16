// fetch securities information from strapi

const { request } = require('graphql-request')
const { gql } = require('apollo-server');


const typeDefs = `
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
        securities(
                sort: String
                limit: Int
                start: Int
                where: JSON
                # publicationState: PublicationState
        ): [Security]
    }
`
const fetchSecurities = async (args, strapiConfig) =>  {
    const limit = args.limit || ""
    const query = args.query || {}

    const gqlQuery = gql`query securities($query:String){
                        securities(where: {_or:[{ticker_contains: $query},{title_contains:$query}]}) {
                        company:title
                        ticker
                      }
        }
      `

    return await request(strapiConfig["graphql_endpoint"], gqlQuery, {query: args.query} )


}

const resolvers = {
    Query: {
        securities(parent, args, context, info) {
            return fetchSecurities(args, context.config.get("strapi"))
        },
    }
}

const StrapiSchema = {
    typeDefs: typeDefs,
    resolvers: resolvers
}


module.exports = StrapiSchema

