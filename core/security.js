const jwt = require('jsonwebtoken')

function jwtToken(userUuid, payload, secret, expiresIn){

    return jwt.sign({

            userUuid:userUuid,
            ...payload

    }, secret, {expiresIn: expiresIn});
}

function verifyToken(token, secret) {
    try{
        return jwt.verify(token, secret, {clockTolerance: 5})
    }
    catch (err)
    {
     if (err.name === 'TokenExpiredError') {
         return {
             error: 'TokenExpired'
         }
      }
     return {
         error: 'WrongToken'
     }
    }
}

module.exports={jwtToken, verifyToken}
