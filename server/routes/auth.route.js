import express from 'express';
import validate from 'express-validation';
import expressJwt from 'express-jwt';
import paramValidation from '../../config/param-validation';
import passport from 'passport';
import authCtrl from '../controllers/auth.controller';
import config from '../../config/config';

const router = express.Router();

router.route('/sign-in')
  .get(passport.authenticate('azuread-openidconnect', { failureRedirect: '/api/auth/sign-error' }), authCtrl.signIn);

router.route('/token')
  .get(passport.authenticate('azuread-openidconnect', { failureRedirect: '/api/auth/sign-error' }), authCtrl.token);

router.route('/sign-out')
  .get(authCtrl.signOut);

router.route('/sign-error')
  .get(authCtrl.signError);

export default router;
