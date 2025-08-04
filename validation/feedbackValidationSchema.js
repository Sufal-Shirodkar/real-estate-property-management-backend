const Joi = require('joi');


const feedbackValidationSchema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    rating: Joi.number().integer().min(1).max(5).required(),
    comment: Joi.string().allow('').trim().optional() // Allow empty string or be optional
});

const validateBodySchema = (req,res,next) =>{
    // console.log(req.body,">>>>>>>>>>");
    let parsedBody = req.body;
    if (Buffer.isBuffer(req.body)) {
        try {
            parsedBody = JSON.parse(req.body.toString());
        } catch (e) {
            console.error("Error parsing buffer as JSON:", e);
            return res.status(400).send({ errors: [{ message: "Invalid JSON format" }] });
        }
    }
    const {error} = feedbackValidationSchema.validate(parsedBody)
    if(error){
        const errors = error.details.map(detail => ({
            path: detail.path,
            message: detail.message
        }));
        return res.status(400).send({ errors });
    }
    next()
}

module.exports ={ validateBodySchema}