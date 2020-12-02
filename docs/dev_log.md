
## Registration and auth
- mock graphQl auth schema
graphQl queries
```
query get_users{
  users
   {
    id
    email
  }
}

mutation create_user{
  registerUser(email:"4444", passHash:"4444") {
    id
  }
}

``` 
- user knex and apollo sql data source



## Roadmap
- Switch off federation and manually wrap strapi because of need of using subscriptions
V Registration method
- Authorization from Db
