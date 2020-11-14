# Configuration 

Configuration is managed via https://www.npmjs.com/package/config
to add production configuration:
- create file config/production.yaml and override the fields which are needed to be changed 
- db configuration reflects knex connection structure: 
```js
    const conf = {
    client: 'postgresql',
    connection: {
      database: 'my_db',
      user:     'username',
      password: 'password'
    },
    pool: {
      min: 2,
      max: 10
    }
}
```  
