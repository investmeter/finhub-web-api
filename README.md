# Configuration

```shell

# install knex cli tool 
npm install knex -g

# create knexfule
knex init
```

Edit knex file to smthlike this: 
```js
   development: {
    client: 'sqlite3',
    connection: {
      filename: './dev.sqlite3'
    }
  },
...
```
 
Run migration 
```shell
knex migrate:latest --env development 
```

Run gateway.js after launching strapi
```shell
node gateway.js
```

  
# Production 

copy config/default.yml to production.yml
edit settings 

```shell
pm2 start pm2.ecosystem.config.js
pm2 restart pm2.ecosystem.config.js
pm2 start pm2.ecosystem.config.js --only "finhub-web-api"
pm2 start pm2.ecosystem.config.js --only "finhub-web-front"
```
