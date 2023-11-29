const axios = require('axios');

const { expect } = require('chai');
const chai = require('chai');
const { describe, it } = require('mocha');
const chaiHttp = require('chai-http');

const { utils } = require('./testUtils');

// base url and test object
const { baseUrl, contact } = utils;

// set chaiHttp plugin
chai.use(chaiHttp);

describe('Contact model', function () {
    it('adds a contact to the database', function (done) {
        chai.request(baseUrl)
            .post('/contacts')
            .set('Content-Type', 'application/json')
            .send({ ...contact })
            .end((error, res) => {
                expect(res).to.have.status(201);
                const respJson = JSON.parse(res.text)
                expect(respJson).to.have.property('message');
                expect(respJson).to.have.property('email');
                expect(respJson).to.have.property('lastName');
                expect(respJson).to.have.property('firstName');
                expect(respJson).to.have.property('description');
                done();
            });
    });

    it('gets a contact by email and id', async function () {
        this.timeout(30000);
        const resp = await axios.get(`${baseUrl}/contacts/emails/${contact.email}`);
        // get status and data from response
        const { status, data } = resp;

        const resp2 = await axios.get(`${baseUrl}/contacts/${data.id}`);

        expect(status).to.be.equals(200);
        expect(resp2.status).to.be.equals(200);

        expect(data.id).to.be.a('number');
        expect(resp2.data.id).to.be.a('number');

        expect(data.email).to.be.equals(contact.email);
        expect(resp2.data.email).to.be.equals(data.email);

        expect(data.id).to.be.equals(resp2.data.id);
    });

    it('tests that post requests fail as expected', function (done) {

        // send without email in json
        const { email, ...rest } = contact;

        chai.request(baseUrl)
            .post('/contacts')
            .set('Content-Type', 'application/json')
            .send({ ...rest })
            .end((error, res) => {
                expect(res).to.have.status(400);
                const respJson = JSON.parse(res.text)
                expect(respJson).to.deep.equal({ error: 'Missing email' });
                done();
            });
    });

    it('tests unknown email request fail as expected', function (done) {
        chai.request(baseUrl)
            .get('/contacts/emails/unknown@email.com')
            .end((error, res) => {
                expect(res).to.have.status(404);
                const respJson = JSON.parse(res.text)
                expect(respJson).to.deep.equal({ error: 'Not found' });
                done();
            })
    });

    it('tests invalid id request fail as expected', function (done) {
        // get subscriber with invalid id
        chai.request(baseUrl)
            .get('/contacts/4ty5')
            .end((error, res) => {
                expect(res).to.have.status(400);
                const respJson = JSON.parse(res.text)
                expect(respJson).to.deep.equal({ error: 'Invalid id' });
                done();
            });
    });

    it('get all contacts array', function (done) {
        chai.request(baseUrl)
            .get('/contacts')
            .end((error, res) => {
                expect(res).to.have.status(200);
                const respJson = JSON.parse(res.text)
                expect(respJson.contacts).to.be.an('Array');
                expect(respJson.current).to.be.a('number');
                expect(respJson.next).to.satisfy((value) => {
                    return typeof value === 'number' || value === null;
                });
                done();
            });
    });

    it('returns an appropriate response for first deletion: 204', function (done) {
        chai.request(baseUrl)
            .delete(`/contacts/emails/${contact.email}`)
            .end((error, res) => {
                expect(res).to.have.status(204);
                const respJson = JSON.parse(JSON.stringify(res.text));
                expect(respJson).to.equal('');
                done();
            });
    });

    it('tests idempotent response for second deletion: 404', function (done) {
        chai.request(baseUrl)
            .delete(`/contacts/emails/${contact.email}`)
            .end((error, res) => {
                expect(res).to.have.status(404);
                const respJson = JSON.parse(res.text)
                expect(respJson).not.to.have.property('message');
                expect(respJson).not.to.have.property('email');
                expect(respJson).to.deep.equal({});
                done();
            });
    });
});