const Joi = require('joi');

// Input validation function for schema
function validateEnvelope(envelope) {
    const schema = {
        title: Joi.string().min(3).required(),
        amount: Joi.number().min(1).required()

    };
    return Joi.validate(envelope, schema);

}

function updateEnvelope(envelope) {
    const schema = {
        amount: Joi.number().min(1).required()
              
    };
    return Joi.validate(envelope, schema);

}


module.exports = {
    validateEnvelope,
    updateEnvelope
}