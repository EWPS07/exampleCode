import db from '../../models'
const taskController = {}

module.exports = {
    // CREATE NEW TASK
    postNewTask: async (req, res, next) => {
        const { icon, name, desc, dayOfWeek, _creator, _clientId } = req.value.body
        let task = new db.Task({
            icon,
            name,
            desc,
            dayOfWeek,
            _creator,
            _clientId,
        })
        task = await task.save()
        const updatedClient = db.Client.findByIdAndUpdate(
            _clientId,
            { $push: { '_tasks': task._id } }
        )
        return res.status(200).json({ success: true, task })
    },

    // GET ALL TASKS
    getAllTasks: async (req, res, next) => {
        const tasks = await db.Task.find({})
        .populate({
            path: '_creator',
            select: '-_id',
        })
        if (!tasks) return res.status(404).send({ error: 'Not found' })
        res.status(200).json(tasks)
    },

    // UPDATE TASK
    putUpdateTask: async (req, res, next) => {
        const { _id } = req.body
        if (!_id) return res.status(400).json({ error: 'No _id provided' })
        const taskToUpdate = await db.Task.findByIdAndUpdate(_id, { ...req.body })
        if (!taskToUpdate) return res.status(404).json({ error: 'No task found'})
        const updatedTask = await db.Task.findById(_id)
        if (!updatedTask) return res.status(500).json({ error: 'Internal server error' })
        return res.status(200).send(updatedTask)
    },
    
    // DELETE TASK
    deleteTask: async (req, res, next) => {
        console.log('taskController.deleteTask')
    }
}
