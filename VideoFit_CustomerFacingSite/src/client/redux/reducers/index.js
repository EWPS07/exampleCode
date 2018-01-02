import { combineReducers } from 'redux'
import { routerReducer } from 'react-router-redux'
import trainer from './trainerReducer'

export default combineReducers({
    routing: routerReducer,
    trainer,
})