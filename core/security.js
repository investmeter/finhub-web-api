const jwt = require('jsonwebtoken')

function jwtToken(userUuid, payload, secret, expiresIn, options){

    return jwt.sign({
            data:{
                userUuid:userUuid,
                ...payload
            }

    }, secret, {expiresIn: expiresIn, ...options});
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

function refreshToken(token, secret, expiresIn){
    const payload = jwt.verify(token, secret, {clockTolerance: 5, ignoreExpiration:true, })
    return jwtToken(payload.data.userUuid,payload.data, secret,  expiresIn)
}

function parseAuthorizationBearer(req){
    if (!req.headers.authorization) return
    const headerParts = req.headers.authorization.split(' ')
    if (headerParts[0].toLowerCase() === 'bearer') return headerParts[1]
}

function createAuthorizationBearer(token){
    return 'Bearer ' + token
}

module.exports={jwtToken, verifyToken, refreshToken, parseAuthorizationBearer, createAuthorizationBearer}
