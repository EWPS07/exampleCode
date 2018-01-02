import db from '../../models'
const clientPhotoController = {}

module.exports = {
    getAllClientPhotos: async (req, res, next) => {
        const clientPhotos = await db.ClientPhoto.find({})
        if (!clientPhotos) return res.status(404).send({ error: 'Not found' })
        res.status(200).json(clientPhotos)
    },

    postGetClientPhotosById: async (req, res, next) => {
        const { clientID } = req.body
        const clientPhotos = await db.ClientPhoto.find({ clientID: clientID })
        if (!clientPhotos) return res.status(404).json({ error: 'No photos found'})
        return res.status(200).json(clientPhotos)
    },
}