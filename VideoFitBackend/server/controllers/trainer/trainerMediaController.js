import db from '../../models'
const trainerMediaController = {}

module.exports = {
    // GET MEDIA LIBRARY
    postGetMediaLibrary: async (req, res, next) => {
        const { trainerID } = req.body
        if (!trainerID) return res.status(400).json({ error: 'Must provide trainerID' })
        const stretchPhotos = await db.TrainerPhoto.find({ trainerID, isStretch: true })
        const exercisePhotos = await db.TrainerPhoto.find({ trainerID, isExercise: true })
        const stretchVideos = await db.TrainerVideo.find({ trainerID, isStretch: true })
        const exerciseVideos = await db.TrainerVideo.find({ trainerID, isExercise: true })
        if (!stretchPhotos && !exercisePhotos && !stretchVideos && !exerciseVideos) return res.status(404).json({ error: 'No media found' })
        return res.status(200).json({ StretchMedia: [ ...stretchPhotos, ...stretchVideos ], ExerciseMedia: [ ...exercisePhotos, ...exerciseVideos ]})
    }
}