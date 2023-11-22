const { expect } = require('chai');
const chai = require('chai');
const { describe, it } = require('mocha');
const chaiHttp = require('chai-http');
const axios = require('axios')

const {utils} = require('./testUtils');

// base url and test object
const { baseUrl, subs, jsonHeader } = utils;

// set chaiHttp plugin
chai.use(chaiHttp);

describe('Subscriber model', function () {
    it('adds a subscriber to the database', async function () {
        this.timeout(30000);
        const { data } = await axios.post(`${baseUrl}/subscribers`, {
            email: subs.email
        },
            jsonHeader
        );
        const { id, email } = data;
        expect(id).to.be.a('number');
        expect(email).to.be.equals(subs.email);
    });

    it('gets a subscriber by email and id', async function () {
        this.timeout(30000);
        const resp = await axios.get(`${baseUrl}/subscribers/emails/${subs.email}`);
        // get status and data from response
        const {status, data} = resp; 

        const resp2 = await axios.get(`${baseUrl}/subscribers/${data.id}`);

        expect(status).to.be.equals(200);
        expect(resp2.status).to.be.equals(200);

        expect(data.id).to.be.a('number');
        expect(resp2.data.id).to.be.a('number');

        expect(data.email).to.be.equals(subs.email);
        expect(resp2.data.email).to.be.equals(data.email);

        expect(data.id).to.be.equals(resp2.data.id);
    });

    it('tests that post requests fail as expected', function (done) {
        this.timeout(30000);
        
        // send without email in json
        chai.request(baseUrl)
        .post('/subscribers')
        .set('Content-Type', 'application/json')
        .send({})
        .end((error, res) => {
            expect(res).to.have.status(400);
            respJson = JSON.parse(res.text)
            expect(respJson).to.deep.equal({error: 'Missing email'});
            done();
        });
    });

    it('tests unknown email request fail as expected', function (done) {
        chai.request(baseUrl)
        .get('/subscribers/emails/unknown@email.com')
        .end((error, res) => {
            expect(res).to.have.status(404);
            respJson = JSON.parse(res.text)
            expect(respJson).to.deep.equal({error: 'Not found'});
            done();
        })
    });

    it('tests invalid id request fail as expected', function (done) {
        // get subscriber with invalid id
        chai.request(baseUrl)
        .get('/subscribers/notanumber')
        .end((error, res) => {
            expect(res).to.have.status(400);
            respJson = JSON.parse(res.text)
            expect(respJson).to.deep.equal({error: 'Invalid id'});
            done();
        });
    });

    it('get all subscribers array', function (done) {
        // get subscriber with invalid id
        chai.request(baseUrl)
        .get('/subscribers')
        .end((error, res) => {
            expect(res).to.have.status(200);
            respJson = JSON.parse(res.text)
            expect(respJson.data).to.be.an('Array');
            expect(respJson.current).to.be.a('number');
            expect(respJson.next).to.satisfy((value) => {
                return typeof value === 'number' || value === null;
            });
            done();
        });
    });

    it('tests successful deletion by email', function (done) {
        // get subscriber with invalid id
        chai.request(baseUrl)
        .delete(`/subscribers/emails/${subs.email}`)
        .end((error, res) => {
            expect(res).to.have.status(200);
            respJson = JSON.parse(res.text)
            expect(respJson).to.deep.equal({message: 'success', email: subs.email});
            done();
        });
    });
});