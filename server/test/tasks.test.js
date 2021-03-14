const app = require("../index");
const chai = require("chai");
const chaiHttp = require("chai-http");
const expect = chai.expect;
chai.use(chaiHttp);
const mongoose = require('mongoose');


const allTasks = require("./testdata/tasks.json")
const resultForSince = require("./testdata/allwithsince.json")
const users = require("./testdata/users.json")


// 5fe378ad64f0ae2fba24a3bc

before(done => {
    let dbConnection;
    try {
         dbConnection = mongoose.createConnection(process.env.MONGO_URI, { dbName: process.env.MONGO_DB_NAME, useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true }
        );
    }
    catch (err) {
        done(err)
    }
    dbConnection.on('open', async () => {
        try {
            await dbConnection.dropDatabase();
            console.log("Creating users")
            const userCollection = await dbConnection.db.createCollection('users');
            await userCollection.insertOne(users);
            done()
        }
        catch (err) {
            done(err)
        }
    })
})

describe("tasks tests", () => {

    describe("GET /tasks/all", () => {
        it("should return last 5 days worth of tasks when since parameter is passed", done => {
            chai
                .request(app)
                .get('/task/all?since=1606780800')
                .end((res, err) => {
                    expect(res.status).to.equal(200, "should return 200 status");
                    expect(res.body).length.to.equals(5, "should return 5 entries");
                    expect(res.body).to.eql(resultForSince)
                    if (err) done(err);
                    done();
                })
        })

        it("should return the latest 10 entries when since parameter is not provided", done => {
            chai
                .request(app)
                .get('/task/all')
                .end((res, err) => {
                    expect(res.status).to.equal(200, "should return 200 status");
                    expect(res.body).length.to.equals(10, "should return 10 entries");
                    expect(res.body).to.eql(allTasks)
                    if (err) done(err);
                    done();
                })
        })
    })
})
