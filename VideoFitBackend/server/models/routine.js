import mongoose from 'mongoose'

const { Schema } = mongoose
mongoose.Promise = global.Promise

const routineSchema = new Schema({
    createdAt: { type: Date, defualt: Date.now },
    icon: { type: String },
    isRestDay: { type: Boolean, default: false},
    dayOfWeek: { type: String },
    desc: { type: String },
    isDeleted: { type: Boolean, default: false },
    _routineTasks: [{ type: Schema.ObjectId, ref: 'RoutineTask' }],
    _clientId: { type: Schema.ObjectId, ref: 'Client' },
    _creator: { type: Schema.ObjectId, ref: 'Trainer' },
})

const Routine = mongoose.model('Routine', routineSchema)

export default Routine