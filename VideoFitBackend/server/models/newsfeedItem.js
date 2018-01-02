import mongoose from 'mongoose'

const { Schema } = mongoose

mongoose.Promise = global.Promise

const newsfeedItemSchema = new Schema({
    createdAt: { type: Date, default: Date.now },
    newsfeedId: { type: Schema.ObjectId, ref: 'Newsfeed' },
    clientId: { type: Schema.ObjectId, ref: 'Client' },
    photo: { type: Schema.ObjectId, ref: 'ClientPhoto' },
    text: { type: String, required: true },
    isHighFive: { type: Boolean, default: false },
    isNudged: { type: Boolean, default: false },
})

const NewsfeedItem = mongoose.model('NewsfeedItem', newsfeedItemSchema)

export default NewsfeedItem