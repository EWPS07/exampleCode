import * as types from '../constants/actionTypes'
import axios from 'axios'
const URL = 'http://localhost:8000/api'

export const trainerSignupThunk = trainer => {
    console.log('TRAINER COMING IN', trainer)
    return async dispatch => {
        dispatch({
            type: types.TRAINER_SIGNUP_REQUESTED,
        })
        try {
            trainer = await axios.post(`${ URL }/trainer/signup`, { ...trainer })
            console.log('trainerSignupThunk Raw Response :', trainer)
            localStorage.setItem('trainer', trainer.data.token)
            return dispatch({
                type: types.TRAINER_SIGNUP_SUCCESS,
                trainer: trainer.data.trainer,
            })
        } catch(error) {
            return dispatch({
                type: types.TRAINER_SIGNUP_FAILURE,
                error,
            })
        }
    }
}