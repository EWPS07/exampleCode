import mongoose from 'mongoose'
const { Schema } = mongoose
mongoose.Promise = global.Promise

const clientPhotoSchema = new Schema({
  name: { type: String },
  desc: { type: String },
  clientID: { type: Schema.ObjectId, ref: 'Client', required: true },
  imageURI: { type: String, required: true, unique: true },
  createdAt: { type: Date, default: Date.now }
});

const ClientPhoto = mongoose.model('ClientPhoto', clientPhotoSchema);
export default ClientPhoto