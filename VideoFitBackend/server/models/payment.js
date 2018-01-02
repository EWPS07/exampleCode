import mongoose from 'mongoose'

const { Schema } = mongoose

const paymentSchema = new Schema({
    invoiceNumber: { type: String, required: true },
    price: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
})

const Payment = mongoose.model('Payment', paymentSchema)

export default Payment