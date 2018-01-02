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
import { once } from 'hoek';
const PORT = process.env.PORT || 8000

dotenv.load()
require('../../server/server')

const url = `http://localhost:${PORT}`

describe('Pusher Routes', function() {
    let client,
        email,
        password
    before( async () => {
        email = internet.email(),
        password = internet.password()
        client = new db.Client({
            method: 'local',
            local: {
                email,
                password,
                passwordConf: password,
            }
        })
        await client.save()
    })
    // describe('POST: /api/pusher/chatkit/create_user', async () => {
    //     const spy = spies.spy(console.log('User created successfully'))
    //     let clientID = client._id
    //     it.only('should create a new chatkit user', done => {
    //         request.post(`${url}/api/pusher/chatkit/create_user`)
    //         .send(clientID)
    //         .end((err, res) => {
    //             if (err) return done(err)
    //             expect(spy).to.have.been.called()
    //             done()
    //         })
    //     })
    // })
    describe('POST: /api/pusher/chatkit/authenticate', async () => {
        it('should return chatkit tokens', done => {
            request.post(`${url}/api/pusher/chatkit/authenticate`)
            .send({ ID: client._id })
            .end((err, res) => {
                if (err) return done(err)
                expect(res.status).to.equal(200)
                done()
            })
        })
    })
    describe('POST: /api/pusher/chatkit/user', async () => {
        it('should return a chatkit user', done => {
            request.post(`${url}/api/pusher/chatkit/user`)
            .send({ ID1: client._id })
            .end((err, res) => {
                if (err) return done(err)
                expect(res.status).to.equal(200)
                done()
            })
        })
    })
})