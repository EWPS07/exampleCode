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

describe('Routine Routes', function () {
    let client,
        trainer

    before( async function () {
        client = await db.Client.findOne({})
        trainer = await db.Trainer.findOne({})
    })
    // POST NEW ROUTINE TASK
    describe('POST: /api/routine/new', async () => {
        it('should return a routine', done => {
            request.post(`${ url }/api/routine/new`)
            .send({ clientID: client._id, trainerID: trainer._id, dayOfWeek: 'Mon' })
            .end((err, res) => {
                if (err) return done(err)
                expect(res.status).to.equal(200)
                expect(res.body).to.haveOwnProperty('routine')
                expect(res.body.routine).to.haveOwnProperty('dayOfWeek')
                expect(res.body.routine).to.haveOwnProperty('isRestDay')
                done()
            })
        })
        it('should return a 400 error', done => {
            request.post(`${ url }/api/routine/new`)
            .send({ clientId: client._id, trainerID: trainer._id, dayOfWeek: 'Mon' })
            .end((err, res) => {
                expect(res.status).to.equal(400)
                done()
            })
        })
    })
    describe('POST: /api/routines/week/view', async () => {
        let client
        before( async () => {
            client = await db.Client.findOne({})
        })
        it('should return an organize list of routines, separated by days to be done', done => {
            request.post(`${ url }/api/routines/week/view`)
            .send({ clientID: client._id })
            .end((err, res) => {
                if (err) return done(err)
                expect(res.status).to.equal(200)
                expect(res.body).to.be.an('object')
                expect(res.body).to.haveOwnProperty('Monday')
                expect(res.body).to.haveOwnProperty('Tuesday')
                expect(res.body).to.haveOwnProperty('Wednesday')
                expect(res.body).to.haveOwnProperty('Thursday')
                expect(res.body).to.haveOwnProperty('Friday')
                expect(res.body).to.haveOwnProperty('Saturday')
                expect(res.body).to.haveOwnProperty('Sunday')
                expect(res.body).to.haveOwnProperty('MonWedFri')
                expect(res.body).to.haveOwnProperty('TuesThurs')
                expect(res.body).to.haveOwnProperty('Weekend')
                expect(res.body).to.haveOwnProperty('Week')
                done()
            })
        })
        it('should return a 400 error', done => {
            request.post(`${ url }/api/routines/week/view`)
            .send({ clientId: client._id })
            .end((err, res) => {
                expect(res.status).to.equal(400)
                done()
            })
        })
    })
})