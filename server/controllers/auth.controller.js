import passport from 'passport';
import httpStatus from 'http-status';
import APIError from '../helpers/APIError';
import MSGraph from '../helpers/MSGraph';
import config from '../../config/config';

function signIn(req, res, next) {
  
}

function signOut(req, res, next) {
  req.session.destroy(() => {
    req.logOut();
    res.clearCookie('graphNodeCookie');
    res.status(200);
  });
}

function token(req, res, next) {
  MSGraph.getUserData(req.user.accessToken, (err, user) => {
    if (!err) {
      req.user.profile.displayName = user.body.displayName;
      req.user.profile.emails = [{ address: user.body.mail || user.body.userPrincipalName }];
      return res.json(req.user.profile);
    } else {
      const err = new APIError('Authentication error', httpStatus.UNAUTHORIZED, true);
      return next(err);
    }
  });
}

function signError(req, res, next) {
  res.json('Error SignError');
}

export default { signIn, signOut, signError, token };
