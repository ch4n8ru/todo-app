const app = require("../index");
const chai = require("chai");
const chaiHttp = require("chai-http");
const expect = chai.expect;
chai.use(chaiHttp);

const allTasks = require("./testdata/tasks.json")
const resultForSince = require("./testdata/allwithsince.json")

describe("tasks tests", () => {
    describe("GET /tasks/all", () => {
        it("should return last 10 days worth of tasks when since parameter is passed", done => {
            chai
            .request(app)
            .get('/task/all?since=1606780800')
            .end((res, end) => {
                expect(res.status).to.equal(200, "should return 200 status");
                expect(res.body).length.to.equals(15, "should return 15 entries");
                expect(res.body).to.eql(resultForSince)
                if(err) done(err);
                done();
            })
        })
    })
})