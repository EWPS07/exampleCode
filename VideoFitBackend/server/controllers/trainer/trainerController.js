import db from './../../models/index'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import { JWT_SECRET } from '../auth/JWT'
const debug = require('debug')('videoFit:trainerController');
const trainerController = {}

const signToken = trainer => {
    return jwt.sign({
        iss: 'videoFit',
        sub: trainer._id,
        lat: new Date().getTime(),
        exp: new Date().setDate(new Date().getDate() + 1) // plus one day in the future
    }, JWT_SECRET)
}
// CREATES A NEW TRAINER
module.exports = {
    postTrainerSignup: async (req, res, next) => {
        debug('trainerController.postTrainerSignup() was called!')

        const {
            DOB,
            email,
            password,
            firstName,
            lastName,
            passwordConf,
            photo,
            photos,
            profilePicture,
            currentProfilePicture,
            phoneNumber,
            gender,
            trainingSince,
            zip,
            address,
        } = req.value.body
        
        if (!email || !password || !passwordConf) return res.status(400).json({ error: 'Must provide email, password, and passwordConf' })
        const foundTrainer = await db.Trainer.findOne({ 'local.email': email })

        if (foundTrainer) res.status(403).json({ error: 'This email is already in use'})
        const newTrainer = new db.Trainer({
            method: 'local',
            local: {
                email: email,
                password: password,
                passwordConf: passwordConf,
            },
            DOB,
            email,
            firstName,
            lastName,
            photo,
            phoneNumber,
            gender,
            trainingSince,
            zip,
            address,
        })
        const trainer = await newTrainer.save()
        const token = signToken(trainer)
        res.status(200).json({ token, trainer })
    },
    // SIGNS IN A TRAINER
    postTrainerSignin: async (req, res, next) => {
        const { email, password } = req.value.body
        if (!email || !password) return res.status(400).json({ error: 'Bad request, must provide email and passord' })
        const trainer = await db.Trainer.findOne({ 'local.email': email })
        if (!trainer) return res.status(404).json({ error: 'Trainer was not found'})
        const token = await signToken(trainer)
        if (!token) return res.status(401).json({ error: 'Unauthorized' })
        return res.status(200).json({ token, trainer })
    },
    // GOOGLE SIGNIN OR CREATE ACCOUNT
    googleOAuth: async (req, res, next) => {
        const { access_token, googleID } = req.body
        if (!access_token) return res.status(400).json({ error: 'No trainer access_token provided' })
        const token = await signToken(access_token)
        const trainer = await db.Trainer.findOne({ 'google.id': googleID })
        if (!token) return res.status('Could not authorize the trainer')
        if (trainer === null) return res.status(400).json({ error: 'Double check the googleID is right for this request' })
        res.status(200).json({ message: 'Success', token, trainer })
    },
    // SIGNUP OR SIGNIN FACEBOOK
    facebookOAuth: async (req, res, next) => {
        const { access_token, facebookID } = req.body
        if (!access_token) return res.status(400).json({ error: 'No trainer access_token provided' })
        const token = await signToken(access_token)
        const trainer = await db.Trainer.findOne({ 'facebook.id': facebookID })
        if (!token) return res.status('Could not authorize the trainer')
        if (trainer === null) return res.status(400).json({ error: 'Double check the facebookID is right for this request' })
        res.status(200).json({ message: 'Success', token, trainer })
    },
    // TRAINER SIGNOUT
    getTrainerSignout: async (req, res, next) => {
        console.log('trainerController.getTrainerSignout called')
    },
    // RETURNS ALL THE TRAINERS
    getAllTrainers: async (req, res) => {
        const trainers = await db.Trainer.find({})
        .populate('photos')
        .populate('videos')
        if (!trainers) return res.status(404).json({ error: 'No trainers found'})
        res.status(200).send(trainers)
    },
    // GETS ALL CLIENTS OF A SPECIFIC TRAINER
    postGetAllClients: async (req, res) => {
        const { trainerId } = req.body
        if (!trainerId) return res.status(400).json({ error: 'Must provide trainerId' })
        const clients = await db.Client.find({ trainerId })
        if (!clients) return res.status(404).json({ error: 'No clients found'})
        res.status(200).send(clients)
    },
    // GETS A SINGLE TRAINER
    postGetSingleTrainer: async (req, res) => {
        const { id } = req.body
        if (!id) return res.status(400).json({ error: 'Must provide an id' })
        const trainer = await db.Trainer.findById(id)
        if (!trainer) return res.status(404).send("No trainer found.")
        res.status(200).send(trainer)
    },
    // DELETES A TRAINER
    deleteTrainerHardDelete: async (req, res) => {
        const deletedTrainer = await db.Trainer.findByIdAndRemove(req.params.id, (err, trainer) => {
            if (err) return res.status(500).send("There was a problem deleting the trainer.")
            res.status(200).send("Trainer: "+ trainer.username +" was deleted.")
        })
    },
    // UPDATES A SINGLE TRAINER
    putUpdateTrainer: async (req, res) => {
        if (!req.body._id) return res.status(400).json({ error: 'No _id provided' })
        const trainerToUpdate = await db.Trainer.updateOne({ _id: req.body._id }, req.body)
        if (!trainerToUpdate) return res.status(500).send("There was a problem updating the trainer.")
        const updatedTrainer = await db.Trainer.findById(req.body._id)
        if (!updatedTrainer) return res.status(500).json({ error: 'Internal server error' })
        res.status(200).send({ updatedTrainer })
    },
     // CHANGE PASSWORD
     putUpdateTrainerPassword: async (req, res) => {
        const { _id, password, passwordConf } = req.body
        if (!_id) return res.status(400).json({ error: 'No _id provided' })
        if (password !== passwordConf) return res.status(400).json({ error: 'password and passwordConf must have the same value' })
        // Generate salt
        const salt = await bcrypt.genSalt(10)
        // Generate hashed password
        const hashedPassword = await bcrypt.hash(password, salt)
        const hashedPasswordConf = await bcrypt.hash(passwordConf, salt)
        // update client with new password
        const updatedTrainer = await db.Trainer.updateOne({ _id }, { 'local.password': hashedPassword, 'local.passwordConf': hashedPasswordConf }, { new: true })
        res.status(200).json({ status: 'success' })
    },
    // TRAINER SET CURRENT PROFILE PICTURE
    postSetTrainerCurrentProfilePicture: async (req, res) => {
        const { id } = req.body
        if (!id) return res.status(400).json({ error: 'Must provide an id' })
        const profilePicture = await db.TrainerPhoto.findById(id)
        if (!profilePicture) return res.status(404).json({ error: 'Image not found' })
        const trainer = await db.Trainer.updateOne({ _id: profilePicture.trainerID },{ $set: { currentProfilePicture: profilePicture.imageURI} })
        if (!trainer) return res.status(500).json({ error: 'There was a problem setting the profile picture' })
        return res.status(200).send(trainer)
    }
}