const Chatkit = require('pusher-chatkit-server')
import db from '../../models'
const instanceLocator = process.env.Pusher_Chatkit_Instance_Locator
const key = process.env.Pusher_Chatkit_Secret_Key

import Pusher from 'pusher'

var pusher = new Pusher({
  appId: "APP_ID",
  key: "APP_KEY",
  secret: "APP_SECRET",
  cluster: "APP_CLUSTER",
})

const pusherController = {}
const chatkit = new Chatkit.default({
  instanceLocator: instanceLocator,
  key: key,
})

module.exports = {
  // AUTHENTICATE
  postChatkitAuthToken: async (req, res, next) => {
    const { ID } = req.body
    const token = await chatkit.authenticate({grant_type: 'client_credentials'}, ID)
    if (!token) return res.status(500).json({ error: 'Something went wrong with authentication' })
    res.status(200).send(token)
  },
  // CREATE CHATKIT USER
  postCreateUser: async (req, res, next) => {
    const { clientID, trainerID } = req.body
    if (clientID && trainerID) return res.status(400).json({ error: 'Must provide a cliendID "OR" trainerID, not both' })
    if (!clientID && !trainerID) return res.status(400).json({ error: 'Must provide a clientID or trainerID' })
    if (clientID) {
      const { _id, currentProfilePicture, firstName, lastName } = await db.Client.findById(clientID)
      await chatkit.createUser(_id, `${ firstName } ${ lastName }`)
      .then(() => {
        console.log('User created successfully')
      }).catch((err) => {
        console.log(err)
      })
    }
    else {
      const { _id, currentProfilePicture, firstName, lastName } = await db.Trainer.findById(trainerID)
      await chatkit.createUser(_id, `${ firstName } ${ lastName }`)
      .then(() => {
        console.log('User created successfully')
      }).catch((err) => {
        console.log(err)
      })
    }
  },

  // GET CHATKIT USER BY ID
  postGetChatkitUserById: async (req, res, next) => {
    const { ID1, ID2 } = req.body
    if (!ID2) {
      let user = await chatkit.getUsersByIds([ ID1 ])
      if (!user) return res.status(500).json({ error: 'No user found' })
      res.status(200).send(user)
    }
    let users = await chatkit.getUsersByIds([ ID1, ID2 ])
    if (!users) return res.status(500).json({ error: 'Users not found' })
    res.status(200).send(users) 
  },

  // CREATE CHAT
  postCreateRoom: async (req, res, next) => {
    const { clientID, trainerID } = req.body
    if (clientID && trainerID) return res.status(400).json({ error: 'Must provide a cliendID "OR" trainerID, not both' })
    if (!clientID && !trainerID) return res.status(400).json({ error: 'Must provide a clientID or trainerID' })
    if (clientID) {
      chatkit.createRoom(clientID, {
        name: 'Private room',
      })
      .then(res => {
        console.log(res)
        console.log('Room created successfully')
      }).catch((err) => {
        console.log(err)
      })
    }
    else {
      chatkit.createRoom(trainerID, {
        name: 'Private room',
      })
      .then(res => {
        console.log(res)
        console.log('Room created successfully')
      }).catch((err) => {
        console.log(err)
      })
    }
  },

  // CLIENT INVITE TRAINER CHAT
  postClientInviteTrainerChat: async (req, res, next) => {
    const { clientID, trainerID } = req.body
    if (!clientID || !trainerID) return res.status(400).json({ error: 'Must provide a clientID AND trainerID' })
    chatkit.createRoom(clientID, {
      name: 'Private room',
      isPrivate: true,
      userIds: [trainerID]
    })
    .then(res => {
      console.log(res)
      console.log('Room created successfully')
    }).catch((err) => {
      console.log(err)
    })
  },

  // TRAINER INVITE CLIENT CHAT
  postTrainerInviteClientChat: async (req, res, next) => {
    const { clientID, trainerID } = req.body
    if (!clientID && !trainerID) return res.status(400).json({ error: 'Must provide a clientID AND trainerID' })
    chatkit.createRoom(trainerID, {
      name: 'Private room',
      isPrivate: true,
      userIds: [clientID]
    })
    .then(res => {
      console.log(res)
      console.log('Room created successfully')
    }).catch((err) => {
      console.log(err)
    })
  },
  // PUSHER NOTIFICATION
  postSendNotification: async (req, res, nex) => {
    const { ID } = req.body
    
    pusher.notify(['donuts'], {
      apns: {
        aps: {
          alert: {
            body: "hello world"
          }
        }
      }
    })
  }
}