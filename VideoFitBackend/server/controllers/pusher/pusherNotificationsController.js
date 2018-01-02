import Pusher from 'pusher'
import db from '../../models'
const pusherNotificationsController = {}

const pusher = new Pusher({
  appId: process.env.Pusher_App_Id,
  key: process.env.Pusher_Key,
  secret: process.env.Pusher_Secret,
  cluster: process.env.Pusher_Cluster,
  encrypted: true,
})
module.exports = {
    // NOTIFICATION TO ALL VIDEOFIT USERS
    postSendNotificationVideoFitAllUsers: async (req, res, next) => {
        console.log('pusherNotificationsController.postSendNotification() called!')
        const { event, message } = req.body
        return await pusher.trigger('VideoFit', event, {
          "message": message
        })
        console.log('Notification sent!')
        return res.status(200).json({ message: 'success', channel })
    },
    // NOTIFICATION TO ALL VIDEOFIT TRAINERS
    postSendNotificationVideoFitTrainers: async (req, res, next) => {
        console.log('pusherNotificationsController.postSendNotificationVideoFitTrainers() called!')
        const { event, message } = req.body
        return await pusher.trigger('VideoFitTrainers', event, {
          "message": message
        })
        console.log('Notification sent!')
        return res.status(200).json({ message: 'success', channel })
    },
    // NOTIFICATION TO ALL VIDEOFIT CLIENTS
    postSendNotificationVideoFitClients: async (req, res, next) => {
        console.log('pusherNotificationsController.postSendNotificationVideoFitClients() called!')
        const { event, message } = req.body
        return await pusher.trigger('VideoFitClients', event, {
          "message": message
        })
        console.log('Notification sent!')
        return res.status(200).json({ message: 'success', channel })
    },
    // NOTIFICATION TO ALL OF A TRAINERS CLIENTS
    postSendNotificationTrainerAllClients: async (req, res, next) => {
        console.log('pusherNotificationsController.postSendNotificationTrainerAllClients() called!')
        const { trainerID, event, message } = req.body
        const trainer = db.Trainer.findById(trainerID)
        let channel
           /*
        This if/else is only needed in dev, due to many
        clients and trainers not having names. Once the
        actual signup processes take place, everyone will
        provide the information needed to create the channel
        name properly.
        */
        if (trainer.firstName === undefined || trainer.lastName === undefined) {
            channel = `${ trainerID }'s clients`
        } else {
            channel = `${ trainer.firstName } ${ trainer.lastName }'s clients`
        }
        return await pusher.trigger('VideoFit', event, {
          "message": message
        })
        console.log('Notification sent!')
        return res.status(200).json({ message: 'success', channel })
    },
    // NOTIFICATION TO SINGLE CLIENT
    postSendNotificationSingleClient: async (req, res, next) => {
        console.log('pusherNotificationsController.postSendNotificationSingleClient() called!')
        const { clientID, event, message } = req.body
        const client = db.Client.findById(clientID)
        let channel
           /*
        This if/else is only needed in dev, due to many
        clients and trainers not having names. Once the
        actual signup processes take place, everyone will
        provide the information needed to create the channel
        name properly.
        */
        if (client.firstName === undefined || client.lastName === undefined) {
            channel = `${ clientID }`
        } else {
            channel = `${ client.firstName } ${ client.lastName }`
        }
        return await pusher.trigger(channel, event, {
          "message": message
        })
        console.log('Notification sent!')
        return res.status(200).json({ message: 'success', channel })
    },
    // NOTIFICATION TO SINGLE TRAINER
    postSendNotificationSingleTrainer: async (req, res, next) => {
        console.log('pusherNotificationsController.postSendNotificationSingleTrainer() called!')
        const { trainerID, event, message } = req.body
        const trainer = await db.Trainer.findById(trainerID)
        let channel
        /*
        This if/else is only needed in dev, due to many
        clients and trainers not having names. Once the
        actual signup processes take place, everyone will
        provide the information needed to create the channel
        name properly.
        */
        if (trainer.firstName === undefined || trainer.lastName === undefined) {
            channel = `${ trainerID }`
        } else {
            channel = `${ trainer.firstName } ${ trainer.lastName }`
        }
        return await pusher.trigger(channel, event, {
          "message": message
        })
        console.log('Notification sent!')
        return res.status(200).json({ message: 'success', channel })
    },
}
