import express from 'express';
import validate from 'express-validation';
import expressJwt from 'express-jwt';
import paramValidation from '../../config/param-validation';
import passport from 'passport';
import authCtrl from '../controllers/auth.controller';
import config from '../../config/config';

const router = express.Router();

router.route('/sign-in')
  .get(authCtrl.signIn);

router.router('/sign-out')
  .get(authCtrl.signOut)

export default router;
