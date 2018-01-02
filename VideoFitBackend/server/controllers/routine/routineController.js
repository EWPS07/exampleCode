import db from '../../models'
const routineTaskController = {}

// CREATE NEW ROUTINE
module.exports = {
    // CREATE NEW ROUTINE
    postNewRoutine: async (req, res, next) => {
        const { trainerID, clientID, dayOfWeek } = req.body
        if (!trainerID || !clientID || !dayOfWeek) return res.status(400).json({ error: 'Must provide trainerID, clientID, and dayOfWeek' })
        let routine = new db.Routine({
            _creator: trainerID,
            _clientId: clientID,
            dayOfWeek,
        })
        routine = await routine.save()
        if (!routine) return res.status(500).json({ error: 'Internal server error' })
        const updatedClient = db.Client.findByIdAndUpdate({ _id: clientID },
            { $push: { '_routines': routine._id } }
        )
        return res.status(200).json({ success: true, routine })
    },
    // GET A SINGLE ROUTINE
    postGetRoutineById: async (req, res, next) => {
        const { routineID } = req.body
        if (!routineID) return res.status(400).json({ error: 'Must provide a routineID' })
        const routine = await db.Routine.findById(routineID)
        if (!routine) return res.status(404).json({ error: 'Could not find the routine' })
        const routineTasks = await db.RoutineTask.find({ _routineId: routineID })
        if (!routineTasks) return res.status(400).json({ error: 'This routine does not have any tasks' })
        return res.status(200).send(routineTasks)
    },
    // GET ALL ROUTINES
    getAllRoutines: async (req, res, next) => {
        const routines = await db.Routine.find({})
        if (!routines) return res.status.json({ error: 'No routines found' })
        return res.status(200).send(routines)
    },
    // GET ALL ROUTINES SEPARATED BY DAY OF WEEK
    postGetAllRoutinesByDayOfWeek: async (req, res, next) => {
        const { clientID } = req.body
        if (!clientID) return res.status(400).json({ error: 'Must provide a clientID' })
        // Monday, Tuesday, Wednesday, Thursday, Friday, Saturday, Sunday, MonWedFri, TuesThurs, Weekend
        const allRoutines = await db.Routine.find({ _clientId: clientID })
        if (!allRoutines) return res.status(404).json({ error: 'No routines found' })

        const getDayGroups = day => (allRoutines.map((routine) => {
            if (routine.dayOfWeek === day) return routine})
            .filter((item) => item !== undefined))
        const Monday = getDayGroups('Monday')
        const Tuesday = getDayGroups('Tuesday')
        const Wednesday = getDayGroups('Wednesday')
        const Thursday = getDayGroups('Thursday')
        const Friday = getDayGroups('Friday')
        const Saturday = getDayGroups('Saturday')
        const Sunday = getDayGroups('Sunday')
        const MonWedFri = getDayGroups('MonWedFri')
        const TuesThurs = getDayGroups('TuesThurs')
        const Weekend = getDayGroups('Weekend')
        const Week = getDayGroups('Week')
        return res.status(200).send({
            Monday,
            Tuesday,
            Wednesday,
            Thursday,
            Friday,
            Saturday,
            Sunday,
            MonWedFri,
            TuesThurs,
            Weekend,
            Week,
        })
    },
    // UPDATE A ROUTINE
    putUpdateRoutine: async (req, res, next) => {
        const { _id } = req.body
        if (!_id) return res.status(400).json({ error: 'Must provide a valid id for the routine' })
        const routine = await db.Routine.findById(_id)
        if (!routine) return res.status(404).json({ error: 'No routine found' })
        const updatedRoutine = await db.Routine.findByIdAndUpdate(_id, req.body, { new: true })
        if (!updatedRoutine) return res.status(500).json({ error: 'Something went wrong trying to update the routine' })
        return res.status(200).send(updatedRoutine)
    },
    // DELETE A ROUTINE
    deleteRoutine: async (req, res, next) => {
        console.log('DELETE ROUTINE')
    }
}