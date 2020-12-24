const app = require("../index");
const chai = require("chai");
const chaiHttp = require("chai-http");
const expect = chai.expect;
chai.use(chaiHttp);

const allTasks = require("./testdata/tasks.json")
const resultForSince = require("./testdata/allwithsince.json")


// 5fe378ad64f0ae2fba24a3bc


describe("tasks tests", () => {
    describe("GET /tasks/all", () => {
        it("should return last 10 days worth of tasks when since parameter is passed", done => {
            chai
            .request(app)
            .get('/task/all?since=1606780800')
            .end((res, err) => {
                expect(res.status).to.equal(200, "should return 200 status");
                expect(res.body).length.to.equals(5, "should return 5 entries");
                expect(res.body).to.eql(resultForSince)
                if(err) done(err);
                done();
            })
        })

        it("should return the latest 10 entries when since parameter is not provided", done => {
            chai
            .request(app)
            .get('/task/all')
            .end((res,err) => {
                expect(res.status).to.equal(200, "should return 200 status");
                expect(res.body).length.to.equals(10, "should return 10 entries");
                expect(res.body).to.eql(allTasks)
                if(err) done(err);
                done();
            })
        })
    })
})