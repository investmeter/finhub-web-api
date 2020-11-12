
## Registration and auth
- mock graphQl auth schema 
- Use prisma as ORM https://www.prisma.io/docs/getting-started/setup-prisma/start-from-scratch-prisma-migrate-node-postgres 

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

## Roadmap
- Switch off federation and manually wrap strapi because of need of using subscriptions
