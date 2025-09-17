const Workout = require(`../models/WorkoutModel`)
const mongoose = require(`mongoose`)


// GET ALL workouts
const getWorkouts = async (req, res) => {
    // ex: finds all the workouts where the reps props is 20.
    //const workouts = await Workout.find({reps:20})

    // newest ones at the top
    const workouts = await Workout.find({}).sort({createAt: -1})

    res.status(200).json(workouts)
}


// GET a single workout
const getWorkout = async (req, res) => {
    const { id } = req.params

    // No valid Id
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({error: `No such workout`})
    }

    const workout = await Workout.findById(id)

    // In case can´t find that workout id
    if (!workout) {
        return res.status(404).json({error: `No such workout`})
    }

    res.status(200).json(workout)
}


// CREATE a new workout
const createWorkout = async (req, res) => {
    // Extrae title,load,reps del cuerpo de la petición(en este caso POSTMAN)
    const {title, load, reps} = req.body

    let emptyFields = []

    if (!title) {
        emptyFields.push('title')
    }

    if (!load) {
        emptyFields.push('load')
    }

    if (!reps) {
        emptyFields.push('reps')
    }

    if (emptyFields.length > 0){
        return res.status(400).json({error: 'Please fill in all the fields', emptyFields})
    }

    // add doc to db
    try{
        const workout = await Workout.create({title, load, reps})
        res.status(200).json(workout)
    }catch(error){
        res.status(400).json({error: error.message})
    }

    res.json({mssg: `POST a new workout`})
}


// DELETE a workout
const deleteWorkout = async (req, res) => {
    const {id} = req.params

     // No valid Id
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({error: `No such workout`})
    }

    const workout = await Workout.findOneAndDelete({_id: id})
    
    if (!workout) {
        return res.status(404).json({error: `No such workout`})
    }

    res.status(200).json(workout)
}


// UPDATE a workout
const updateWorkout = async (req, res) => {
     const {id} = req.params

     // No valid Id
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({error: `No such workout`})
    }

    const workout = await Workout.findOneAndUpdate({_id: id}, {
        ...req.body
    })

    if (!workout) {
        return res.status(404).json({error: `No such workout`})
    }

    res.status(200).json(workout)
}

// 
module.exports = {
    getWorkouts,
    getWorkout,
    createWorkout,
    deleteWorkout,
    updateWorkout
}