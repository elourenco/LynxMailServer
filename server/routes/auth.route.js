'use strict';

const express = require('express');
const validate = require('express-validation');
const expressJwt = require('express-jwt');
const paramValidation = require('../../config/param-validation');
const passport = require('passport');
const authCtrl = require('../controllers/auth.controller');
const config = require('../../config/config');

const router = express.Router();

router.route('/sign-in')
  .get(passport.authenticate(config.strategyOutlook, { failureRedirect: '/api/auth/sign-error' }), authCtrl.signIn);

router.route('/token')
  .get(passport.authenticate(config.strategyOutlook, { failureRedirect: '/api/auth/sign-error' }), authCtrl.token);

router.route('/sign-out')
  .get(authCtrl.signOut);

router.route('/sign-error')
  .get(authCtrl.signError);

module.exports = router;
