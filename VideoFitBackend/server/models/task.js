import mongoose from 'mongoose'

const { Schema } = mongoose
mongoose.Promise = global.Promise

const taskSchema = new Schema({
    createdAt: { type: Date, defualt: Date.now },
    icon: { type: String },
    name: { type: String, required: true },
    desc: { type: String, required: true },
    dayOfWeek: { type: String, required: true },
    isCompleted: { type: Boolean, default: false },
    isDeleted: { type: Boolean, default: false },
    _clientId: { type: Schema.ObjectId, ref: 'Client' },
    _creator: { type: Schema.ObjectId, ref: 'Trainer' },
})

const Task = mongoose.model('Task', taskSchema)

export default Task