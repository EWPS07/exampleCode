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
    lorem,
    name,
    phone,
    random,
} from 'faker'
const PORT = process.env.PORT || 8000

dotenv.load()
require('../../server/server')

const url = `http://localhost:${PORT}`;
const email1 = internet.email()
const email2 = internet.email()
const examplePassword = internet.password()
const TestTrainer = {
	email: email1,
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
const TestClient = {
	email: email2,
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
const Task = {
    icon: lorem.word(),
    name: lorem.sentence(),
    desc: lorem.paragraph(),
    dayOfWeek: 'Mon',
}
describe('Tasks Routes', function() {
    let task,
        taskToUpdate
    const taskBadRequest = { ...Task }
    before(async () => {
        const tempClient = await db.Client.findOne({})
        const tempTrainer = await db.Trainer.findOne({})
        taskToUpdate = await db.Task.findOne({})
        task = { ...Task, _clientId: tempClient._id, _creator: tempTrainer._id }
      })
      
    // GET ALL TASKS
    describe('GET: /api/tasks/all', async () => {
        it('should return a list of tasks', done => {
            request.get(`${url}/api/tasks/all`)
            .end((err, res) => {
                if (err) return done(err)
                expect(res.status).to.equal(200)
                expect(res.body).to.be.an('array')
                done()
            })
        })
    })
    // POST A NEW TASK
    describe('POST: /api/task/new', async () => {
        it('should return a new task', done => {
            request.post(`${ url }/api/task/new`)
            .send(task)
            .end((err, res) => {
                if (err) {
                    return done(err)
                }
                expect(res.status).to.equal(200)
                done()
            })
        })
        it('should return a 400 error', done => {
            request.post(`${ url }/api/task/new`)
            .send(Task)
            .end((err, res) => {
                expect(res.status).to.equal(400)
                done()
            })
        })
    })
    // UPDATE TASK
    describe('PUT: /api/task/update', async () => {
        it('should update a task', done => {
            request.put(`${ url }/api/task/update`)
            .send(taskToUpdate)
            .end((err, res) => {
                if (err) return done(err)
                expect(res.status).to.equal(200)
                done()
            })
        })
        it('should return a 400 error', done => {
            request.put(`${ url }/api/task/update`)
            .send(taskBadRequest)
            .end((err, res) => {
                expect(res.status).to.equal(400)
                done()
            })
        })
    })
})

