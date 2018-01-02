import * as types from '../constants/actionTypes'   

const initialState = {
    error: null,
    loading: false,
    trainer: {
        isSignedIn: false,
        email: '',
        password: '',
        passwordConf: '',
    }
}

export default (state = initialState, action) => {
    switch (action.type) {
        case types.TRAINER_SIGNUP_REQUESTED:
            return {
                ...state,
                loading: true,
                error: null,
            }
        case types.TRAINER_SIGNUP_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.error
            }
        case types.TRAINER_SIGNUP_SUCCESS:
            return {
                ...state,
                loading: false,
                trainer: {
                    ...action.trainer,
                    isSignedIn: true,
                },
            }
        default: 
            return state
    }
}