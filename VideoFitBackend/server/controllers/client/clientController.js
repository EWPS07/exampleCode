import db from '../../models'
import jwt from 'jsonwebtoken'
import { JWT_SECRET } from '../auth/JWT'
import bcrypt from 'bcryptjs'
const debug = require('debug')('videoFitBackend:clientController');
const clientController = {}

const signToken = client => {
    return jwt.sign({
        iss: 'videoFit',
        sub: client._id,
        lat: new Date().getTime(),
        exp: new Date().setDate(new Date().getDate() + 1) // plus one day in the future
    }, JWT_SECRET)
}
// CREATES A NEW CLIENT
module.exports = {
    postClientSignup: async (req, res, next) => {
        
        const {
            DOB,
            email,
            password,
            firstName,
            lastName,
            passwordConf,
            photo,
            phoneNumber,
            gender,
            height,
            weight,
            zip,
            address,
            progressPhotos,
            profilePicture,
            currentProfilePicture,
            fitnessGoal,
        } = req.value.body
        
        if (!email || !password || !passwordConf) return res.status(400).json({ error: 'Must provide email, password, and passwordConf' })
        const foundClient = await db.Client.findOne({ 'local.email': email })

        if (foundClient) res.status(403).json({ error: 'This email is already in use'})
        const newClient = new db.Client({
            method: 'local',
            local: {
                email: email,
                password: password,
                passwordConf: passwordConf,
            },
            DOB,
            firstName,
            lastName,
            photo,
            phoneNumber,
            gender,
            height,
            weight,
            zip,
            address,
            progressPhotos,
            fitnessGoal,
        })
        const client = await newClient.save()
        const token = signToken(client)
        res.status(200).json({ token, client })
    },
    // SIGNS IN A CLIENT
    postClientSignin: async (req, res, next) => {
        const { email, password } = req.value.body
        if (!email || !password) return res.status(400).json({ error: 'Bad request, must provide email and passord' })
        const client = await db.Client.findOne({ 'local.email': email })
        if (!client) return res.status(404).json({ error: 'Client was not found'})
        const token = await signToken(client)
        if (!token) return res.status(401).json({ error: 'Unauthorized' })
        return res.status(200).json({ token, client })
    },
    // GOOGLE SIGNIN OR CREATE ACCOUNT
    googleOAuth: async (req, res, next) => {
        const { access_token, googleID } = req.body
        if (!access_token) return res.status(400).json({ error: 'No client access_token provided' })
        const token = await signToken(access_token)
        const client = await db.Client.findOne({ 'google.id': googleID })
        if (!token) return res.status('Could not authorize the client')
        if (client === null) return res.status(400).json({ error: 'Double check the googleID is right for this request' })
        res.status(200).json({ message: 'Success', token, client })
    },
    // FACEBOOK SIGNIN OR CREATE ACCOUNT
    facebookOAuth: async (req, res, next) => {
        const { access_token, facebookID } = req.body
        if (!access_token) return res.status(400).json({ error: 'No client access_token provided' })
        const token = await signToken(access_token)
        const client = await db.Client.findOne({ 'facebook.id': facebookID })
        if (!token) return res.status('Could not authorize the client')
        if (client === null) return res.status(400).json({ error: 'Double check the facebookID is right for this request' })
        res.status(200).json({ message: 'Success', token, client })
    },
    // CLIENT SIGNOUT
    getClientSignout: async (req, res, next) => {
        console.log('clientController.getClientSignout called')
    },
    // RETURNS ALL THE CLIENTS
    getAllClients: async (req, res) => {
        const clients = await db.Client.find({})
        if (!clients) return res.status(404).json({ error: 'No clients found'})
        res.status(200).send(clients)
    },
    // GETS A SINGLE CLIENT
    postGetSingleClient: async (req, res) => {
        const { clientID } = req.body
        if (!clientID) return res.status(400).json({ error: 'Must provide an clientID' })
        const client = await db.Client.findById(clientID)
        if (!client) return res.status(404).send("No client found.")
        res.status(200).send(client)
    },
    // DELETES A CLIENT
    deleteClientHardDelete: async (req, res) => {
        const deletedClient = await db.Client.findByIdAndRemove(req.params.id, (err, client) => {
            if (err) return res.status(500).send("There was a problem deleting the client.")
            res.status(200).send(`Client: ${ client.firstName } ${ client.lastName } was deleted`)
        })
    },
    // UPDATES A SINGLE CLIENT
    putUpdateClient: async (req, res) => {
        if (!req.body._id) return res.status(400).json({ error: 'No _id provided' })
        const clientToUpdate = await db.Client.updateOne({ _id: req.body._id }, req.body)
        if (!clientToUpdate) return res.status(500).send("There was a problem updating the client.")
        const updatedClient = await db.Client.findById(req.body._id)
        if (!updatedClient) return res.status(500).json({ error: 'Internal server error' })
        res.status(200).send({ updatedClient })
    },
    // CHANGE PASSWORD
    putUpdateClientPassword: async (req, res) => {
        const { _id, password, passwordConf } = req.body
        if (!_id) return res.status(400).json({ error: 'No _id provided' })
        if (password !== passwordConf) return res.status(400).json({ error: 'password and passwordConf must be of same value' })
        // Generate salt
        const salt = await bcrypt.genSalt(10)
        // Generate hashed password
        const hashedPassword = await bcrypt.hash(password, salt)
        const hashedPasswordConf = await bcrypt.hash(passwordConf, salt)
        // update client with new password
        const updatedClient = await db.Client.updateOne({ _id }, { 'local.password': hashedPassword, 'local.passwordConf': hashedPasswordConf }, { new: true })
        res.status(200).json({ status: 'success' })
    },
    // CLIENT SET CURRENT PROFILE PICTURE
    postSetClientCurrentProfilePicture: async (req, res) => {
        const { id } = req.body
        if (!id) return res.status(400).json({ error: 'Must provide an id' })
        const profilePicture = await db.ClientPhoto.findById(id)
        if (!profilePicture) return res.status(404).json({ error: 'Image not found' })
        const client = await db.Client.updateOne({ _id: profilePicture.clientID },{ $set: { currentProfilePicture: profilePicture.imageURI} })
        if (!client) return res.status(500).json({ error: 'There was a problem setting the profile picture' })
        return res.status(200).send(client)
    }
}