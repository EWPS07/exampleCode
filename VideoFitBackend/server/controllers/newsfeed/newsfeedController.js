import db from '../../models'

const newsfeedController = {}

module.exports = {
    // CREATE NEWSFEED
    postAddNewsfeed: async (req, res, next) => {
        console.log('newsfeedController.postAddNewsfeed() called!')
        const { trainerId } = req.body
        if (!trainerId) return res.status(400).json({ error: 'Must provide trainerId' })
        const newsfeed = new db.Newsfeed({
            trainerId,
        })
        await newsfeed.save()
        if (!newsfeed) return res.status(500).json({ error: 'Something went wrong creating the newsfeed' })
        const updatedTrainer = await db.Trainer.updateOne({ _id: trainerId }, { newsfeedId: newsfeed._id })
        if (!updatedTrainer) return res.status(500).json({ error: 'There was a problem updated the trainer profile' })
        return res.status(200).send(newsfeed)
    },
    // GET NEWSFEED
    postGetNewsfeed: async (req, res, next) => {
        console.log('newsfeedController.posGetNewsFeed() called!')
        const { newsfeedId } = req.body
        if (!newsfeedId) return res.status(400).json({ error: 'Must provide newsfeedId' })
        const newsfeedItems = await db.NewsfeedItem.find({ newsfeedId })
        if (!newsfeedtems) return res.status(500).json({ error: 'There was a problem retreiving the newsfeed' })
        return res.status(200).send(newsfeedItems)
    }
}