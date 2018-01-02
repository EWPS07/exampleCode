import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'

const { Schema } = mongoose
mongoose.Promise = global.Promise

const clientSchema = new Schema({
    method: {
        type: String,
        enum: [ 'local', 'google', 'facebook' ],
        required: true,
    },
    local: {
        email: { type: String, lowercase: true },
        password: { type: String },
        passwordConf: { type: String },
    },
    google: {
        id: { type: String },
        email: { type: String, lowercase: true },
    },
    facebook: {
        id: { type: String },
        email: { type: String, lowercase: true },
    },
    createdAt: { type: Date, default: Date.now },
    firstName: { type: String },
    lastName: { type: String },
    completionPhotos: [{ type: Schema.ObjectId, ref: 'ClientPhoto' }],
    completionVideos: [{ type: Schema.ObjectId, ref: 'ClientVideo' }],
    profilePictures: [{ type: Schema.ObjectId, ref: 'ClientPhoto' }],
    currentProfilePicture: { type: String },
    DOB: { type: String },
    phoneNumber: { type: String },
    zip: { type: String },
    height: { type: String },
    weight: { type: String },
    gender: { type: String },
    isDeleted: { type: Boolean, default: false },
    isMember: { type: Boolean, default: true },
    trainerId: { type: Schema.ObjectId, ref: 'Trainer' },
    progressPhotos: [{ type: Schema.ObjectId, ref: 'ClientPhoto' }],
    fitnessGoal: { type: String },
    _tasks: [{ type: Schema.ObjectId, ref: 'Task' }],
    _messages: [{ type: Schema.ObjectId, ref: 'ClientMessage'}],
    _routines: [{ type: Schema.ObjectId, ref: 'Routine' }],
})

clientSchema.pre('save', async function(next) {
    try {
        if (this.method !== 'local') {
            next()
        }
        console.log('Presave called!')
        // Generate a salt
        const salt = await bcrypt.genSalt(10)
        // Generate hashed password
        const hashedPassword = await bcrypt.hash(this.local.password, salt)
        const hashedPasswordConf = await bcrypt.hash(this.local.passwordConf, salt)
        // set password to hashedPassword
        this.local.password = hashedPassword
        this.local.passwordConf = hashedPasswordConf
        next()
    } catch(error) {
        next(error)
    }
})

clientSchema.methods.isPasswordValid = async function(newPassword) {
    try {
        return await bcrypt.compare(newPassword, this.local.password)
    } catch(error) {
        throw new Error(error)
    }
}

const Client = mongoose.model('Client', clientSchema)

export default Client