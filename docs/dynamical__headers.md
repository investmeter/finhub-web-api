# Setting headers in every Apollo client request


## General Approach: use links and context in query
1. Create Link to set request headers
2. Concat link with the httpLink
3. Request with the client.query with setted context  

Concat httpLink with the custom [Link](https://www.apollographql.com/docs/react/networking/advanced-http-networking/) 
to set context.header for request or use helper link [setContext](https://www.apollographql.com/docs/react/api/link/apollo-link-context/) to set context   


https://www.apollographql.com/docs/react/api/link/apollo-link-context/

```js

// custom link 

import { ApolloClient, HttpLink, ApolloLink, InMemoryCache, concat } from '@apollo/client';
import { setContext } from "@apollo/client/link/context";

const authMiddleware = new ApolloLink((operation, forward) => {
        // add the authorization to the headers
        operation.setContext({
            headers: {
                authorization: operation.getContext().token,
            }
        })
        return forward(operation)
    }

)
// setContext helper link 
const setAuthorizationLink = setContext((request, previousContext) => (
    {headers: {authorization: previousContext.token}
    }))


const client = new ApolloClient({
        ssrMode: typeof window === 'undefined',
        link: concat(setAuthorizationLink, new HttpLink({
            uri: 'http://localhost:4000/' // Server URL (must be absolute)
           // credentials: 'same-origin', // Additional fetch() options like `credentials` or `headers`
        })),
        cache: new InMemoryCache()
    })

// ...
const session 
const query = client.query({ query: MY_GRAPHQL_QUERY, context: { token: session.token }});

```






```js
// https://www.apollographql.com/docs/react/api/link/introduction/#stateful-links 

    import { ApolloLink, InMemoryCache } from '@apollo/client';
    
    const link = new ApolloLink((operation, forward) => {
    const { saveOffline } = operation.getContext();
    if (saveOffline) // do offline stuff
    return forward(operation);
    })
    
    const client = new ApolloClient({
    cache: new InMemoryCache(),
    link,
    });
    
    // send context to the link
    const query = client.query({ query: MY_GRAPHQL_QUERY, context: { saveOffline: true }});
```

## Getting context
operation.getContext()

```
The Operation object includes the following fields:

NAME	DESCRIPTION
query	A DocumentNode (parsed GraphQL operation) that describes the operation taking place.
variables	A map of GraphQL variables being sent with the operation.
operationName	A string name of the query if it is named, otherwise null.
extensions	A map to store extensions data to be sent to the server.
getContext	A function to return the context of the request. This context can be used by links to determine which actions to perform. See Managing context.
setContext	A function that takes either a new context object, or a function which takes in the previous context and returns a new one. See Managing context.
```

```js
import { ApolloLink } from '@apollo/client';

const timeStartLink = new ApolloLink((operation, forward) => {
  operation.setContext({ start: new Date() });
  return forward(operation);
});

const logTimeLink = new ApolloLink((operation, forward) => {
  return forward(operation).map((data) => {
    // data from a previous link
    const time = new Date() - operation.getContext().start;
    console.log(`operation ${operation.operationName} took ${time} to complete`);
    return data;
  })
});

const link = timeStartLink.concat(logTimeLink)
```


## Setting context
Context between links are maintained with ```operation.setContext```. However, this context is not included in
terminating link which should be actual call to graphQl server. So it could be useful only for passing data between 
links. 

```js
// https://www.apollographql.com/docs/react/api/link/introduction/#managing-context

const timeStartLink = new ApolloLink((operation, forward) => {
  operation.setContext({ start: new Date() });
  return forward(operation);
});
```

To set the actual request context (as set headers for example) the ```Conetext Link``` should be used. 
```js

// https://www.apollographql.com/docs/react/api/link/apollo-link-context/
import { setContext } from "@apollo/client/link/context";

const setAuthorizationLink = setContext((request, previousContext) => ({
  headers: {authorization: "1234"}
}));

const asyncAuthLink = setContext(
  request =>
    new Promise((success, fail) => {
      // do some async lookup here
      setTimeout(() => {
        success({ token: "async found token" });
      }, 10);
    })
);

```
 



### with setContext helper



