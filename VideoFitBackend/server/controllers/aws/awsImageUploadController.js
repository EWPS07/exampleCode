const BUCKET_NAME = process.env.AMZN_BUCKET
const ACCESS_KEY = process.env.AMZN_ACCESS_KEY
const SECRET_ACCESS_KEY = process.env.AMZN_SECRET_ACCESS_KEY
const AWS = require('aws-sdk')
const fs = require('fs')
const path = require('path')
import db from '../../models'
const awsImageUploadController = {}

AWS.config.update({
    accessKeyId: ACCESS_KEY,
    secretAccessKey: SECRET_ACCESS_KEY,
    region: 'us-west-2',
})

const vfBucket = new AWS.S3({
    params: {
        Bucket: BUCKET_NAME,
    }
})

const uploadToS3 = async (file, destFileName, callback) => {
    await vfBucket
        .upload({
            ACL: 'public-read', 
            Body: file.buffer,
            Key: destFileName.toString(),
            ContentType: 'application/octet-stream', // force download if it's accessed as a top location
        })
        .send(callback)
}
module.exports = {
    uploadImageToGallery: async (req, res, next) => {
        const { clientID, trainerID, name, desc } = req.body
        if (!req.file) {
            return res.status(403).send('expect 1 file upload named file').end()
        }
        let file = req.file

        if (!/^image\/(jpe?g|png|gif)$/i.test(file.mimetype)) {
            return res.status(403).send('expect image file').end()
        }

        let pid = '10000' + parseInt(Math.random() * 10000000)

        uploadToS3(file, pid,
            async (err, data) => {
                if (err) {
                    console.error(err);
                    return res.status(500).send('failed to upload to s3').end()
                }
                const { Location } = data
                if(clientID) {
                    const clientPhoto = new db.ClientPhoto({
                        name,
                        desc,
                        imageURI: Location,
                        clientID,
                    })
                    await clientPhoto.save()
                    
                    const updatedClient = await db.Client.findByIdAndUpdate(
                        { _id: clientID },
                        { $push: { 'progressPhotos': clientPhoto } }
                    ).populate('progressPhotos')
                    if (!updatedClient) res.status(500).send({ error: 'Sorry, there was a problem posting your message' })
                    res.status(200).json(clientPhoto)
                }
                if(trainerID) {
                    const trainerPhoto = new db.TrainerPhoto({
                        name,
                        desc,
                        imageURI: Location,
                        trainerID,
                    })
                    await trainerPhoto.save()
                    
                    const updatedTrainer = await db.Trainer.findByIdAndUpdate(
                        { _id: trainerID },
                        { $push: { 'photos': trainerPhoto } }
                    ).populate('photos')
                    if (!updatedTrainer) res.status(500).send({ error: 'Sorry, there was a problem posting your photo' })
                    res.status(200).json(clientPhoto)
                }
        })
    },
    uploadRoutineOrCompletionPhoto: async (req, res, next) => {
        const {
            clientID,
            trainerID,
            name,
            desc,
            equipmentNeeded,
            isStretch,
            isExercise,
            isUpperBody,
            isLowerBody,
            isFullBody,
            isCore,
            isArms,
            isBack,
            isButt,
            isCalves,
            isChest,
            isHands,
            isLegs,
            isNeck,
            isShoulders,
        } = req.body

        if (!req.file) {
            return res.status(403).send('expect 1 file upload named file').end()
        }
        let file = req.file

        if (!/^image\/(jpe?g|png|gif)$/i.test(file.mimetype)) {
            return res.status(403).send('expect image file').end()
        }

        let pid = '10000' + parseInt(Math.random() * 10000000)

        uploadToS3(file, pid,
            async (err, data) => {
                if (err) {
                    console.error(err);
                    return res.status(500).send('failed to upload to s3').end()
                }
                const { Location } = data
                if(clientID) {
                    const clientPhoto = new db.ClientPhoto({
                        name,
                        desc,
                        imageURI: Location,
                        clientID,
                    })
                    await clientPhoto.save()
                    
                    const updatedClient = await db.Client.findByIdAndUpdate(
                        { _id: clientID },
                        { $push: { 'completionPhotos': clientPhoto } }
                    ).populate('completionPhotos')
                    if (!updatedClient) res.status(500).send({ error: 'Sorry, there was a problem posting your message' })
                    res.status(200).json(clientPhoto)
                }
                if(trainerID) {
                    const trainerPhoto = new db.TrainerPhoto({
                        name,
                        desc,
                        imageURI: Location,
                        trainerID,
                        equipmentNeeded,
                        isStretch,
                        isExercise,
                        isUpperBody,
                        isLowerBody,
                        isFullBody,
                        isCore,
                        isArms,
                        isBack,
                        isButt,
                        isCalves,
                        isChest,
                        isHands,
                        isLegs,
                        isNeck,
                        isShoulders,
                    })
                    await trainerPhoto.save()
                    
                    const updatedTrainer = await db.Trainer.findByIdAndUpdate(
                        { _id: trainerID },
                        { $push: { 'routinePhotos': trainerPhoto } }
                    ).populate('routinePhotos')
                    if (!updatedTrainer) res.status(500).send({ error: 'Sorry, there was a problem posting your photo' })
                    res.status(200).json(trainerPhoto)
                }
        })
    },
    uploadImageAsProfileImage: async (req, res, next) => {
        const { clientID, trainerID, name, desc } = req.body
        if (!req.file) {
            return res.status(403).send('expect 1 file upload named file').end()
        }
        let file = req.file

        if (!/^image\/(jpe?g|png|gif)$/i.test(file.mimetype)) {
            return res.status(403).send('expect image file').end()
        }

        let pid = '10000' + parseInt(Math.random() * 10000000)

        uploadToS3(file, pid,
            async (err, data) => {
                if (err) {
                    console.error(err);
                    return res.status(500).send('failed to upload to s3').end()
                }
                const { Location } = data
                if(clientID) {
                    const clientPhoto = new db.ClientPhoto({
                        name,
                        desc,
                        imageURI: Location,
                        clientID,
                    })
                    const profilePhoto = await clientPhoto.save()
                    
                    const updatedClient = await db.Client.findByIdAndUpdate(
                        { _id: clientID },
                        { $push: { 'profilePictures': clientPhoto } }
                    ).populate({
                        path: 'profilePictures'
                    })
                    if (!updatedClient) res.status(500).send({ error: 'Sorry, there was a problem posting your message' })
                    res.status(200).json(profilePhoto)
                }
                if(trainerID) {
                    const trainerPhoto = new db.TrainerPhoto({
                        name,
                        desc,
                        imageURI: Location,
                        trainerID,
                    })
                    const profilePhoto = await trainerPhoto.save()
                    
                    const updatedTrainer = await db.Trainer.findByIdAndUpdate(
                        { _id: trainerID },
                        { $push: { 'profilePictures': trainerPhoto } }
                    ).populate('profilePictures')
                    if (!updatedTrainer) res.status(500).send({ error: 'Sorry, there was a problem posting your photo' })
                    res.status(200).json(profilePhoto)
                }
        })
    }
}