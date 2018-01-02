'use strict'

const expect = require('chai').expect
const spies = require('chai-spies')
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

describe('Payment Routes', function () {
    describe('GET: /api/stripe/callback', async () => {
        it('Should return a 500 error', done => {
            request.get(`${ url }/api/stripe/callback`)
            .end((err, res) => {
                expect(res.status).to.equal(500)
                done()
            })
        })
    })
    describe('POST: /api/payment/stripe/account_credentials', async () => {
        it('Should return a 400 error', done => {
            request.post(`${ url }/api/payment/stripe/account_credentials`)
            .send({ code: '8j0294j9294-jc2p49j' })
            .end((err, res) => {
                expect(res.status).to.equal(400)
                done()
            })
        })
        it('Should return a 400 error', done => {
            request.post(`${ url }/api/payment/stripe/account_credentials`)
            .send({ trainerID: '8j0294j9294-jc2p49j' })
            .end((err, res) => {
                expect(res.status).to.equal(400)
                done()
            })
        })
        it('Should return a 500 error', done => {
            request.post(`${ url }/api/payment/stripe/account_credentials`)
            .send({ trainerID: '8j0294j9294-jc2p49j', code: '8j0294j9294-jc2p49j' })
            .end((err, res) => {
                expect(res.status).to.equal(500)
                done()
            })
        })
    })
    describe('POST: /api/payment/checkout', async () => {
        let realClient,
            realTrainer
        before( async () => {
            realClient = await db.Client.findOne({})
            realTrainer = await db.Trainer.findOne({})
        })
        it('Should return a 400 error', done => {
            request.post(`${ url }/api/payment/checkout`)
            .send({ clientID: '99h8h0fp9pfj9p-f' })
            .end((err, res) => {
                expect(res.status).to.equal(400)
                done()
            })
        })
        it('Should return a 400 error', done => {
            request.post(`${ url }/api/payment/checkout`)
            .send({ trainerID: '99h8h0fp9pfj9p-f' })
            .end((err, res) => {
                expect(res.status).to.equal(400)
                done()
            })
        })
        it('Should return 500 error', done => {
            request.post(`${ url }/api/payment/checkout`)
            .send({ trainerID: realTrainer._id, clientID: '99h8h0fp9pfj9p-f' })
            .end((err, res) => {
                expect(res.status).to.equal(500)
                done()
            })
        })
        it('Should return a 500 error', done => {
            request.post(`${ url }/api/payment/checkout`)
            .send({ trainerID: '99h8h0fp9pfj9p-f', clientID: realClient._id })
            .end((err, res) => {
                expect(res.status).to.equal(500)
                done()
            })
        })
    })
})
