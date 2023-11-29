const { expect } = require('chai');
const chai = require('chai');
const { describe, it } = require('mocha');
const chaiHttp = require('chai-http');

const { utils } = require('./testUtils');

// base url and test object
const { baseUrl, course } = utils;

// set chaiHttp plugin
chai.use(chaiHttp);

describe('Course model', function () {
    it('adds a course to the database', function (done) {
        this.timeout(30000);

        return chai.request(baseUrl)
            .post('/courses')
            .set('Content-Type', 'application/json')
            .send({ ...course })
            .end((error, res) => {
                expect(res).to.have.status(201);
                const respJson = JSON.parse(res.text);
                const { id, name, price, message } = respJson;

                expect(respJson).to.haveOwnProperty('message');
                expect(message).to.be.equals('success');
                expect(id).to.be.a('number');
                expect(name).to.be.equals(course.name);
                expect(price).to.be.equals(course.price);

                // save id property
                course['id'] = id;

                done();
            });

    });

    it('gets a course by id', function (done) {

        chai.request(baseUrl)
            .get(`/courses/${course.id}`)
            .end((error, res) => {
                expect(res).to.have.status(200);
                const respJson = JSON.parse(res.text);

                // get status and data from response
                const { price, name, description, message, id } = respJson;

                expect(message).to.be.equals('success');
                expect(id).to.equals(course.id);
                expect(name).to.be.equals(course.name);
                expect(price).to.be.equals(course.price);
                expect(description).to.equals(course.description);

                done();
            });
    });

    it('update a course by id', function (done) {

        chai.request(baseUrl)
            .put(`/courses/${course.id}`)
            .set('Content-Type', 'application/json')
            .send({ name: 'Cybersecurity For All Levels' })
            .end((error, res) => {
                expect(res).to.have.status(200);
                const respJson = JSON.parse(res.text);

                // get status and data from response
                const { name, message } = respJson;

                expect(message).to.be.equals('success');
                expect(name).to.be.equals('Cybersecurity For All Levels');

                done();
            });
    });

    it('tests that post requests fail as expected', function (done) {

        // send without data in json
        chai.request(baseUrl)
            .post('/courses')
            .set('Content-Type', 'application/json')
            .send({})
            .end((error, res) => {
                expect(res).to.have.status(400);
                done();
            });
    });

    it('tests unknown id request fail as expected', function (done) {
        chai.request(baseUrl)
            .get('/courses/23')
            .end((error, res) => {
                expect(res).to.have.status(404);
                const respJson = JSON.parse(res.text)
                expect(respJson).to.deep.equal({ error: 'Not found' });
                done();
            })
    });

    it('tests invalid id request fail as expected', function (done) {
        // get course with invalid id
        chai.request(baseUrl)
            .get('/courses/notanumber')
            .end((error, res) => {
                expect(res).to.have.status(400);
                const respJson = JSON.parse(res.text)
                expect(respJson).to.deep.equal({ error: 'Invalid id' });
                done();
            });
    });

    it('get all courses array', function (done) {
        chai.request(baseUrl)
            .get('/courses')
            .end((error, res) => {
                expect(res).to.have.status(200);
                const respJson = JSON.parse(res.text)
                expect(respJson.courses).to.be.an('Array');
                expect(respJson.current).to.be.a('number');
                expect(respJson.next).to.satisfy((value) => {
                    return typeof value === 'number' || value === null;
                });
                done();
            });
    });

    it('tests successful deletion by id', function (done) {
        chai.request(baseUrl)
            .delete(`/courses/${course.id}`)
            .end((error, res) => {
                expect(res).to.have.status(204);
                const respJson = JSON.parse(JSON.stringify(res.text));
                expect(respJson).to.deep.equal('');
                done();
            });
    });
});