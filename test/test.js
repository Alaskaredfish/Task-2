let chai = require("chai");
let chaiHttp = require("chai-http");
let chaiJson = require("chai-json");
const { res } = require("express");
const { response } = require("../index");
// Initialise bcrypt
let bcrypt = require('bcrypt');
// Import login model
User = require('../userModel');
// Import contact model
Contact = require('../contactModel');
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
                done(err);
            })
        })
    })
})


describe("Test API routes", () => {    

    //Destory and rebuild Mongoose DB for testing.
    before(async() => {
        const hashedPassword = await bcrypt.hash('123456789', 10);
        User.deleteMany({});
        Contact.deleteMany({});
        User.create({username: 'basic', password: hashedPassword, role: 'basic'});
        User.create({username: 'test', password: hashedPassword, role: 'admin'});
        User.create({username: 'admin', password: hashedPassword, role: 'admin'});
        Contact.create({_id: "6419be23318d237f17301782", name: "JiaYao Wu", gender: "Male", email: "1359510020@qq.com", phone: "84999015", creatorID: "basic",});
        Contact.create({_id: "641a6652d8c559e6858c823e", name: "Jason", gender: "Female", email: "1359510020@qq.com", phone: "84567890", creatorID: "admin",});
      })
     
// Test default API route ../api/
     // Authentication rquired
    it("It should receive 401 when user not signed in", function(done) {
        chai.request(server)
            .get("/api/")
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res).to.have.status(401);
                res.text.should.be.eq('You need to sign in');
                done(err);
        })
    })

    //Failed login with invalid account, receive code 400.
    it("It should receive 400 and 'Invalid user' when user account not valid", function(done) {
        chai.request(server)
            .get("/api/")
            .type("form")
            .send({
                'username': 'xxxxxxx',
                'password': '123456789'
            })
            .end((err, res) => {
                if (err) {
                    done(err);
                  } else {
                    expect(err).to.be.null;
                    expect(res).to.have.status(400);
                    res.text.should.be.eq('Invalid user');
                    done();
                }
            })
    })

    //Failed login with wrong password, receive code 401.
    it("It should receive 401 and 'Wrong password' when user key in wrong password", function(done) {
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
                done(err);

            })
    })

    //Successfully login in with Jsonfile containing API welcome message sent back.
    it("It should receive 200 when user login successfully and display API welcome message", function(done) {
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
                done(err);
                
        })
    })

    
//Test all API under ../contacts
    // Test GET ../contacts

        //Successfully queery with Jsonfile containing contact details sent back.
    it("It should receive 200 and a Jsonfile with contact details when the requester has permisison", function(done) {
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
                done(err);
        })
    })

    //Test POST ../contacts

        //Successfully created contact with Jsonfile containing contact details sent back.
    it("It should receive 200 and a Jsonfile with success message and contact details created", function(done) {
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
                done(err);
            })
    })

    //Create contact without compulsory fields trigger 400 with Jsonfile containing err message sent back.
    it("It should receive 400 and a Jsonfile with err message", function(done) {
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
                done(err);
            })
    })

//Test all API under ../contacts/:contact_id

    //Test GET ../contacts/:contact_id
    
    it("It should receive 200 and a Jsonfile contain contact loading message and contact details of the targeted id", function(done) {
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
                done(err);
            })
    })
    
    //Test PUT ../contacts/:contact_id
    
    it("It should receive 200 and a Jsonfile contain contact updated message and updated contact details of the targeted id", function(done) {
        chai.request(server)
            .put("/api/contacts/641a6652d8c559e6858c823e")
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
                done(err);
            })
    })

        //Test DELETE ../contacts/:contact_id
    
        it("It should receive 200 and a Jsonfile contain contact deleted message.", function(done) {
            chai.request(server)
                .delete("/api/contacts/641a6652d8c559e6858c823e")
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
                    done(err);
                })
        })

})

