import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { trainerSignupThunk } from '../../redux/actions/trainerActions'
import formError from './form-error'

class TrainerSignupForm extends Component {
    static propTypes = {
        trainer: PropTypes.object.isRequired,
        trainerSignupThunk: PropTypes.func.isRequired,
    }
    constructor() {
        super()

        this.state = {
            firstName: '',
            lastName: '',
            age: '',
            email: '',
            password: '',
            passwordConf: '',
            trainingSince: '',
            photo: '',
        }
    }
    render() {
        const { trainer } = this.props
        console.log('trainer', trainer)
        const formStyles = {
            border: "solid 1px black",
            borderRadius: "4px",
            margin: "0 auto",
            padding: "2%",
            width: "50%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-around"
        }
        const inputStyles={
            margin: '1% auto',
            borderRadius: '4px',
            fontSize: '24px',
            border: 'solid 1px black',
            padding: '2%',
        }
        return (
            <div className="TrainerSignupForm">
                <h1>Signup to be a Trainer on VideoFit and always stay connected to your clients!</h1>
                <form style={ formStyles }>
                    <input name="email" style={ inputStyles } onChange={ this._handleFormInputs } value={ this.state.email } type="email" placeholder="email" />
                    <input name="firstName" style={ inputStyles } onChange={ this._handleFormInputs } value={ this.state.firstName } type="text" placeholder="first name" />
                    <input name="lastName" style={ inputStyles } onChange={ this._handleFormInputs } value={ this.state.lastName } type="text" placeholder="last name" />
                    <input name="password" style={ inputStyles } onChange={ this._handleFormInputs } value={ this.state.password } type="password" placeholder="password" />
                    <input name="passwordConf" style={ inputStyles } onChange={ this._handleFormInputs } value={ this.state.passwordConf } type="password" placeholder="passwordConf" />
                    <input name="age" style={ inputStyles } onChange={ this._handleFormInputs } value={ this.state.age } type="text" placeholder="age" />
                    <input name="trainingSince" style={ inputStyles } onChange={ this._handleFormInputs } value={ this.state.trainingSince } type="text" placeholder="training since" />
                    <input name="photo" style={ inputStyles } onChange={ this._handleFormInputs } value={ this.state.photo } type="file" placeholder="photo" />
                    <button type="submit" style={ inputStyles } onClick={ this._handleSubmit }>Submit</button>
                </form>
            </div>
        )
    }
    _handleFormInputs = e => {
        const targetName = e.target.name
        let valueToUpdate = {}
        
        getTarget()
        this.setState({
            ...this.state,
            ...valueToUpdate,
        })
        console.log(this.state)

        function getTarget() {
            switch (targetName) {
                case 'email':
                    valueToUpdate.email = e.target.value
                    return valueToUpdate
                case 'firstName':
                    valueToUpdate.firstName = e.target.value
                    return valueToUpdate
                case 'lastName':
                    valueToUpdate.lastName = e.target.value
                    return valueToUpdate
                case 'password':
                    valueToUpdate.password = e.target.value
                    return valueToUpdate
                case 'passwordConf':
                    valueToUpdate.passwordConf = e.target.value
                    return valueToUpdate
                case 'age':
                    valueToUpdate.age = e.target.value
                    return valueToUpdate
                case 'trainingSince':
                    valueToUpdate.trainingSince = e.target.value
                    return valueToUpdate
                case 'photo':
                    valueToUpdate.photo = e.target.value
                    return valueToUpdate
                default:
                    return valueToUpdate
            }
        }
    }
    _handleSubmit = e => {
        e.preventDefault()
        console.log(`Submitting ${ this.state }`)
    }
}

const mapStateToProps = state => ({
    trainer: state.trainer,
})
const mapDispatchToProps = dispatch => (
    bindActionCreators({
        trainerSignupThunk,
    },
    dispatch)
)
export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(TrainerSignupForm)