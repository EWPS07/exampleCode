import db from '../../models'
const routineTaskController = {}

module.exports = {
    // CREATE NEW ROUTINE TASK
    postNewRoutineTask: async (req, res, next) => {
        console.log('POST NEW ROUTINE TASK')
        const {
            name,
            section,
            duration,
            routineID,
            trainerID,
            warmUpTargetArea,
            workoutTargetArea,
            stretchTargetArea,
            equipmentNeeded
        } = req.body

        if (!routineID || !trainerID) return res.status(400).json({ error: 'Must provide routineID, trainerID, targetArea, and equipmentNeeded' })
        const routineTask =  new db.RoutineTask({
            _routineId: routineID,
            _creator: trainerID,
            name,
            section,
            duration,
            warmUpTargetArea,
            workoutTargetArea,
            stretchTargetArea,
            equipmentNeeded
        })
        await routineTask.save()
        const updatedRoutine = await db.Routine.findByIdAndUpdate(routineID, 
            { $push: { '_routineTasks': routineTask._id }}, { new: true }
        )
        if (!updatedRoutine) return res.status(500).json({ error: 'Something went wrong' })
        const routineTasks = await db.RoutineTask.find({ _routineId: routineID })
        return res.status(200).json({ success: true, routineTasks })
    },

    // UPDATE ROUTINE TASK
    putUpdateRoutineTask: async (req, res, next) => {
        const { _id } = req.body
        if (!_id) return res.status(400).json({ error: 'Must provide a valid id for the routineTask' })
        const routineTask = await db.RoutineTask.findById(_id)
        if (!routineTask) return res.status(404).json({ error: 'No routineTask found' })
        const updatedRoutineTask = await db.RoutineTask.findByIdAndUpdate(_id, req.body)
        if (!updatedRoutineTask) return res.status(500).json({ error: 'Something went wrong trying to update the routineTask' })
        const updatedRoutineTasks = await db.RoutineTask.find({ _routineId: updatedRoutineTask._routineId })
        return res.status(200).send(updatedRoutineTasks)
    },

    // DELETE ROUTINE TASK
    deleteRoutineTask: async (req, res, next) => {
        console.log('DELETE ROUTINE TASK')
    }
}