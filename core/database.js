const { SQLDataSource } = require("datasource-sql");

const MINUTE = 60;

class MyDatabase extends SQLDataSource {
    createUser(user){
        return this.knex('users').insert(user, 'user_uuid').then(
             (result)=>{
                 console.log("OK")
                 console.log(user)
                 return user
             }
         ).catch((error) =>{console.log(error)});

         // return user
    }
}

module.exports = MyDatabase;
