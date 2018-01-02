import axios from 'axios'
import db from '../../models'
const paymentController = {}
const stripe = require('stripe')(process.env.Stripe_Test_Secret_Key)
const client_secret = process.env.Stripe_Dev_Client_Secret
const authRedirectUrl = `https://connect.stripe.com/oauth/authorize?response_type=code&client_id=${ process.env.Stripe_Dev_Client_Id }&scope=read_write`
const accountIdUrl = 'https://connect.stripe.com/oauth/token'

module.exports = {
    // AUTHORIZATION
    getStripeAuthorize: async (req, res, next) => {
        res.status(200).redirect(authRedirectUrl)
    },
    // GET STRIPE CALLBACK
    getStripeCallback: async (req, res, next) => {
        const { code } = req.query
        if (!code) return res.status(500).json({ error: 'Sorry, an unknown error occurred' })
        return res.status(200).json({ code })
    },
    // GET TRAINER STRIPE ACCOUNT ID
    postStripeGetAccountId: async (req, res, next) => {
        const { trainerID, code } = req.body
        if (!trainerID || !code) return res.status(400).json({ error: 'Must provide a trainerID and code' })
        const accountResponse = await axios.post(accountIdUrl, {
            code,
            client_secret,
            grant_type: 'authorization_code',
        })
        if (!accountResponse) return res.status(500).json({ error: 'Something went wrong trying to retrieve the stripe account' })
        const { stripe_user_id } = accountResponse.data
        let trainer = await db.Trainer.updateOne({ _id: trainerID }, { stripeId: stripe_user_id }, { new: true })
        if (!trainer) return res.status(500).json({ error: 'Failed to update the trainer' })
        trainer = await db.Trainer.findById(trainerID)
        if (!trainer) return res.status(500).json({ error: 'Sorry, an unknown error occurred' })
        return res.status(200).send(trainer)
    },
    // CHECKOUT
    postStripeCheckout: async (req, res, next) => {
        const { clientID, trainerID } = req.body
        if (!clientID || !trainerID) return res.status(400).json({ error: 'Must provide a clientID and trainerID' })
        const client = await db.Client.findById(clientID)
        if (!client) return res.status(500).json({ error: 'Client not found' })
        const trainer = await db.Trainer.findById(trainerID)
        if (!trainer) return res.status(500).json({ error: 'Trainer not found' })
        const trainerStripeId = trainer.stripeId
        if (!trainerStripeId) return res.status(500).json({ error: 'Sorry, an unknown error occurred' })
        /*
        Don't want to charge my own card for anything so this whole chunk below here needs to be re-worked
        */
        // PRICING
        let basePrice = trainer.baseFee * 10
        basePrice = 1
        const videoFitCharge = Number(basePrice) * 1
        const trainerProfit = basePrice * 1

        stripe.charges.create({
            amount: basePrice,
            currency: 'usd',
            source: 'tok_visa',
            destination: {
                amount: trainerProfit,
                account: trainerStripeId,
            },
        }).then(function(charge) {
            console.log('CHARGE', charge)
        })
    },
    // TODO - finish this refund route
    // REFUND
    postStripeRefund: async (req, res, next) => {
        const { chargeId } = req.body
        stripe.refunds.create({
            charge: chargeId,
            reverse_transfer: true,
        }).then(function(refund) {
            console.log('REFUND', refund)
        })
    }
}