import mongoose from 'mongoose'
const { Schema } = mongoose
mongoose.Promise = global.Promise

const trainerPhotoSchema = new Schema({
  name: { type: String },
  desc: { type: String },
  trainerID: { type: Schema.ObjectId, ref: 'Trainer', required: true },
  equipmentNeeded: { type: String, default: 'none' },
  isStretch: { type: Boolean, default: false },
  isExercise: { type: Boolean, default: false },
  isUpperBody: { type: Boolean, default: false },
  isLowerBody: { type: Boolean, default: false },
  isFullBody: { type: Boolean, default: false },
  isCore: { type: Boolean, default: false },
  isArms: { type: Boolean, default: false },
  isBack: { type: Boolean, default: false },
  isButt: { type: Boolean, default: false },
  isCalves: { type: Boolean, default: false },
  isChest: { type: Boolean, default: false },
  isHands: { type: Boolean, default: false },
  isLegs: { type: Boolean, default: false },
  isNeck: { type: Boolean, default: false },
  isShoulders: { type: Boolean, default: false },
  imageURI: { type: String, required: true, unique: true },
  createdAt: { type: Date, default: Date.now }
})

const TrainerPhoto = mongoose.model('TrainerPhoto', trainerPhotoSchema)
export default TrainerPhoto