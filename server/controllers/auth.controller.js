import passport from 'passport';
import httpStatus from 'http-status';
import APIError from '../helpers/APIError';
import MSGraph from '../helpers/MSGraph';
import config from '../../config/config';

function token(req, res, next) {
  passport.authenticate('azuread-openidconnect', { failureRedirect: '/' }),
  (req, res) => {
    MSGraph.getUserData(req.user.accessToken, (err, user) => {
      if (!err) {
        req.user.profile.displayName = user.body.displayName;
        req.user.profile.emails = [{ address: user.body.mail || user.body.userPrincipalName }];
        return res.json(req.user.profile);
      } else {
        const err = new APIError('[Token]', httpStatus.INTERNAL_SERVER_ERROR);
        return res.json(err)
      }
    });
  }
}

function redirectSignIn(req, res, next) {
  passport.authenticate('azuread-openidconnect', { failureRedirect: '/' }),
  (req, res) => {
    return res.json(req.user.profile);
  }
  // const err = new APIError('Authentication error', httpStatus.UNAUTHORIZED, true);
  // return next(err);
}

function authorizedCallback(req, res, next) {
  return res.json(req.body);
}

export default { token, redirectSignIn, authorizedCallback };
