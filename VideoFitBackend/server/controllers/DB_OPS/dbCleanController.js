import db from '../../models'

const dbOpsController = {}

module.exports = {
    getCleanTasks: async (req, res, next) => {
        console.log('dbOpsController.getCleanTasks() called!')
        const tasksRemoved = await db.Task.remove({})
        if (!tasksRemoved) return res.status(500).json({ error: 'Tasks removal unsuccessful' })
        return res.status(200).json({ success: true, tasksRemoved })
    },
    getCleanTrainers: async (req, res, next) => {
        console.log('dbOpsController.getCleanTrainers() called!')
        const trainersRemoved = await db.Trainer.remove({})
        if (!trainersRemoved) return res.status(500).json({ error: 'Trainers removal unsuccessful' })
        return res.status(200).json({ success: true, trainersRemoved })
    },
    getCleanClients: async (req, res, next) => {
        console.log('dbOpsController.getCleanClients() called!')
        const clientsRemoved = await db.Client.remove({})
        if (!clientsRemoved) return res.status(500).json({ error: 'Clients removal unsuccessful' })
        return res.status(200).json({ success: true, clientsRemoved })
    },
    getCleanRoutines: async (req, res, next) => {
        console.log('dbOpsController.getCleanRoutine() called!')
        const routinesRemoved = await db.Routine.remove({})
        if (!routinesRemoved) return res.status(500).json({ error: 'Routines removal unsuccessful' })
        const routineTasksRemoved = await db.RoutineTask.remove({})
        if (!routineTasksRemoved) return res.status(500).json({ error: 'Routine tasks removal unsuccessful' })
        return res.status(200).json({ success: true, routinesRemoved, routineTasksRemoved })
    },
    getCleanNewsfeeds: async (req, res, next) => {
        console.log('dbOpsController.getCleanNewsfeed() called!')
        const newsfeedRemoved = await db.Newsfeed.remove({})
        if (!newsfeedRemoved) return res.status(500).json({ error: 'Newsfeed removal unsuccessful' })
        const newsfeedItemRemoved = await db.NewsfeedItem.remove({})
        if (!newsfeedItemRemoved) return res.status(500).json({ error: 'Newsfeed item removal unsuccessful' })
        return res.status(200).json({ success: true, newsfeedRemoved })
    }
}