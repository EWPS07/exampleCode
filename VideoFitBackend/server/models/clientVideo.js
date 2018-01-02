import mongoose from 'mongoose'
const { Schema } = mongoose
mongoose.Promise = global.Promise

const clientVideoSchema = new Schema({
  name: { type: String },
  desc: { type: String },
  clientID: { type: Schema.ObjectId, ref: 'Client', required: true },
  videoURI: { type: String, required: true, unique: true },
  createdAt: { type: Date, default: Date.now }
});

const ClientVideo = mongoose.model('ClientVideo', clientVideoSchema);
export default ClientVideo