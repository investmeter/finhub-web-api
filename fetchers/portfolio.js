const { gql } = require('apollo-server')

const config = require('config')
const logger = require("../core/logger")
const database = require("../core/database")
const GraphQLJSON = require("graphql-type-json");
const _ = require('lodash')

const typeDefs = gql`
    
    type PortfolioItem {
        asset:Security
        last_deal_timestamp: String
        amount: Int
        current_value:Float
    }
    
    type Portfolio {
      assets: [PortfolioItem]
    }
     
     type Deal {
        id: ID
        timestamp: Int
        deal_timestamp: String
        type: ENUM_SECURITY_TYPE
        user_uuid: String
        security_id: Int
        amount: Float
        price: Float
        currency: String
        fee: Float
        fee_currency: String
        payload: JSON
        comment: String
    }
    
    input DealInput {
        
        timestamp: Int
        deal_timestamp: String
        type: ENUM_SECURITY_TYPE
        user_uuid: String
        security_id: Int
        amount: Float
        price: Float
        totalPaid: Float
        currency: String
        fee: Float
        fee_currency: String
        payload: JSON
        comment: String
    }
    
    type DealResult{
      result: String
  }

     type Mutation {
       addDeal(input: DealInput ): DealResult
  }
     
     type Query {
        getUserPortfolio: [PortfolioItem]
     }

`


const knexConfig = config.get('database')
const db = new database(knexConfig);

const addDeal = async (args, context) =>  {
  // const limit = args.limit || 0
  // const search = args.search || ""
  if (!context.userUuid) {
    console.error("No userUuid in token")
    return {
        result: 'UNAUTHENTICATED',
        id: undefined
    }
  }

  const deal= {
    timestamp: new Date(),
    deal_timestamp: _.get(args, 'input.deal_timestamp'),
    type: _.get(args,'input.type'),
    user_uuid: _.get(context,'userUuid'),
    security_id: _.get(args,'input.security_id'),
    amount: _.get(args,'input.amount'),
    price: _.get(args,'input.price'),
    total_paid:_.get(args,'input.totalPaid'),
    currency: _.get(args, 'input.currency'),
    fee: _.get(args,'input.fee'),
    fee_currency: _.get(args,'input.fee_currency'),
    payload: _.get(args,'input.payload'),
    comment: _.get(args, 'input.comment')
  }
  return db.knex('user_deals').insert(deal, ['id']).then(
    (result)=>{
      console.log("Result ", result)
      return {
        result:'ok',
      }
    }
  ).catch((e) => {
    console.log('Error adding deal')
    console.log(e)
    return {
      result:'ERROR_ADDING_DEAL'
    }
  })

}

const resolvers = {
  Mutation: {
    addDeal(parent, args, context, info) {
      return addDeal(args, context)
    }
  },
  JSON: GraphQLJSON

}




module.exports = {
  typeDefs: typeDefs,
  resolvers: resolvers
}
