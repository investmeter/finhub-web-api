const { gql } = require('apollo-server')

const config = require('config')
const logger = require('../core/logger')
const database = require('../core/database')
const GraphQLJSON = require('graphql-type-json')
const _ = require('lodash')

const typeDefs = gql`
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

  type PortfolioAsset {
    asset: Security
    last_deal_timestamp: String
    amount: Int
    current_value: Float
  }

  type PortfolioAssetResponse {
    error: String
    portfolioAssets: [PortfolioAsset]
  }

  type Deal {
    id: ID
    timestamp: Int
    deal_timestamp: String
    type: ENUM_SECURITY_TYPE
    user_uuid: String
    asset: Security
    amount: Float
    price: Float
    total_paid: Float
    currency: String
    fee: Float
    fee_currency: String
    payload: JSON
    comment: String
    status: String
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

  type DealResponse {
    error: JSON
    deals: [Deal]
  }
  
  type UserPortfolio {
    id: ID
    timestamp_created: String
    status: String
    user_uuid: String
    title:String
    description: String
    icon_url: String
  }
  
  input UserPortfolioInput{
    timestamp_created: String
    user_uuid: String
    title:String
    description: String
    icon_url: String
  } 
  
  type UserPortfolioResponse{
    error: String
    userPortfolio: [UserPortfolio]  
  }  
  
  type Mutation {
    addDeal(input: DealInput): DealResponse
    """
    Delete (archive) deal from portfolio. Deal record will stay in db with status 'DELETED' 
    """
    deleteDeal(deal_id:Int): DealResponse
    
    """
    Create user's portfolio
    """
    addUserPortfolio(user_portfolio:UserPortfolioInput):UserPortfolioResponse
  }

  type Query {
    userPortfolio(user_uuid: String): PortfolioAssetResponse
    userDeals(user_uuid: String, security_id: Int): DealResponse
  }
`

const knexConfig = config.get('database')
const db = new database(knexConfig)
/**
 *
 * @param args
 * @param context
 * @return {Promise<{error: string, deals: []}>}
 */
const addDeal = async (args, context) => {
  // const limit = args.limit || 0
  // const search = args.search || ""
  if (!context.userUuid) {
    console.error('No userUuid in token')
    return {
      error: 'UNAUTHENTICATED',
      deals: [],
    }
  }

  const deal = {
    timestamp: new Date(),
    deal_timestamp: _.get(args, 'input.deal_timestamp'),
    type: _.get(args, 'input.type'),
    user_uuid: _.get(context, 'userUuid'),
    security_id: _.get(args, 'input.security_id'),
    amount: _.get(args, 'input.amount'),
    price: _.get(args, 'input.price'),
    total_paid: _.get(args, 'input.totalPaid'),
    currency: _.get(args, 'input.currency'),
    fee: _.get(args, 'input.fee'),
    fee_currency: _.get(args, 'input.fee_currency'),
    payload: _.get(args, 'input.payload'),
    comment: _.get(args, 'input.comment'),
  }
  return db
    .knex('user_deals')
    .insert(deal, ['id'])
    .then((result) => {
      console.log('Result ', result)
      return {
        error: '',
        deals: [deal],
      }
    })
    .catch((e) => {
      console.log('Error adding deal')
      console.log(e)
      return {
        error: 'ERROR_ADDING_DEAL',
        deals: [],
      }
    })
}
/**
 *
 * @param userUuid
 * @return {Promise<{portfolioAssets: [], error: string}|*>}
 */
const userPortfolio = async (userUuid) => {
  if (!userUuid) {
    console.error('No userUuid in token')
    return {
      error: 'UNAUTHENTICATED',
      portfolioAssets: [],
    }
  }

  return db.knex
    .raw(
      `select s.id, s.title, s.ticker, s.currency, 
        max(ud.deal_timestamp) as "last_deal_timestamp",
        sum(ud.amount) as "amount" from user_deals ud
        left join securities s on ud.security_id = s.id
        where ud.user_uuid = :user_uuid and ud.status = 'ACTIVE' 
        group by  s.id, s.title, s.ticker
        order by last_deal_timestamp desc`,
      { user_uuid: userUuid }
    )
    .then((result) => {
      const r = result.rows.map((item) => {
        return {
          last_deal_timestamp: item.last_deal_timestamp.toString(),
          asset: {
            id: item.id,
            title: item.title,
            ticker: item.ticker,
            currency: item.currency,
          },
          amount: item.amount,
          current_value: 0.0,
        }
      })
      return {
        error: '',
        portfolioAssets: r,
      }
    })
}

async function userDeals(userUuid, securityId) {
  if (!userUuid) {
    console.error('No userUuid in token')
    return {
      error: 'UNAUTHENTICATED',
      deals: [],
    }
  }

  const req = securityId?
     `select ud.id, ud.deal_timestamp, ud.security_id,
            ud.amount,
            ud.price,
            ud.total_paid , ud.fee,
            s2.type, 
            s2.ticker,
            s2.title, 
            s2.currency
            from user_deals ud
            left join securities s2 on s2.id = ud.security_id
            where user_uuid=:user_uuid and ud.security_id =:security_id and status = 'ACTIVE'
        order by deal_timestamp desc`
    : `select ud.id, ud.deal_timestamp, ud.security_id, ud.amount, ud.price, ud.total_paid , ud.fee,
            s2.type, 
            s2.ticker,
            s2.title, 
            s2.currency
            from user_deals ud
            left join securities s2 on s2.id = ud.security_id
            where user_uuid=:user_uuid and ud.status = 'ACTIVE' 
        order by deal_timestamp desc`

  return db.knex.raw(req, { user_uuid: userUuid, security_id: securityId }).then((result) => {
    const r = result.rows.map((item) => {
      return {
        ...item,
        deal_timestamp: item.deal_timestamp.toString(),
        asset: {
          id: item.security_id,
          title: item.title,
          ticker: item.ticker,
          currency: item.currency,
        },
      }
    })
    return {
      error: '',
      deals: r,
    }
  })
}

function deleteDeal(userUuid, dealId) {

  const req = `
  UPDATE user_deals ud SET status='DELETED' 
  where ud.id=:deal_id and ud.user_uuid = :user_uuid and ud.status = 'ACTIVE'  
  `

  return db.knex.raw(req, { user_uuid: userUuid, deal_id: dealId }).then((result) => {
    console.log(result)

    if (result.rowCount === 1) {
      return {
        error: "",
        deals: [{
          id: dealId,
          status: "DELETED"
        }]
      }
    } else {
      return {
        error: "DEAL_NOT_FOUND",
        deals: []
      }
    }
  }).catch((e) => {
    console.log(e)
    return {
      error: "ERROR",
      deals:[]
    }
  })
}

function addUserPortfolio(portfolio){
  const insertPayload = {
    user_uuid: 123,
    title: portfolio.title,
    description: portfolio.description,
    display_options: {
      icon_url: portfolio.icon_url
    }
  }
  return db.knex('user_portfolio').insert(insertPayload).returning('id')
    .then(
    (res) => {
      return {
        error:"",
        user_portfolio: [{
          id: res,
          ...portfolio,
        }]
      }
    }
  ).catch( (e) => {
    return {
      error: e,
      user_portfolio:[]
    }
  })

}


const resolvers = {
  Mutation: {
    addDeal(parent, args, context, info) {
      return addDeal(args, context)
    },
    deleteDeal(parent, args, context){
      if (!context.userUuid) {
        return {
          error: 'UNAUTHENTICATED',
          deals: [],
        }
      }
      return deleteDeal(context.userUuid, args.deal_id)
    },
    addUserPortfolio(parent, args, context){
      if (!context.userUuid){
        return {
            error: 'UNAUTHENTICATED',
            userPortfolio: []
        }
      }
      return addUserPortfolio(args.user_portfolio)
    }
  },
  Query: {
    userPortfolio(parent, args, context) {
      return userPortfolio(context.userUuid)
    },
    userDeals(parent, args, context) {
      if (args.user_uuid === context.userUuid) return userDeals(context.userUuid, args.security_id)

      return {
        error: 'UNAUTHENTICATED',
        deals: [],
      }
    },

  },

  // PortfolioItem: {
  //   asset: (parent) => {
  //     console.log(parent)
  //   }
  // }
  //
  // ,
  JSON: GraphQLJSON,
}

module.exports = {
  typeDefs: typeDefs,
  resolvers: resolvers,
}
