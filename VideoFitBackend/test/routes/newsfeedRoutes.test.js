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

describe('Newsfeed Routes', function () {
    let trainer,
        trainerId,
        newsfeed,
        newsfeedId
    before( async () => {
        trainer = await db.Trainer.findOne({})
        newsfeed = await db.Newsfeed.findOne({})
    })
    describe('POST: /api/newsfeed', async () => {
        trainerId = trainer._id
        it('Should create a newsfeed instance', done => {
            request.post(`${url}/api/newsfeed`)
            .send(trainerId)
            .end((err, res) => {
                if (err) return done(err)
                expect(res.status).to.equal(200)
                done()
            })
        })
    })
    describe('POST: /api/newsfeed/feed', async () => {
        newsfeedId = newsfeed._id
        it('Should return the newsfeed items', done => {
            request.post(`${url}/api/newsfeed/feed`)
            .send(newsfeedId)
            .end((err, res) => {
                if (err) return done(err)
                expect(res.status).to.equal(200)
                done()
            })
        })
    })
})