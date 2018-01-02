const passport = require('passport')
const mongoose = require('mongoose')
const JwtStrategy = require('passport-jwt').Strategy
const { ExtractJwt } = require('passport-jwt')
const LocalStrategy = require('passport-local').Strategy
const InstagramStrategy = require('passport-instagram').Strategy
const GooglePlusTokenStrategy = require('passport-google-plus-token')
// const GoogleIdTokenStrategy = require('passport-google-id-token')
const FacebookTokenStrategy = require('passport-facebook-token')
const debug = require('debug')('videoFitBackend:clientPassport');
import { JWT_SECRET, GooglePlus, Facebook, Facebook_Test } from '../JWT'
import db from '../../../models'

// TOKENS
passport.use(new JwtStrategy({
    jwtFromRequest: ExtractJwt.fromHeader('authorization'),
    secretOrKey: JWT_SECRET,
}, async (payload, done) => {
    try {
        // find the user specified in token
        const client = await db.Client.findById(payload.sub)
        // if user doesnt exist, handle it
        if (!client) {
            return done(null, false)
        }
        // otherwise, return user
        done(null, client)
    } catch(error) {
        done(error, false)
    }
}))

// LOCAL
passport.use('localClient', new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password',
    },
    async (email, password, done) => {
        try {
            const client = await db.Client.findOne({ 'local.email': email })
            if (!client) {
                return done(null, false)
            }
            const isMatch = await client.isPasswordValid(password)
            
            console.log('isMatch', isMatch)
            if (!isMatch) {
                return done(null, false)
            }
            done(null, client)
        }
        catch(error) {
            done(error, false)
        }
    }
))

// GOOGLE PLUS
passport.use('googleTokenClient', new GooglePlusTokenStrategy({
    clientID: GooglePlus.clientID,
    clientSecret: GooglePlus.clientSecret,
    },
    async (accessToken, refreshToken, profile, done) => {
        try {
            // console.log('ACCESS_TOKEN', accessToken)
            // console.log('REFRESH_TOKEN', refreshToken)
            // console.log('PROFILE', profile)
            
            const existingClient = await db.Client.findOne({ 'google.id': profile.id })
            if (existingClient) {
                console.log('User already exists in our DB')
                return done(null, existingClient)
            }
            debug('Client does not exist, creating a new one')
            // If new client
            const newClient = new db.Client({
                method: 'google',
                google: {
                    id: profile.id,
                    email: profile.emails[0].value,
                }
            })
            await newClient.save()
            done(null, newClient)
        }
        catch(error) {
            done(error, false, error.message)
        }
    }
))

passport.use('facebookTokenClient', new FacebookTokenStrategy({
    clientID: Facebook.clientID,
    clientSecret: Facebook.clientSecret,
},
async (accessToken, refreshToken, profile, done) => {
    try {
        console.log('ACCESS_TOKEN', accessToken)
        const buffToken = Buffer.from(accessToken)
        console.log('ACCESS_TOKEN_BUFFER', buffToken)
        console.log('REFRESH_TOKEN', refreshToken)
        console.log('PROFILE', profile)

        const existingClient = await db.Client.findOne({ 'facebook.id': profile.id })
        if (existingClient) {
            return done(null, existingClient)
        }

        const newClient = new db.Client({
            method: 'facebook',
            facebook: {
                id: profile.id,
                email: profile.emails[0].value,
            }
        })

        await newClient.save()
        done(null, newClient)
    }
    catch(error) {
        done(error, false, error.message)
    }
}))
