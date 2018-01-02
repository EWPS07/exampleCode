import mongoose from 'mongoose'

const { Schema } = mongoose
mongoose.Promise = global.Promise

const newsfeedSchema = new Schema({
    createdAt: { type: Date, default: Date.now },
    trainerId: { type: Schema.ObjectId, ref: 'Trainer' },
})

const Newsfeed = mongoose.model('Newsfeed', newsfeedSchema)

export default Newsfeed