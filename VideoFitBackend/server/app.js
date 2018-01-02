import express from 'express'
import session from 'express-session'
import 'babel-polyfill'
import morgan from 'morgan'
import bodyParser from 'body-parser'
import mongoose from 'mongoose'
import cors from 'cors'
import routes from './routes'

if (process.env.ENV === 'local') require('dotenv').config()

if (process.env.ENV === 'staging') {
    console.log('...trying to connect')
    mongoose.connect(process.env.mongoStagingCluster, () => {
        console.log('CONNECTED TO THE STAGING CLUSTER')
    })
}
else if (process.env.ENV === 'prod') {
    // CLUSTER CONNECTION
    console.log('...trying to connect')
    mongoose.connect(process.env.mongoProdCluster, () => {
        console.log('CONNECTED TO THE PRODUCTION CLUSTER')
    })
}
else {
    console.log('...trying to connect')
    mongoose.connect(process.env.mongodbLocal, () => {
        console.log('CONNECTED TO THE LOCAL DATABASE')
    })
}

const app = express();

// Middleware
app.use(session({
    secret: process.env.Session_Secret,
    resave: true,
    saveUninitialized: true,
}))
app.use(cors())
app.use(morgan('dev'))
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use('/api', routes)

export default app