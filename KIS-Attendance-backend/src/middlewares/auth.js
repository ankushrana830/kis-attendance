const passport = require('passport');
const httpStatus = require('http-status');
const JWT = require('jsonwebtoken');
const ApiError = require('../utils/ApiError');
const { roleRights } = require('../config/roles');
const config = require('../config/config');

const verifyCallback = (req, resolve, reject, requiredRights) => async (err, user, info) => {
  if (err || info || !user) {
    return reject(new ApiError(httpStatus.UNAUTHORIZED, 'Please authenticate'));
  }
  req.user = user;
  if (requiredRights.length) {
    const userRights = roleRights.get(user.role.role);
    const hasRequiredRights = requiredRights.every((requiredRight) => userRights.includes(requiredRight));
    if (!hasRequiredRights && req.params.userId !== user.id) {
      return reject(new ApiError(httpStatus.FORBIDDEN, 'Forbidden'));
    }
  }

  resolve();
};

const auth = (...requiredRights) => async (req, res, next) => {
  return new Promise((resolve, reject) => {
    passport.authenticate('jwt', { session: false }, verifyCallback(req, resolve, reject, requiredRights))(req, res, next);
  })
    .then(() => {
      next();
    })
    .catch((err) => next(err));
};

const getUserIdToken = async (bearerToken) => {
  const token = bearerToken.split(' ');
  const Token = token[1];
  let userId = '';
  await JWT.verify(Token, config.jwt.secret, (err, payload) => {
    if (err) {
      throw new ApiError(httpStatus.UNAUTHORIZED, 'Incorrect');
    }
    userId = payload.sub;
  });
  return userId;
};

module.exports = { auth, getUserIdToken };
