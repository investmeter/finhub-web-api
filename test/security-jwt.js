const assert = require('assert')
const expect = require('chai').expect

const security = require('../core/security')
const secret = "secret"
const userUuid = "1111-2222-3333-4444-5555"

describe('jwt web client', ()=>{

    const token = security.jwtToken(userUuid, {}, secret, 1)

    it('token should be generated', function(){
        expect(token).to.be.a("string")
    })


    it("user id from token payload should be the same as initial", function(){
        const payload = security.verifyToken(token, secret)
        expect(payload).to.have.nested.property('data.userUuid',userUuid)
        })

    it.skip('should expire after 1 second with allowed tolerance', function(done){
        this.timeout(15000)
        setTimeout( ()=>{
            const res = security.verifyToken(token, secret)
            expect(res).to.have.nested.property('error', 'TokenExpired')
            done()
        }, 7000 )
    })

    it("token should be refreshed with the same payload as original", function(){
        const oldPayload = security.verifyToken(token, secret)

        const refreshedToken = security.refreshToken(token, secret, 10)
        const newPayload = security.verifyToken(refreshedToken, secret)

        expect(newPayload).to.have.nested.property('data.userUuid', userUuid)
        expect(newPayload.exp).to.be.greaterThan(oldPayload.exp)


        })
    }
)


