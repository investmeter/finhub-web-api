const { SQLDataSource } = require("datasource-sql");

const MINUTE = 60;

class MyDatabase extends SQLDataSource {
    createUser(user){
        return this.knex('users').insert(user, 'user_uuid').then(
             (result)=>{
                 console.log("OK")
                 console.log("Result ", result)
                 console.log("User ", user)
                 return user
             }
         )
         // return user
    }

    authUser(email, passHash){
        return this.knex('users').select().where({email:email, passHash:passHash}).then(
            (result)=>{
                console.log("Auth OK")
                console.log("Result ", result)
                return {
                        user_uuid:result[0]["user_uuid"],
                        email: result[0]["email"]
                        }
            }
        )
        // return user
    }


}

module.exports = MyDatabase;
