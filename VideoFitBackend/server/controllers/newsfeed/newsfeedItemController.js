import db from '../../models'

const newsfeedItemController = {}

module.exports = {
    // ADD NEWSFEED ITEM
    postAddNewsfeedItem: async (req, res, next) => {
        console.log('newsfeedItemController.postAddNewsfeedItem() called!')
        const { newsfeedId, clientId, text, photo } = req.body
        if (!newsfeedId || !clientId || !text ) return res.status(400).json({ error: 'Must provide newsfeedId, clientId, and text' })
        const newsfeedItem = new db.NewsfeedItem({
            newsfeedId,
            clientId,
            text,
            photo,
        })
        await newsfeedItem.save()
        if (!newsfeedItem) return res.status(500).json({ error: 'Something went wrong posting to the newsfeed' })
        const newsfeedItems = await db.NewsfeedItem.find({ newsfeedId })
        if (!newsfeedItems) return res.status(500).json({ error: 'Something went wrong retreiving the newsfeed' })
        return res.status(200).send(newsfeedItems)
    },
    // UPDATE NEWSFEED ITEM
    putUpdateNewsfeedItem: async (req, res, next) => {
        console.log('newsfeedItemController.putUpdateNewsfeedItem() called!')
        const { _id } = req.body
        if (!_id) return res.status(400).json({ error: 'Must provide _id' })
        const updatedItem = await db.NewsfeedItem.updateOne({ _id }, req.body)
        if (!updatedItem) return res.status(500).json({ error: 'Could not update the item' })
        const newsfeedItems = await db.NewsfeedItem.find({ trainerId: 'updatedItem.trainerId' })
        if (!newsfeedItems) return res.status(500).json({ error: 'Something went wrong retrieving the newsfeed' })
        return res.status(200).send(newsfeedItems)
    },
}