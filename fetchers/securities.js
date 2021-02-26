const { gql } = require('apollo-server')

const config = require('config')
const logger = require("../core/logger")
const database = require("../core/database")
const GraphQLJSON = require("graphql-type-json");

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
      currency: String
      # icon(sort: String, limit: Int, start: Int, where: JSON): [UploadFile]
    }
    
    
    type Query { 
        securities(sort: String,limit: Int,start: Int,search: String): [Security]
    }
`


const knexConfig = config.get('database')
const db = new database(knexConfig);

const fetchSecurities = async (args, strapiConfig) =>  {
  const limit = args.limit || 0
  const search = args.search || ""

  let sql

  if (search)  {
  const searchWords = search.split(' ').reduce((acc,cur) => {
    return cur!==''?acc.concat(cur):acc;
  }, [])

  const searchParams =  searchWords.reduce (
    (result, current, i) => {
      return result.concat(i>0?',':'').concat(`'%${current}%'`)
    }, '')

   sql = `select s.id, s.type, s.ticker, s.currency, s.title, s.provider_info
   from securities s where ticker ilike any(array[${searchParams}]) or 
   title ilike any(array[${searchParams}])`
  }
  else{
     sql = `select s.id, s.type, s.ticker,s.currency, s.title, s.provider_info
   from securities as s limit ${limit}`
  }

  return db.knex.raw(sql).then(
    (result)=>{
      console.log("Result ", result.rows)
      return result.rows
    }
  )

}

const resolvers = {
  Query: {
    securities(parent, args, context, info) {
      return fetchSecurities(args, context.config.get("strapi"))
    }
  },
  JSON: GraphQLJSON

}




module.exports = {
  typeDefs: typeDefs,
  resolvers: resolvers
}
