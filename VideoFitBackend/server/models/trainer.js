import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'

const { Schema } = mongoose
mongoose.Promise = global.Promise

const trainerSchema = new Schema({
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
    profilePictures: [{ type: Schema.ObjectId, ref: 'TrainerPhoto' }],
    currentProfilePicture: { type: String },
    photos: [{ type: Schema.ObjectId, ref: 'TrainerPhoto' }],
    videos: [{ type: Schema.ObjectId, ref: 'TrainerVideo' }],
    routinePhotos: [{ type: Schema.ObjectId, ref: 'TrainerPhoto' }],
    routineVideos: [{ type: Schema.ObjectId, ref: 'TrainerVideo' }],
    baseFee: { type: String },
    email: { type: String }, 
    firstName: { type: String },
    lastName: { type: String },
    DOB: { type: Date },
    phoneNumber: { type: String },
    zip: { type: String },
    gender: { type: String },
    stripeId: { type: String },
    trainingSince: { type: Date },
    isDeleted: { type: Boolean, default: false },
    isMember: { type: Boolean, default: true },
    newsfeedId: { type: Schema.ObjectId, ref: 'Newsfeed' },
    _messages: [{ type: Schema.ObjectId, ref: 'TrainerMessage' }],
    _clients: [{ type: Schema.ObjectId, ref: 'Client' }],
})

trainerSchema.pre('save', async function(next) {
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

trainerSchema.methods.isPasswordValid = async function(newPassword) {
    try {
        return await bcrypt.compare(newPassword, this.local.password)
    } catch(error) {
        throw new Error(error)
    }
}
const Trainer = mongoose.model('Trainer', trainerSchema)

export default Trainer