const Joi = require('@hapi/joi');
const { objectId } = require('./custom.validation');

const checkIn = {
  body: Joi.object().keys({
    on_leave: Joi.boolean().required(),
    work_from: Joi.string().required(),
  }),
};

const breakStart = {
  body: Joi.object().keys({
    reason: Joi.string().required(),
  }),
};


const getCurrentMonthAttendence = {
  params: Joi.object().keys({
    userId: Joi.string().required().custom(objectId),
  }),
};

module.exports = {
  checkIn,
  breakStart,
  getCurrentMonthAttendence,
};
