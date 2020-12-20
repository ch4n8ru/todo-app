const app = require("../index");
const chai = require("chai");
const chaiHttp = require("chai-http");
const { it } = require("mocha");
const mongoose = require('mongoose');
const userModel = require("../models/user")
const { expect, assert } = chai;
chai.use(chaiHttp);

before((done) => {
    try{
        console.log(`Connected to Database ${process.env.MONGO_DB_NAME} ${process.env.MONGO_URI}`)
        mongoose.connect(process.env.MONGO_URI, { dbName: process.env.MONGO_DB_NAME, useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true });
    }
    catch(err){
        done(err)
    }
    mongoose.connection.on('open', async () => {
        try {
            await mongoose.connection.db.dropDatabase()
            console.log(`Dropping database ${process.env.MONGO_DB_NAME}`)
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

describe("Authentication", (done) => {
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


    describe("login", done => {
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
    })
})
