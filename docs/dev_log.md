

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
  - [x] refresh token when refreshed in frontend. refreshToken query
  - [x] migrate to single backend for WEB front-end https://dev.to/givehug/next-js-apollo-client-and-server-on-a-single-express-app-55l6 Does not works - because getting session on server side requres NextAuth request context  
  - [ ] try to set graphql server within next.js api https://www.smashingmagazine.com/2020/10/graphql-server-next-javascript-api-routes/  
  - [x] create protected grapql request (user's profile)
  - [x] pass auth header from front-end via apollo's stateful link https://www.apollographql.com/docs/react/api/link/introduction/#stateful-links 
  - [x] set Auth error on server and process it on fronend https://www.apollographql.com/docs/apollo-server/data/errors/   
  - [x] set protected graphql queries and mutations
  - [x] check max age of refreshed token
  - [x] implement refersh token 

- [X] Portfolio
  - [ ] Basic Management  
    - [X] Add instrument in portfolio:
         - Date picker https://reactdatepicker.com/
         - Render component as a render prop in react-hook-form https://react-hook-form.com/api#Controller
    - [x] List of added assets
      - [x]  /portfolio should display the list of added items
      - [x]  /portfolio/deals/index.js should display the list of deals with the ticker filter
            - [ ] and date range filter
      - [o] delete single deal from /deals page
          - [X] show modal with delete confirmation
          - [X] display loading state until mutation complete
          - [X] make dealDelete mutation and display the result
          - [X] update deals list 
          - [X] don't display deals if there is no any
            - [X] return ticker information in deals for ticker request in order to display ticker on deals page
                  when there are no deals for ticker 
        
  - [ ] Several Portfolios in account
      - [ ] Create / Edit / Archive
    
  - [ ] Release and Deploy

- [ ] Add broker ref for deal 
  - [ ] Upload from Sss file  
 
- [ ] Calc portfolio current value  
 
- [ ] Dashboards 
    - [ ] Single Portfolio Dashboard
    - [ ] Compare Portfolios
  
- [ ] Fix frontend to be smooth and nice 
- [ ] Consider hasura as a gateway  
- [ ] (opt) store users in strapi
- [ ] (opt) remove providing updated token in gateway response 
   

## Tokens
- [The Ultimate Guide to handling JWTs on frontend clients (GraphQL)](https://hasura.io/blog/best-practices-of-using-jwt-with-graphql)
- [httpOnly Cookies](https://owasp.org/www-community/HttpOnly)



  

