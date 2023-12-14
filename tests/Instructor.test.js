//const axios = require("axios");

const { expect } = require("chai");
const chai = require("chai");
const { describe, it } = require("mocha");
const chaiHttp = require("chai-http");

const { utils } = require("./testUtils");

//base url and instructor info
const { baseUrl, instructor } = utils;

//set chaiHttp plugin
chai.use(chaiHttp);

describe("Instructor model", function () {
  it("adds an instructor to the database", function (done) {
    chai
      .request(baseUrl)
      .post("/instructors")
      .set("Content-Type", "application/json")
      .send(instructor)
      .end((error, res) => {
        expect(res).to.have.status(201);
        const respJson = JSON.parse(res.text);
        const { id, name, phone, email, message } = respJson;
        expect(id).to.be.a("number");
        expect(message).to.be.equals("success");
        expect(name).to.be.equals("Jimmy");
        expect(email).to.be.equals("jimmy@gmail.com");
        expect(phone).to.be.equals("08125356598");
        instructor.id = id;
      });
    done();
  });

  it("gets an instructor by the email", function (done) {
    // const instructorEmail = "jimmy@gmail.com";

    chai
      .request(baseUrl)
      .get(`/instructors/emails/${instructor.email}`)
      .end((error, res) => {
        console.log(res);
        expect(res.status).to.equal(200);
        expect(res.body).to.have.property("name");
      });
    done();
  });

  it("gets an instructor by the id", function (done) {
    //const instructorId = 1;
    chai
      .request(baseUrl)
      .get(`/instructors/${instructor.id}`)
      .end((error, res) => {
        expect(res).have.status(200);
        const respJson = JSON.parse(res.text);
        const { phone, name, email, message, id } = respJson;
        expect(message).to.be.equals("success");
        expect(id).to.equals(instructor.id);
        expect(name).to.be.equals(instructor.name);
        expect(phone).to.be.equals(instructor.phone);
        expect(email).to.equals(instructor.email);
      });
    done();
  });

  it("tests that post requests fail as expected", function () {
    chai
      .request(baseUrl)
      .post("/instructors")
      .set("Content-Type", "application/json")
      .send({ email: "jimmy@gmail.com", phone: "09548789652" })
      .end((error, res) => {
        expect(res).to.have.status(400);
        const respJson = JSON.parse(res.text);
        expect(respJson).to.deep.equal({ error: "Missing name" });
      });
  });

  it("tests unknown email request fails as expected", function () {
    chai
      .request(baseUrl)
      .get(`'/instructors/emails/unknown@email.com`)
      .end((error, res) => {
        expect(res).to.have.status(404);
      });
  });

  it("tests invalid id request fails as expected", function () {
    //get instructor with an invalid id
    chai
      .request(baseUrl)
      .get("/instructors/xlr8")
      .end((error, res) => {
        expect(res).to.have.status(400);
        const respJson = JSON.parse(res.text);
        expect(respJson).to.deep.equal({ error: "Invalid instructor id" });
      });
  });

  it("gets all instructors array", function () {
    chai
      .request(baseUrl)
      .get("/instructors")
      .end((error, res) => {
        expect(res).to.have.status(200);
        const respJson = JSON.parse(res.text);
        expect(respJson.data).to.be.an("Array");
        expect(respJson.current).to.be.a("number");
        expect(respJson.next).to.satisfy((value) => {
          return typeof value === "number" || value === null;
        });
      });
  });

  it("tests successful deletion by id", function () {
    // const instructorId = 1;
    chai
      .request(baseUrl)
      .delete(`/instructors/${instructor.email}`)
      .end((error, res) => {
        expect(res).to.have.status(204);
        const respJson = JSON.parse(JSON.stringify(res.text));
        expect(respJson).to.deep.equal("");
      });
  });

  it("updates an instructor by id", function () {
    //const instructorId = 1;

    chai
      .request(baseUrl)
      .put(`/instructors/${instructor.email}`)
      .set("Content-Type", "application/json")
      .send({ name: "John Doe" })
      .end((error, res) => {
        expect(res).to.have.a.status(200);
        const respJson = JSON.parse(res.text);

        //get data from response
        const { name, message } = respJson;

        expect(message).to.be.equals("success");
        expect(name).to.be.equals("John Doe");
      });
  });
});
