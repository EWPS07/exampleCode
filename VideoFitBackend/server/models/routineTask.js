import mongoose from 'mongoose'

const { Schema } = mongoose
mongoose.Promise = global.Promise

const routineTaskSchema = new Schema({
    createdAt: { type: Date, default: Date.now },
    name: { type: String },
    section: { type: String, required: true },
    duration: { type: Number, default: 60 },
    warmUpTargetArea: { type: String },
    workoutTargetArea: { type: String },
    stretchTargetArea: { type: String },
    thumbnailImage: { type: Schema.ObjectId, ref: 'TrainerPhoto' },
    excerciseDesc: { type: String },
    videoDemo: { type: Schema.ObjectId, ref: 'TrainerVideo' },
    equipmentNeeded: { type: String },
    isDeleted: { type: Boolean, default: false },
    isFavorite: { type: Boolean, default: false },
    _creator: { type: Schema.ObjectId, ref: 'Trainer', required: true },
    _clientId: { type: Schema.ObjectId, ref: 'Client' },
    _routineId: { type: Schema.ObjectId, ref: 'Routine', required: true },
})

const RoutineTask = mongoose.model('RoutineTask', routineTaskSchema)

export default RoutineTask