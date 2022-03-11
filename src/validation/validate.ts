import Joi from 'joi'

const suggestionSchema = Joi.object().keys({
    q: Joi.string().required(),
    latitude: Joi.number(),
    longitude: Joi.number(),
    radius:Joi.number(),
    sort:Joi.string().valid('distance','name')
});

const createForm = (req, res, next) => {
        const { error } = suggestionSchema.validate(req.body);
        if (error) {
            return res.status(400).json({
                status: 400,
                error: error.details[0].message,
            });
        }
        next();
    };

    export default createForm;