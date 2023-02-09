const Joi = require('joi')
const validate = require('./validate');
const enumEl = ["reserve", "times_up", "cancel", "activated"]

const reserveSchema = Joi.object({
    slotName: Joi.string().trim().required(),
    // floor:Joi.string().trim().required(),
    timeStart: Joi.date().iso().greater('now').required(),
    timeEnd: Joi.date().iso().greater('now').required(),
    reserveCost: Joi.decimal().required(),
    isPaid: Joi.boolean().required(),
    status: Joi.string().valid(...enumEl).required()
})

exports.validateReserve = validate(reserveSchema);