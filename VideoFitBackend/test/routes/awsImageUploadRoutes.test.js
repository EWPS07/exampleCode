const expect = require('chai').expect
const request = require('superagent')
const fs = require('fs')
import dotenv from 'dotenv'
import db from '../../server/models'
import { should } from 'chai'

dotenv.load()
const PORT = process.env.PORT || 8000
require('../../server/server')

const url = `http://localhost:${ PORT }`

describe('AWS Image Upload Routes', function(done) {
    let tempClient,
        tempTrainer
    before(async () => {
        tempClient = await db.Client.findOne({})
        tempTrainer = await db.Trainer.findOne({})
      })
      
    // POST NEW CLIENT PHOTO
    describe('POST: /photo/upload', async () => {
        // TODO: FIX THESE TESTS
        it.skip('should return the updated client', done => {
            request.post(`${ url }/api/photo/upload`)
            .field('clientID', tempClient._id)
            .attach('files', '../../mountains.jpg')
            .end((err, res) => {
                if (err) return done(err)
                expect(res.status).to.equal(200)
                done()
            })
        })
    })
    // POST NEW TRAINER PHOTO
    describe('POST: /photo/upload', async () => {
        // TODO: FIX THESE TESTS
        it.skip('should return the updated trainer', done => {
            request.post(`${ url }/api/photo/upload`)
            .field('trainerID', tempTrainer._id)
            .attach('files', '../../mountains.jpg')
            .end((err, res) => {
                if (err) return done(err)
                expect(res.status).to.equal(200)
                done()
            })
        })
    })
})