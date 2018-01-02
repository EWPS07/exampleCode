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

describe('RoutineTask Routes', function () {
    let client,
        trainer,
        routine,
        routineTask

    before( async function () {
        client = await db.Client.findOne({})
        trainer = await db.Trainer.findOne({})
        routine = await db.Routine.findOne({})
        routineTask = await db.RoutineTask.findOne({})
    })
    // POST NEW ROUTINE TASK
    describe('POST: /api/routine/task/new', function () {
        it('should return list of routineTasks', done => {
            request.post(`${ url }/api/routine/task/new`)
            .send({ routineID: routine._id, trainerID: trainer._id, section: 'workout', workoutTargetArea: 'Arms', equipmentNeeded: 'Dumbells' })
            .end((err, res) => {
                if (err) return done(err)
                expect(res.status).to.equal(200)
                done()
            })
        })
        it('should return a 400 error', done => {
            request.post(`${ url }/api/routine/task/new`)
            .send({ trainerID: trainer._id, section: 'workout', workoutTargetArea: 'Arms', equipmentNeeded: 'Dumbells' })
            .end((err, res) => {
                expect(res.status).to.equal(400)
                done()
            })
        })
    })
    // UPDATE A ROUTINE TASK
    describe('PUT: /api/routine/task/update', function () {
        it('should return a list of routineTasks, with the newly updated task', done => {
            request.put(`${ url }/api/routine/task/update`)
            .send({ _id: routineTask._id, targetArea: 'Lower Body' })
            .end((err, res) => {
                if (!err) return done(err)
                expect(res.status).to.equal(200)
                done()
            })
        })
        it('should return a 400 error', done => {
            request.put(`${ url }/api/routine/task/update`)
            .send({ targetArea: 'Lower Body' })
            .end((err, res) => {
                expect(res.status).to.equal(400)
                done()
            })
        })
    })
    // DELETE A ROUTINE TASK
    // GET ALL ROUTINE TASKS
})