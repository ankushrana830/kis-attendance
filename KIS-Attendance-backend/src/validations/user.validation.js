const Joi = require('@hapi/joi');
const { password, objectId } = require('./custom.validation');

const addEmployee = {
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    name: Joi.string().required(),
    emp_id: Joi.string().required(),
    phone: Joi.number().required(),
    doj: Joi.date().required(),
    dob: Joi.date(),
    designation: Joi.string().required(),
    profile_image: Joi.string(),
    in_time: Joi.string().required(),
    out_time: Joi.string().required(),
    working_hour: Joi.string().required(),
    password: Joi.string().required().custom(password),
    role: Joi.string().required().custom(objectId),
    status: Joi.boolean().required(),
    allotted_leaves: Joi.number()
  }),
};
const uploadImage = {
  body: Joi.object().keys({
    profile_image: Joi.string(),
  }),
};


const deleteEmployee = {
  body: Joi.object().keys({
    userId: Joi.array().required().custom(objectId),
  }),
};

module.exports = {
  addEmployee,
  deleteEmployee,
  uploadImage,
};
