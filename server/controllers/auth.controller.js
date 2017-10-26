import jwt from 'jsonwebtoken';
import httpStatus from 'http-status';
import APIError from '../helpers/APIError';
import config from '../../config/config';

function redirectSignIn(req, res, next) {
  
  // const err = new APIError('Authentication error', httpStatus.UNAUTHORIZED, true);
  // return next(err);
}

function authorizedCallback(req, res, next) {
  return res.json(req.body);
}

export default { redirectSignIn, authorizedCallback };
