'use strict'

const expect = require('chai').expect
const request = require('superagent')
import db from '../../server/models'
import dotenv from 'dotenv'
const PORT = process.env.PORT || 8000
const url = `http://localhost:${PORT}`

dotenv.load()
require('../../server/server')

describe('Trainer Media Routes', function () {
    let trainer,
        trainerID
    before( async () => {
        trainer = await db.Trainer.findOne({})
        .then(trainer => { trainerID = trainer._id })
    })
    describe('POST: /api/trainer/media/all', async () => {
        it('Should return an organized media-library object', done => {
            request.post(`${url}/api/trainer/media/all`)
            .send({ trainerID })
            .end((err, res) => {
                if (err) return done(err)
                expect(res.status).to.equal(200)
                done()
            })
        })
        it('Should return a 400 error', done => {
            request.post(`${url}/api/trainer/media/all`)
            .send({})
            .end((err, res) => {
                expect(res.status).to.equal(400)
                done()
            })
        })
        it('Should return a 500 error', done => {
            request.post(`${url}/api/trainer/media/all`)
            .send({ trainerID: 'notanid' })
            .end((err, res) => {
                expect(res.status).to.equal(500)
                done()
            })
        })
    })
})