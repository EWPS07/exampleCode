'use strict'

const expect = require('chai').expect
const request = require('superagent')
import dotenv from 'dotenv'
import db from '../../server/models'
import { should } from 'chai'
const PORT = process.env.PORT || 8000

dotenv.load()
require('../../server/server')

const url = `http://localhost:${PORT}`

describe('Newsfeed Item Routes', function () {
    let newsfeed,
        client,
        trainer,
        trainerId,
        newsfeedId
    before( async () => {
        newsfeed = await db.Newsfeed.findOne({})
        trainer = await db.Trainer.findOne({})
        client = await db.Client.findOne({})
    })
    describe('POST: /api/newsfeed/item', async () => {
        it('Should create a newsfeed item', done => {
            request.post(`${url}/api/newsfeed/item`)
            .send({ newsfeedId: newsfeed._id, clientId: client._id, text: 'Newsfeed Item text' })
            .end((err, res) => {
                if (err) return done(err)
                expect(res.status).to.equal(200)
                expect(res.body).to.be.an('array')
                expect(res.body[res.body.length - 1]).to.haveOwnProperty('text')
                expect(res.body[res.body.length - 1].text).to.be.equal('Newsfeed Item text')
                expect(res.body[res.body.length - 1]).to.haveOwnProperty('isHighFive')
                expect(res.body[res.body.length - 1]).to.haveOwnProperty('isHighFive')
                expect(res.body[res.body.length - 1].isNudged).to.be.equal(false)
                expect(res.body[res.body.length - 1].isHighFive).to.be.equal(false)
                done()
            })
        })
        it('should return a 400 error', done  => {
            request.post(`${ url}/api/newsfeed/item`)
            .send({ newsfeedID: newsfeed._id, clientId: client._id, text: 'Newsfeed Item text' })
            .end((err, res) => {
                expect(res.status).to.equal(400)
                done()
            })
        })
        it('Should return a 500 error', done => {
            request.post(`${url}/api/newsfeed/item`)
            .send({ newsfeedId: 'nottheid', clientId: client._id, text: 'Newsfeed Item text' })
            .end((err, res) => {
                expect(res.status).to.be.equal(500)
                done()
            })
        })
        it('Should return a 500 error', done => {
            request.post(`${url}/api/newsfeed/item`)
            .send({ newsfeedId: newsfeed._id, clientId: 'notheclientid', text: 'Newsfeed Item text' })
            .end((err, res) => {
                expect(res.status).to.be.equal(500)
                done()
            })
        })
    })
})