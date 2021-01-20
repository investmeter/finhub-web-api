

## Registration and auth
- mock graphQl auth schema
- user knex and apollo sql data source


## Roadmap
- [x] Registration method
- [x] Authorization from Db
- [x] Switch off federation and manually wrap strapi because of need of using subscriptions
     - [X] create wrapper for User 
     - [X] create wrapper for strapi??
     - [X] put in gateway
- [o] check JWT from frontend to get user id
  - [x] core  JWT token generation and verification
  - [x] provide token on auth request
  - [x] refresh token in response header on every request
  - [x] add logging   
  - [x] expire token
  - [ ] process error on wrong signature of token on fronent  
  - [ ] set protected graphql queries and mutations
  - [x] check max age of refreshed token
  - [x] implement refersh token 

- [ ] Store portfolio
- [ ] Display portfolio  
- [ ]~(optional) store users in strapi

## Tokens
- [The Ultimate Guide to handling JWTs on frontend clients (GraphQL)](https://hasura.io/blog/best-practices-of-using-jwt-with-graphql)
- [httpOnly Cookies](https://owasp.org/www-community/HttpOnly)



  

