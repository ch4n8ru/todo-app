const app = require("../index");
const chai = require("chai");
const chaiHttp = require("chai-http");
const { it } = require("mocha");
const mongoose = require('mongoose');
const { assert } = chai;
chai.use(chaiHttp);
const users = require("./testdata/users.json")


before((done) => {
    try {
        mongoose.connect(process.env.MONGO_URI, { dbName: process.env.MONGO_DB_NAME, useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true });
    }
    catch (err) {
        done(err)
    }
    mongoose.connection.on('open', async () => {
        try {
            console.log(`Connected to Database`)
            await mongoose.connection.db.dropDatabase()
            console.log(`Dropping database`)
            done()
        }
        catch (err) {
            done(err)
        }
    })

    mongoose.connection.on('error', (err) => {
        console.log('Could not connect to database ' + err)
        done(err);
    })
})

describe("Authentication", () => {
    describe("Sign Up", () => {
        it("signs up users", done => {
            chai.request(app)
                .post('/auth/signup')
                .send({
                    "email": "test@abc.com",
                    "name": "test user",
                    "password": "234rewWTw3#",
                    "confirmpassword": "234rewWTw3#"
                })
                .end((err, res) => {
                    if (!err) {
                        assert.propertyVal(res.body, "success", true, "Should return success true on signup success");
                    }
                    if (err) done(err)
                    done();
                })
        }),
            it("checks email already in use", done => {
                chai.request(app)
                    .post('/auth/signup')
                    .send({
                        "email": "test@abc.com",
                        "name": "test user",
                        "password": "234rewWTw3#",
                        "confirmpassword": "234rewWTw3"
                    })
                    .end((err, res) => {
                        assert.equal(res.status, 422, "Should return 422 status code")
                        assert.deepEqual(res.body, {
                            "message": "Email ID already in use",
                            "errorCode": "ERR-VAL"
                        }, "Error messages must match")
                        if (err) done(err)
                        done()
                    })
            })
        it("checks mismatched passwords", done => {
            chai.request(app)
                .post('/auth/signup')
                .send({
                    "email": "test1@abc.com",
                    "name": "test user",
                    "password": "234rewWTw3#",
                    "confirmpassword": "234rewWTw3"
                })
                .end((err, res) => {
                    assert.equal(res.status, 422, "Should return 422 status code")
                    assert.deepEqual(res.body, {
                        "message": "Passwords do not match",
                        "errorCode": "ERR-VAL"
                    }, "Error messages must match")
                    if (err) done(err)
                    done()
                })
        })
    })


    describe("POST login", () => {
        it("logs in users", done => {
            chai.request(app)
                .post('/auth/login')
                .send({
                    "email": "test@abc.com",
                    "password": "234rewWTw3#",
                })
                .end((err, res) => {
                    assert.equal(res.status, 200, "Should return 200 status code")
                    assert.hasAllKeys(res.body, ['token', 'refreshToken'])
                    // assert.property(res.cookie, "AuthToken")
                    if (err) done(err)
                    done()
                })
        })

        it("throws error for users that dont exist yet", done => {
            chai.request(app)
                .post('/auth/login')
                .send({
                    "email": "test1@abc.com",
                    "password": "234rewWTw3#",
                })
                .end((err, res) => {
                    assert.equal(res.status, 401, "Should throw error for invalid email")
                    assert.deepEqual(res.body, {
                        "message": "User doesn't exist",
                        "errorCode": "ERR-INV-USER"
                    })
                    if (err) done(err)
                    done()
                })
        })

        it("should throw error for invalid password", done => {
            chai.request(app)
                .post('/auth/login')
                .send({
                    "email": "test@abc.com",
                    "password": "234rewWTw3",
                })
                .end((err, res) => {
                    assert.equal(res.status, 401, "Should throw error for invalid password")
                    assert.deepEqual(res.body, {
                        "message": "Authentication failed",
                        "errorCode": "ERR_INV_CRED"
                    })
                    if (err) done(err)
                    done()
                })
        })
    })

    describe("POST logout", () => {
        it("logs out users", done => {
            chai.request(app)
                .post("/auth/logout")
                .send({
                    "token": "asdasdasdjansidvubapsivuboaigeargaeg"
                })
                .end((err, res) => {
                    assert.equal(res.status, 200)
                    assert.deepEqual(res.body, {
                        "success": true
                    })
                    if (err) done(err)
                    done()
                })
        })
    })

    describe("POST refresh tokens", () => {
        let tokens;
        before(done => {
            chai.request(app)
                .post('/auth/login')
                .send({
                    "email": "test@abc.com",
                    "password": "234rewWTw3#",
                })
                .end((err, res) => {
                    if (err) done(err)
                    tokens = res.body;
                    done()
                })
        })

        it("refreshes token for a valid token, refreshToken pair", done => {
            chai.request(app)
                .post('/auth/refreshToken')
                .send({
                    "token": `${tokens.token}`,
                    "refreshToken": `${tokens.refreshToken}`
                })
                .end((err, res) => {
                    assert.equal(res.status, 201, "Should return 201 status code")
                    assert.hasAllKeys(res.body, ['token', 'refreshToken'])
                    if (err) done(err)
                    done()
                })
        })

        it("throws error for an invalid token, refreshToken pair", done => {
            chai.request(app)
                .post('/auth/refreshToken')
                .send({
                    "token": `${tokens.token}`,
                    "refreshToken": `${tokens.refreshToken.slice(1)}`
                })
                .end((err, res) => {
                    assert.equal(res.status, 440, "Should return 440 status code")
                    assert.deepEqual(res.body,
                        {
                            "message": "Session Ended",
                            "errorCode": "ERR-INV-SESSION"
                        })
                    if (err) done(err)
                    done()
                })
        })
    })

    describe("AUTH checker", () => {
        let tokens;
        before(done => {
            chai.request(app)
                .post('/auth/login')
                .send({
                    "email": "test@abc.com",
                    "password": "234rewWTw3#",
                })
                .end((err, res) => {
                    if (err) done(err)
                    tokens = res.body;
                    done()
                })
        })

        it("does not throw Authorization error if proper token is provided", done => {
            chai
                .request(app)
                .get('/test')
                .set({ "Authorization": `Bearer ${tokens.token}` })
                .end((err, res) => {
                    assert.notEqual(res.status, 403)
                    assert.notDeepEqual(res.body,
                        {
                            "message": "No Authorization details sent",
                            "errorCode": "ERR-NOT-AUTH"
                        }, "should not throw authentication details not sent")
                    assert.notDeepEqual(res.body,
                        {
                            "message": "Invalid User",
                            "errorCode": "ERR-NOT-AUTH"
                        }, 
                        "should not throw invalid user error")
                    if (err) done(err)
                    done()
                })
        })

        it("throws no Authorization details sent if Authorization header is missing", done => {
            chai
                .request(app)
                .get('/test')
                .end((err, res) => {
                    assert.equal(res.status, 403)
                    assert.deepEqual(res.body,
                        {
                            "message": "No Authorization details sent",
                            "errorCode": "ERR-NOT-AUTH"
                        }, 
                        "throw no Authorization details sent")
                    if (err) done(err)
                    done()
                })
        })

        it("throws Not Authorized if invalid token is sent", done => {
            chai
                .request(app)
                .get('/test')
                .set({ "Authorization": `Bearer auskfypwiugbvurwyvbysvoafppnreaub`})
                .end((err, res) => {
                    assert.equal(res.status, 403)
                    assert.deepEqual(res.body,
                        {
                            "message": "Invalid User",
                            "errorCode": "ERR-NOT-AUTH"
                        },  
                        "should throw Invalid user error")
                    if (err) done(err)
                    done()
                })
        })
    })
})
