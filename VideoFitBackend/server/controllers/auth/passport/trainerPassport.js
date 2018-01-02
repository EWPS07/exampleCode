const passport = require('passport')
const mongoose = require('mongoose')
const JwtStrategy = require('passport-jwt').Strategy
const { ExtractJwt } = require('passport-jwt')
const LocalStrategy = require('passport-local').Strategy
const InstagramStrategy = require('passport-instagram').Strategy
const GooglePlusTokenStrategy = require('passport-google-plus-token')
const FacebookTokenStrategy = require('passport-facebook-token')
const debug = require('debug')('videoFitBackend:trainerPassport');
import { JWT_SECRET, GooglePlus, Facebook, Facebook_Test } from '../JWT'
import db from '../../../models'

// TOKENS
passport.use(new JwtStrategy({
    jwtFromRequest: ExtractJwt.fromHeader('authorization'),
    secretOrKey: JWT_SECRET,
}, async (payload, done) => {
    try {
        // find the trainer specified in token
        const trainer = await db.Trainer.findById(payload.sub)
        // if trainer doesnt exist, handle it
        if (!trainer) {
            return done(null, false)
        }
        // otherwise, return user
        done(null, trainer)
    } catch(error) {
        done(error, false)
    }
}))

// LOCAL
passport.use('localTrainer', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
},
async (email, password, done) => {
    try {
        const trainer = await db.Trainer.findOne({ 'local.email': email })
        if (!trainer) {
            return done(null, false)
        }
        const isMatch = await trainer.isPasswordValid(password)
        
        console.log('isMatch', isMatch)
        if (!isMatch) {
            return done(null, false)
        }
        done(null, trainer)
    }
    catch(error) {
        done(error, false)
    }
}
))

// GOOGLE PLUS
passport.use('googleTokenTrainer', new GooglePlusTokenStrategy({
    clientID: GooglePlus.clientID,
    clientSecret: GooglePlus.clientSecret,
    },
    async (accessToken, refreshToken, profile, done) => {
        try {
            console.log('ACCESS_TOKEN', accessToken)
            console.log('REFRESH_TOKEN', refreshToken)
            console.log('PROFILE', profile)
            
            const existingTrainer = await db.Trainer.findOne({ 'google.id': profile.id })
            if (existingTrainer) {
                debug('Trainer already exists in our DB')
                return done(null, existingTrainer)
            }
            debug('Trainer does not exist, creating a new one')
            // If new trainer
            const newTrainer = new db.Trainer({
                method: 'google',
                google: {
                    id: profile.id,
                    email: profile.emails[0].value,
                }
            })
            await newTrainer.save()
            done(null, newTrainer)
        }
        catch(error) {
            done(error, false, error.message)
        }
    }
))

passport.use('facebookTokenTrainer', new FacebookTokenStrategy({
    clientID: Facebook.clientID,
    clientSecret: Facebook.clientSecret,
},
async (accessToken, refreshToken, profile, done) => {
    try {
        console.log('ACCESS_TOKEN', accessToken)
        console.log('REFRESH_TOKEN', refreshToken)
        console.log('PROFILE', profile)

        const existingTrainer = await db.Trainer.findOne({ 'facebook.id': profile.id })
        if (existingTrainer) {
            console.log('Trainer was found')
            return done(null, existingTrainer)
        }

        const newTrainer = new db.Trainer({
            method: 'facebook',
            facebook: {
                id: profile.id,
                email: profile.emails[0].value,
            }
        })

        await newTrainer.save()
        done(null, newTrainer)
    }
    catch(error) {
        done(error, false, error.message)
    }
}))
