const BUCKET_NAME = process.env.AMZN_BUCKET
const ACCESS_KEY = process.env.AMZN_ACCESS_KEY
const SECRET_ACCESS_KEY = process.env.AMZN_SECRET_ACCESS_KEY
const AWS = require('aws-sdk')
const fs = require('fs')
const path = require('path')
import db from '../../models'
const awsVideoUploadController = {}

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
            // ContentType: 'application/octet-stream', // force download if it's accessed as a top location
        })
        .send(callback)
}
module.exports = {
    uploadVideo: async (req, res, next) => {
        const { clientID, trainerID, name, desc } = req.body
        if (!req.file) {
            return res.status(403).send('expect 1 file upload named file').end()
        }
        let file = req.file

        let pid = '10000' + parseInt(Math.random() * 10000000)

        uploadToS3(file, pid,
            async (err, data) => {
                if (err) {
                    console.error(err);
                    return res.status(500).send('failed to upload to s3').end()
                }
                const { Location } = data
                if(clientID) {
                    const clientVideo = new db.ClientVideo({
                        name,
                        desc,
                        videoURI: Location,
                        clientID,
                    })
                    await clientVideo.save()
                    
                    const updatedClient = await db.Client.findByIdAndUpdate(
                        { _id: clientID },
                        { $push: { 'videos': clientVideo } }
                    ).populate('videos')
                    if (!updatedClient) res.status(500).send({ error: 'Sorry, there was a problem posting your message' })
                    res.status(200).json(clientVideo)
                }
                if(trainerID) {
                    const trainerVideo = new db.TrainerVideo({
                        name,
                        desc,
                        videoURI: Location,
                        trainerID,
                    })
                    await trainerVideo.save()
                    
                    const updatedTrainer = await db.Trainer.findByIdAndUpdate(
                        { _id: trainerID },
                        { $push: { 'videos': trainerVideo } }
                    ).populate('videos')
                    if (!updatedTrainer) res.status(500).send({ error: 'Sorry, there was a problem posting your video' })
                    res.status(200).json(trainerVideo)
                }
        })
    },
    uploadRoutineOrCompletionVideo: async (req, res, next) => {
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

        let pid = '10000' + parseInt(Math.random() * 10000000)

        uploadToS3(file, pid,
            async (err, data) => {
                if (err) {
                    console.error(err);
                    return res.status(500).send('failed to upload to s3').end()
                }
                const { Location } = data
                if(clientID) {
                    const clientVideo = new db.ClientVideo({
                        name,
                        desc,
                        videoURI: Location,
                        clientID,
                    })
                    await clientVideo.save()
                    
                    const updatedClient = await db.Client.findByIdAndUpdate(
                        { _id: clientID },
                        { $push: { 'completionVideos': clientVideo } }
                    ).populate('completionVideos')
                    if (!updatedClient) res.status(500).send({ error: 'Sorry, there was a problem posting your message' })
                    res.status(200).json(clientVideo)
                }
                if(trainerID) {
                    const trainerVideo = new db.TrainerVideo({
                        name,
                        desc,
                        videoURI: Location,
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
                    await trainerVideo.save()
                    
                    const updatedTrainer = await db.Trainer.findByIdAndUpdate(
                        { _id: trainerID },
                        { $push: { 'routineVideos': trainerVideo } }
                    ).populate('routineVideos')
                    if (!updatedTrainer) res.status(500).send({ error: 'Sorry, there was a problem posting your video' })
                    res.status(200).json(trainerVideo)
                }
        })
    }
}