import express from 'express'
import passport from 'passport'
import multer from 'multer'
import clientPassportConfig from './controllers/auth/passport/clientPassport'
import trainerPassportConfig from './controllers/auth/passport/trainerPassport'
import { validateBody, schemas } from './helpers/routeHelper'

// Controller imports
import clientController from './controllers/client/clientController'
import trainerController from './controllers/trainer/trainerController'
import clientPhotoController from './controllers/client/clientPhotoController'
import trainerMediaController from './controllers/trainer/trainerMediaController'
import taskController from './controllers/task/taskController'
import paymentController from './controllers/stripe/paymentController'
import awsImageUploadController from './controllers/aws/awsImageUploadController'
import awsVideoUploadController from './controllers/aws/awsVideoUploadController'
import pusherController from './controllers/pusher/pusherController'
import pusherNotificationsController from './controllers/pusher/pusherNotificationsController'
import rootController from './controllers/root/rootController'
import routineController from './controllers/routine/routineController'
import routineTaskController from './controllers/routine/routineTaskController'
import newsfeedController from './controllers/newsfeed/newsfeedController'
import newsfeedItemController from './controllers/newsfeed/newsfeedItemController'
import dbCleanController from './controllers/DB_OPS/dbCleanController'

const routes = require('express-promise-router')()
const passAuthJwt = passport.authenticate('jwt', { session: false })
const passLocalClient = passport.authenticate('localClient', { session: false })
const passLocalTrainer = passport.authenticate('localTrainer', { session: false })
const passFacebookTrainer = passport.authenticate('facebookTokenTrainer', { session: false })
const passFacebookClient = passport.authenticate('facebookTokenClient', { session: false })
const passGooglePlusClient = passport.authenticate('googleTokenClient', { session: false })
const passGooglePlusTrainer = passport.authenticate('googleTokenTrainer', { session: false })

// ROOT
routes.get('/', rootController.getRootResponse)
// DB OPS
routes.get('/tasks/clean', dbCleanController.getCleanTasks)
routes.get('/trainers/clean', dbCleanController.getCleanTrainers)
routes.get('/clients/clean', dbCleanController.getCleanClients)
routes.get('/routine/clean', dbCleanController.getCleanRoutines)
routes.get('/newsfeed/clean', dbCleanController.getCleanNewsfeeds)
// CLIENT
routes.post('/client/signup', validateBody(schemas.clientAuthSchema), clientController.postClientSignup)
routes.post('/client/signin', validateBody(schemas.clientSigninSchema), passLocalClient, clientController.postClientSignin)
routes.get('/client/signout', clientController.getClientSignout)
routes.get('/clients/all', clientController.getAllClients)
routes.post('/client', clientController.postGetSingleClient)
routes.put('/client/update', clientController.putUpdateClient)
routes.delete('/client/delete', clientController.deleteClientHardDelete)
routes.put('/client/update/password', clientController.putUpdateClientPassword)
// CLIENT SOCIAL-AUTH
routes.post('/client/oauth/facebook', passFacebookClient, clientController.facebookOAuth)
routes.post('/client/oauth/google', passGooglePlusClient, clientController.googleOAuth)
// CLIENT PHOTOS
routes.get('/client/photos/all', clientPhotoController.getAllClientPhotos)
routes.post('/client/photos', clientPhotoController.postGetClientPhotosById)
routes.post('/client/photo/setprofilepic', clientController.postSetClientCurrentProfilePicture)
// TRAINER
routes.post('/trainer/signup', validateBody(schemas.trainerAuthSchema), trainerController.postTrainerSignup)
routes.post('/trainer/signin', validateBody(schemas.trainerSigninSchema), passLocalTrainer, trainerController.postTrainerSignin)
routes.get('/trainer/signout', trainerController.getTrainerSignout)
routes.get('/trainers/all', trainerController.getAllTrainers)
routes.post('/trainer/clients/all', trainerController.postGetAllClients)
routes.post('/trainer', trainerController.postGetSingleTrainer)
routes.put('/trainer/update', trainerController.putUpdateTrainer)
routes.delete('/trainer/delete', trainerController.deleteTrainerHardDelete)
routes.post('/trainer/media/all', trainerMediaController.postGetMediaLibrary)
routes.put('/trainer/update/password', trainerController.putUpdateTrainerPassword)
// NEWSFEED
routes.post('/newsfeed', newsfeedController.postAddNewsfeed)
routes.post('/newsfeed/item', newsfeedItemController.postAddNewsfeedItem)
routes.post('/newsfeed/feed', newsfeedController.postGetNewsfeed)
// TRAINER SOCIAL-AUTH
routes.post('/trainer/oauth/facebook', passFacebookTrainer, trainerController.facebookOAuth)
routes.post('/trainer/oauth/google', passGooglePlusTrainer, trainerController.googleOAuth)
// TRAINER PHOTOS
routes.post('/trainer/photo/setprofilepic', trainerController.postSetTrainerCurrentProfilePicture)
// TASK
routes.post('/task/new', validateBody(schemas.taskSchema), taskController.postNewTask)
routes.get('/tasks/all', taskController.getAllTasks)
routes.put('/task/update', taskController.putUpdateTask)
routes.delete('/task/delete', taskController.deleteTask)
// ROUTINE
routes.post('/routine/new', routineController.postNewRoutine)
routes.put('/routine/update', routineController.putUpdateRoutine)
routes.delete('/routine/delete', routineController.deleteRoutine)
routes.get('/routines/all', routineController.getAllRoutines)
routes.post('/routine', routineController.postGetRoutineById)
routes.post('/routines/week/view', routineController.postGetAllRoutinesByDayOfWeek)
// ROUTINE TASK
routes.post('/routine/task/new', routineTaskController.postNewRoutineTask)
routes.put('/routine/task/update', routineTaskController.putUpdateRoutineTask)
routes.delete('/routine/task/delete', routineTaskController.deleteRoutineTask)
// AWS IMAGE UPLOAD - Handles both client and trainer photo uploads
routes.post('/photo/upload', multer({ limits: { fileSize:10*1024*1024 }}).single('file'), awsImageUploadController.uploadImageToGallery)
routes.post('/photo/upload/profile', multer({ limits: { fileSize:10*1024*1024 }}).single('file'), awsImageUploadController.uploadImageAsProfileImage)
routes.post('/photo/upload/routine', multer({ limits: { fileSize:10*1024*1024 }}).single('file'), awsImageUploadController.uploadRoutineOrCompletionPhoto)
// AWS VIDEO UPLOAD - Handles both client and trainer video uploads
routes.post('/video/upload', multer().single('file'), awsVideoUploadController.uploadVideo)
routes.post('/video/upload/routine', multer().single('file'), awsVideoUploadController.uploadRoutineOrCompletionVideo)
// PUSHER MESSAGING
routes.post('/pusher/chatkit/create_user', pusherController.postCreateUser)
routes.post('/pusher/chatkit/user', pusherController.postGetChatkitUserById)
routes.post('/pusher/chatkit/create_room', pusherController.postCreateRoom)
routes.post('/pusher/chatkit/client/invite/trainer', pusherController.postClientInviteTrainerChat)
routes.post('/pusher/chatkit/trainer/invite/client', pusherController.postTrainerInviteClientChat)
routes.post('/pusher/chatkit/authenticate', pusherController.postChatkitAuthToken)
// PUSHER NOTIFICATIONS
routes.post('/pusher/notification/videofit/users/all', pusherNotificationsController.postSendNotificationVideoFitAllUsers)
routes.post('/pusher/notification/videofit/trainers/all', pusherNotificationsController.postSendNotificationVideoFitTrainers)
routes.post('/pusher/notification/videofit/clients/all', pusherNotificationsController.postSendNotificationVideoFitClients)
routes.post('/pusher/notification/videofit/trainer/clients/all', pusherNotificationsController.postSendNotificationTrainerAllClients)
routes.post('/pusher/notification/videofit/trainer/single', pusherNotificationsController.postSendNotificationSingleTrainer)
routes.post('/pusher/notification/videofit/client/single', pusherNotificationsController.postSendNotificationSingleClient)
// // STRIPE
routes.get('/payment/stripe/authorize', paymentController.getStripeAuthorize)
routes.post('/payment/stripe/account_credentials', paymentController.postStripeGetAccountId)
routes.post('/payment/checkout', paymentController.postStripeCheckout)
routes.post('/payment/refund', paymentController.postStripeRefund)
routes.get('/stripe/callback', paymentController.getStripeCallback)

export default routes