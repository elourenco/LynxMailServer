'use strict';

const passport = require('passport');
const httpStatus = require('http-status');
const ErrorHelper = require('../helpers/error.helper');
const MSGraph = require('../providers/outlook/microsofit-graph');
const config = require('../../config/config');

function signIn(req, res, next) {
  res.status(200);
}

function signOut(req, res, next) {
  req.session.destroy(() => {
    req.logOut();
    res.clearCookie('graphNodeCookie');
    res.status(200);
  });
}

function token(req, res, next) {
  MSGraph.getUserData(req.user.accessToken)
    .then(user => {
      if (!err) {
        req.user.profile.displayName = user.body.displayName;
        req.user.profile.emails = [{ address: user.body.mail || user.body.userPrincipalName }];
        return res.json(req.user.profile);
      } else {
        const err = new ErrorHelper('Authentication error', httpStatus.UNAUTHORIZED, true);
        return next(err);
      }
    });
}

function signError(req, res, next) {
  res.json('Error SignError');
}

module.exports = {
  signIn,
  signOut,
  signError,
  token
};
