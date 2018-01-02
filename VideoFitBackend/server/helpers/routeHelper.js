const Joi = require('joi')


module.exports = {
    validateBody: schema => {
        return (req, res, next) => {
            const result = Joi.validate(req.body, schema)
            if (result.error) {
                return res.status(400).json(result.error)
            }
            if (!req.value) {
                req.value = {}
            }
            req.value['body'] = result.value
            next()
        }
    },

    schemas: {
        clientAuthSchema: Joi.object().keys({
            photo: Joi.string(),
            firstName: Joi.string(),
            lastName: Joi.string(),
            email: Joi.string().email(),
            password: Joi.string(),
            passwordConf: Joi.string(),
            height: Joi.string(),
            weight: Joi.string(),
            gender: Joi.string(),
            DOB: Joi.string(),
            address: Joi.string(),
            phoneNumber: Joi.string(),
            zip: Joi.string(),
            progressPhotos: Joi.array(),
            fitnessGoal: Joi.string(),
        }),
        trainerAuthSchema: Joi.object().keys({
            photo: Joi.string(),
            firstName: Joi.string(),
            lastName: Joi.string(),
            email: Joi.string().email(),
            password: Joi.string(),
            passwordConf: Joi.string(),
            gender: Joi.string(),
            DOB: Joi.string(),
            baseFee: Joi.string(),
            phoneNumber: Joi.string(),
            address: Joi.string(),
            zip: Joi.string(),
            trainingSince: Joi.string(),
        }),
        clientSigninSchema: Joi.object().keys({
            email: Joi.string().required().email(),
            password: Joi.string().required(),
        }),
        trainerSigninSchema: Joi.object().keys({
            email: Joi.string().required().email(),
            password: Joi.string().required(),
        }),
        clientMessageSchema: Joi.object().keys({
            text: Joi.string().required(),
            img: Joi.string(),
            _creator: Joi.string().required()
        }),
        trainerMessageSchema: Joi.object().keys({
            text: Joi.string().required(),
            img: Joi.string(),
            _creator: Joi.string().required()
        }),
        taskSchema: Joi.object().keys({
            icon: Joi.string().required(),
            name: Joi.string().required(),
            desc: Joi.string().required(),
            dayOfWeek: Joi.string().required(),
            _creator: Joi.string().required(),
            _clientId: Joi.string().required(),
        }),
        routineSchema: Joi.object().keys({
            icon: Joi.string().required(),
            name: Joi.string().required(),
            desc: Joi.string().required(),
            _creator: Joi.string().required(),
            _clientId: Joi.string().required(),
        })
    }
}