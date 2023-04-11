let chai = require("chai");
let chaiHttp = require("chai-http");
let chaiJson = require("chai-json");
const { res } = require("express");
const { response } = require("../index");
let server = require("../index");

//var assert = chai.assert();
var expect = chai.expect; 

chai.use(chaiHttp);
chai.use(chaiJson);
chai.should();

describe("Test default page /", () => {
    
    /**
    * Test default ../
    */
    describe("GET /", ()=> {
        it("It should succeed and display welcome message", function(done) {
        chai.request(server)
            .get('/')
            .end(function(err, res) {
                expect(err).to.be.null;
                expect(res).to.have.status(200);
                res.text.should.be.eq('Hello World with Express and Nodemon');
                done();
            })
        })
    })
})


describe("Test API routes", () => {    
     
// Test default API route ../api/
     // Authentication rquired
    it("It should receive 401 when user not signed in", (done) => {
        chai.request(server)
            .get("/api/")
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res).to.have.status(401);
                res.text.should.be.eq('You need to sign in');
                done();
        })
    })

    //Failed login with invalid account, receive code 400.
    it("It should receive 400 and 'Invalid user' when user account not valid", (done) => {
        chai.request(server)
            .get("/api/")
            .type("form")
            .send({
                'username': 'xxxxxxx',
                'password': '123456789'
            })
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res).to.have.status(400);
                res.text.should.be.eq('Invalid user');
                done();

            })
    })

    //Failed login with wrong password, receive code 401.
    it("It should receive 401 and 'Wrong password' when user key in wrong password", (done) => {
        chai.request(server)
            .get("/api/")
            .type("form")
            .send({
                'username': 'basic',
                'password': '123456'
            })
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res).to.have.status(401);
                res.text.should.be.eq('Wrong password');
                done();

            })
    })

    //Successfully login in with Jsonfile containing API welcome message sent back.
    it("It should receive 200 when user login successfully and display API welcome message", (done) => {
        chai.request(server)
            .get("/api/")
            .type("form")
            .send({
                'username': 'basic',
                'password':  '123456789'
            })
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res).to.have.status(200);
                res.body.should.have.property('status').eql("API Its Working");
                res.body.should.have.property('message').eql("Welcome to RESTHub crafted with love!");
                done();
                
        })
    })

    
//Test all API under ../contacts
    // Test GET ../contacts

        //Successfully queery with Jsonfile containing contact details sent back.
    it("It should receive 200 and a Jsonfile with contact details when the requester has permisison", (done) => {
        chai.request(server)
            .get("/api/contacts")
            .type("form")
            .send({
                'username': 'test',
                'password':  '123456789',
                'role': 'admin'
            })
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res).to.have.status(200);
                expect(res).to.be.json;
                res.body.should.have.property('status').eql("success");
                res.body.should.have.property('message').eql("Contacts retrieved successfully");
                done();
        })
    })

    //Test POST ../contacts

        //Successfully created contact with Jsonfile containing contact details sent back.
    it("It should receive 200 and a Jsonfile with success message and contact details created", (done) => {
        chai.request(server)
            .post("/api/contacts")
            .type("form")
            .send({
                'name': 'Jay3',
                'email': '1358892310020@qq.com',
                'gender': 'Male',
                'phone': '866666366',
                'username': 'admin',
                'password': '123456789'
            })
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res).to.have.status(200);
                expect(res).to.be.json;
                res.body.should.have.property('message').eql("New contact created!");
                res.body.should.have.property('data').have.property('name').eql("Jay3");
                done();
            })
    })

    //Create contact without compulsory fields trigger 400 with Jsonfile containing err message sent back.
    it("It should receive 400 and a Jsonfile with err message", (done) => {
        chai.request(server)
            .post("/api/contacts")
            .type("form")
            .send({
                'name': 'Jay3',
                'gender': 'Male',
                'phone': '866666366',
                'username': 'admin',
                'password': '123456789'
            })
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res).to.have.status(400);
                expect(res).to.be.json;
                res.body.should.have.property('errors').have.property('email').have.property('message').eql("Path `email` is required.");
                done();
            })
    })

//Test all API under ../contacts/:contact_id

    //Test GET ../contacts/:contact_id
    
    it("It should receive 200 and a Jsonfile contain contact loading message and contact details of the targeted id", (done) => {
        chai.request(server)
            .get("/api/contacts/641a6652d8c559e6858c823e")
            .type("form")
            .send({
                "username": "test",
                "password": "123456789",
                "role": "admin",
            })
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res).to.have.status(200);
                expect(res).to.be.json;
                res.body.should.have.property('message').eql("Contact details loading..");
                res.body.should.have.property('data').have.property('name').eql("Jason");
                res.body.should.have.property('data').have.property('gender').eql("Female");
                res.body.should.have.property('data').have.property('email').eql("1359510020@qq.com");
                res.body.should.have.property('data').have.property('phone').eql("84567890");
                done();
            })
    })
    
    //Test PUT ../contacts/:contact_id
    
    it("It should receive 200 and a Jsonfile contain contact updated message and updated contact details of the targeted id", (done) => {
        chai.request(server)
            .put("/api/contacts/64350622f86425358189c5b1")
            .type("form")
            .send({
                "username": "test",
                "password": "123456789",
                "role": "admin",
                "name": "Jay4",
            })
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res).to.have.status(200);
                expect(res).to.be.json;
                res.body.should.have.property('message').eql("Contact Info updated");
                res.body.should.have.property('data').have.property('name').eql("Jay4");
                done();
            })
    })

        //Test DELETE ../contacts/:contact_id
    
        it("It should receive 200 and a Jsonfile contain contact deleted message.", (done) => {
            chai.request(server)
                .delete("/api/contacts/64350622f86425358189c5b1")
                .type("form")
                .send({
                    "username": "test",
                    "password": "123456789",
                    "role": "admin",
                })
                .end((err, res) => {
                    expect(err).to.be.null;
                    expect(res).to.have.status(200);
                    expect(res).to.be.json;
                    res.body.should.have.property('status').eql("success");
                    res.body.should.have.property('message').eql("Contact deleted");
                    done();
                })
        })

})

