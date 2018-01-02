'use strict'

const expect = require('chai').expect
const request = require('superagent')
import db from '../../server/models'
import dotenv from 'dotenv'
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

const url = `http://localhost:${PORT}`;
const email = internet.email()
const examplePassword = internet.password()
const TestTrainer = {
	email,
	firstName: name.firstName(),
	lastName: name.lastName(),
	password: examplePassword,
	passwordConf: examplePassword,
	gender: 'm',
	DOB: date.past(),
	zip: address.zipCode(),
	phoneNumber: phone.phoneNumber(),
    photo: internet.domainName(),
    trainingSince: date.past(),
}

describe('Trainer Routes', function() {
    // GET ALL TRAINERS
    describe('GET: /api/trainers/all', function() {
        it('should return a list of trainers', done => {
            request.get(`${url}/api/trainers/all`)
            .end((err, res) => {
                if (err) return done(err)
                expect(res.status).to.equal(200)
                done()
            })
        })
    })
    // TRAINER SIGNUP
    describe('POST: /api/trainer/signup', function () {
        before( async done => {
            await db.Trainer.deleteOne({ 'local.email': email })
            .then(done())
        })
        after( async done => {
            await db.Trainer.deleteOne({ 'local.email': email })
            .then(done())
        })
        it('should return a new trainer', done => {
            request.post(`${url}/api/trainer/signup`)
            .send(TestTrainer)
            .end((err, res) => {
                if (err) return done(err)
                expect(res.status).to.equal(200)
                expect(res.body).to.be.an('object')
                expect(res.body.token).to.be.a('string')
                expect(res.body.trainer).to.haveOwnProperty('local')
                expect(res.body.trainer.local).to.haveOwnProperty('email')
                expect(res.body.trainer.local).to.haveOwnProperty('password')
                expect(res.body.trainer.local).to.haveOwnProperty('passwordConf')
                done()
            })
        })
        it('should return a 400 error', done => {
            request.post(`${ url }/api/trainer/signup`)
            .send({ email: internet.email(), password: internet.password() })
            .end((err, res) => {
                expect(res.status).to.equal(400)
                done()
            })
        })
    })
    // TRAINER SIGNIN
    describe('POST: /api/trainer/signin', function () {
        let tempTrainer
        before( done => {
            tempTrainer = new db.Trainer({
                method: 'local',
                local: {
                    email: TestTrainer.email,
                    password: TestTrainer.password,
                    passwordConf: TestTrainer.passwordConf,
                }
            })
            tempTrainer.save()
            done()
        })
        after( async done => {
            await db.Trainer.deleteOne({ 'local.email':email })
            .then(done())
        })
        it('should signin and return an existing trainer', done => {
            request.post(`${url}/api/trainer/signin`)
            .send({ email: tempTrainer.local.email, password: tempTrainer.local.password})
            .end((err, res) => {
                if (err) return done(err)
                expect(res.status).to.equal(200)
                expect(res.body).to.haveOwnProperty('trainer')
                expect(res.body.trainer).to.haveOwnProperty('local')
                expect(res.body.trainer.local).to.haveOwnProperty('email')
                expect(res.body.trainer.local).to.haveOwnProperty('password')
                expect(res.body.trainer.local).to.haveOwnProperty('passwordConf')
                done()
            })
        })
        it('should return a 400 error', done => {
            request.post(`${ url }/api/trainer/signin`)
            .send({ email:tempTrainer.email })
            .end((err, res) => {
                expect(res.status).to.equal(400)
                done()
            })
        })
        it('should return Unauthorized', done => {
            request.post(`${ url }/api/trainer/signin`)
            .send({ email: tempTrainer.local.email, password: 'notthetrainerspassword' })
            .end((err, res) => {
                expect(res.status).to.equal(401)
                expect(res.text).to.equal('Unauthorized')
                done()
            })
        })
    })
    describe('PUT: /api/trainer/update', async () => {
        let trainerToUpdate,
            newTrainerInfo
        before( async () => {
            trainerToUpdate = await db.Trainer.findOne({})
        })
        it('should update a trainer', done => {
            newTrainerInfo = { _id: trainerToUpdate._id, zip: '67890' }
            request.put(`${ url }/api/trainer/update`)
            .send(newTrainerInfo)
            .end((err, res) => {
                if (err) return done(err)
                expect(res.status).to.equal(200)
                expect(res.body).to.haveOwnProperty('updatedTrainer')
                expect(res.body.updatedTrainer).to.haveOwnProperty('zip')
                expect(res.body.updatedTrainer.zip).to.be.equal('67890')
                done()
            })
        })
    })
    // UPDATE TRAINER PASSWORD
    describe('PUT: /api/trainer/update/password', async () => {
        let trainer
        before( async () => {
            trainer = await db.Trainer.findOne({})
        })
        it('should change a trainers password', done => {
            request.put(`${ url }/api/trainer/update/password`)
            .send({ _id: trainer._id, password: 'someNewPassword123', passwordConf: 'someNewPassword123' })
            .end((err, res) => {
                if (err) return done(err)
                expect(res.status).to.equal(200)
                expect(res.body).to.haveOwnProperty('status')
                expect(res.body.status).to.equal('success')
                done()
            })
        })
        it('should return a 400 error', done => {
            request.put(`${ url }/api/trainer/update/password`)
            .send({ _id: trainer._id, password: 'someNewPassword123', passwordConf: 'someNewPassword567' })
            .end((err, res) => {
                expect(res.status).to.equal(400)
                done()
            })
        })
        it('should return a 400 error', done => {
            request.put(`${ url }/api/trainer/update/password`)
            .send({ id: trainer._id, password: 'someNewPassword123', passwordConf: 'someNewPassword123' })
            .end((err, res) => {
                expect(res.status).to.equal(400)
                done()
            })
        })
    })
})
