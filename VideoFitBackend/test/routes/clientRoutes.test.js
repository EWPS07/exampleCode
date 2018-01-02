'use strict'

const expect = require('chai').expect
const request = require('superagent')
import dotenv from 'dotenv'
import db from '../../server/models'
import { should } from 'chai'
import {
    address,
    date,
    image,
    internet,
    name,
    phone,
    random,
} from 'faker'
const PORT = process.env.PORT || 8000

dotenv.load()
require('../../server/server')

const url = `http://localhost:${PORT}`
const email = internet.email()
const examplePassword = internet.password()
const TestClient = {
	email,
	firstName: name.firstName(),
	lastName: name.lastName(),
    password: examplePassword,
	passwordConf: examplePassword,
	gender: 'm',
	height: random.number().toString(),
	weight: random.number().toString(),
	DOB: date.past(),
	zip: address.zipCode(),
	phoneNumber: phone.phoneNumber(),
	photo: internet.domainName(),
}
describe('Client Routes', async done => {
    // GET ALL CLIENTS
    describe('GET: /api/clients/all', function() {
        it('should return a list of clients', done => {
            request.get(`${url}/api/clients/all`)
            .end((err, res) => {
                if (err) return done(err)
                expect(res.status).to.equal(200)
                expect(res.body).to.be.an('array')
                done()
            })
        })
    })
    // CLIENT SIGNUP
    describe('POST: /api/client/signup', async () => {
        before( async () => {
            await db.Client.deleteOne({ 'local.email': email })
        })
        after( async () => {
            await db.Client.deleteOne({ 'local.email': email })
        })
        it('should return a new client', done => {
            request.post(`${url}/api/client/signup`)
            .send(TestClient)
            .end((err, res) => {
                if (err) return done(err)
                expect(res.status).to.equal(200)
                expect(res.body).to.be.an('object')
                expect(res.body.token).to.be.a('string')
                expect(res.body.client).to.haveOwnProperty('local')
                expect(res.body.client.local).to.haveOwnProperty('email')
                expect(res.body.client.local).to.haveOwnProperty('password')
                expect(res.body.client.local).to.haveOwnProperty('passwordConf')
                done()
            })
        })
        it('should return a 400 error', done => {
            request.post(`${ url }/api/client/signup`)
            .send({ email: internet.email(), password: internet.password() })
            .end((err, res) => {
                expect(res.status).to.equal(400)
                done()
            })
        })
    })
    // CLIENT SIGNIN
    describe('POST: /api/client/signin', async () => {
        let tempClient
        before( done => {
            tempClient = new db.Client({
                method: 'local',
                local: {
                    email: TestClient.email,
                    password: TestClient.password,
                    passwordConf: TestClient.passwordConf,
                }
            })
            tempClient.save()
            done()
        })
        after( async done => {
            await db.Client.deleteOne({ 'local.email':email })
            .then(done())
        })
        it('should signin and return an existing client', done => {
            request.post(`${url}/api/client/signin`)
            .send({ email: tempClient.local.email, password: tempClient.local.password})
            .end((err, res) => {
                if (err) return done(err)
                expect(res.status).to.equal(200)
                expect(res.body).to.be.an('object')
                expect(res.body.client).to.haveOwnProperty('local')
                expect(res.body.client.local).to.haveOwnProperty('email')
                expect(res.body.client.local).to.haveOwnProperty('password')
                expect(res.body.client.local).to.haveOwnProperty('passwordConf')
                done()
            })
        })
        it('should return a 400 error', done => {
            request.post(`${ url }/api/client/signin`)
            .send({ email: tempClient.email })
            .end((err, res) => {
                expect(res.status).to.equal(400)
                done()
            })
        })
        it('should return Unauthorized', done => {
            request.post(`${ url }/api/client/signin`)
            .send({ email: tempClient.local.email, password: 'nottheclientspassword' })
            .end((err, res) => {
                expect(res.status).to.equal(401)
                expect(res.text).to.equal('Unauthorized')
                done()
            })
        })
    })
    // UPDATE CLIENT
    describe('PUT: /api/client/update', async () => {
        let clientToUpdate,
            newClientInfo
        before( async () => {
            clientToUpdate = await db.Client.findOne({})
        })
        it('should update a client', done => {
            newClientInfo = { _id: clientToUpdate._id, height: '100in' }
            request.put(`${ url }/api/client/update`)
            .send(newClientInfo)
            .end((err, res) => {
                if (err) return done(err)
                expect(res.status).to.equal(200)
                expect(res.body).to.haveOwnProperty('updatedClient')
                expect(res.body.updatedClient.height).to.be.equal('100in')
                done()
            })
        })
    })
    // UPDATE CLIENT PASSWORD
    describe('PUT: /api/client/update/password', async () => {
        let client
        before( async () => {
            client = await db.Client.findOne({})
        })
        it('should change a clients password', done => {
            request.put(`${ url }/api/client/update/password`)
            .send({ _id: client._id, password: 'someNewPassword123', passwordConf: 'someNewPassword123' })
            .end((err, res) => {
                if (err) return done(err)
                expect(res.status).to.equal(200)
                expect(res.body).to.haveOwnProperty('status')
                expect(res.body.status).to.be.equal('success')
                done()
            })
        })
        it('should return a 400 error', done => {
            request.put(`${ url }/api/client/update/password`)
            .send({ _id: client._id, password: 'someNewPassword123', passwordConf: 'someNewPassword567' })
            .end((err, res) => {
                expect(res.status).to.equal(400)
                done()
            })
        })
        it('should return a 400 error', done => {
            request.put(`${ url }/api/client/update/password`)
            .send({ id: client._id, password: 'someNewPassword123', passwordConf: 'someNewPassword123' })
            .end((err, res) => {
                expect(res.status).to.equal(400)
                done()
            })
        })
    })
})