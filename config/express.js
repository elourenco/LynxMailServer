import express from 'express';
import logger from 'morgan';
import path from 'path';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import compress from 'compression';
import methodOverride from 'method-override';
import cors from 'cors';
import uuid from 'uuid';
import httpStatus from 'http-status';
import expressSession from 'express-session';
import expressWinston from 'express-winston';
import expressValidation from 'express-validation';
import helmet from 'helmet';
import winstonInstance from './winston';
import passport from 'passport';
import { OIDCStrategy } from 'passport-azure-ad';
import favicon from 'serve-favicon';


import routes from '../server/routes/index.route';
import config from './config';
import APIError from '../server/helpers/APIError';

const app = express();
const users = {};

passport.use(new OIDCStrategy(config.credsOIDCStrategy, (iss, sub, profile, accessToken, refreshToken, done) => {
  done(null, {
    profile,
    accessToken,
    refreshToken
  });
}));

passport.serializeUser((user, done) => {
  const id = uuid.v4();
  users[id] = user;
  done(null, id);
});

passport.deserializeUser((id, done) => {
  const user = users[id];
  done(null, user);
});

if (config.env === 'development') {
  app.use(logger('dev'));
}
app.use(expressSession({ secret: 'SECRET' }));
app.use(passport.initialize());
app.use(passport.session())
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(compress());
app.use(methodOverride());
// app.use(favicon(path.join(__dirname, 'public', 'img', 'favicon.ico')));
app.use(express.static(path.join(__dirname, '../server/public')));
app.use(helmet());
app.use(cors());

if (config.env === 'development') {
  expressWinston.requestWhitelist.push('body');
  expressWinston.responseWhitelist.push('body');
  app.use(expressWinston.logger({
    winstonInstance,
    meta: true,
    msg: 'HTTP {{req.method}} {{req.url}} {{res.statusCode}} {{res.responseTime}}ms',
    colorStatus: true
  }));
}

app.use('/api', routes);

app.use((err, req, res, next) => {
  if (err instanceof expressValidation.ValidationError) {
    const unifiedErrorMessage = err.errors.map(error => error.messages.join('. ')).join(' and ');
    const error = new APIError(unifiedErrorMessage, err.status, true);
    return next(error);
  } else if (!(err instanceof APIError)) {
    const apiError = new APIError(err.message, err.status, err.isPublic);
    return next(apiError);
  }
  return next(err);
});

if (config.env !== 'test') {
  app.use(expressWinston.errorLogger({
    winstonInstance
  }));
}

app.use((err, req, res, next) =>
  res.status(err.status).json({
    message: err.isPublic ? err.message : httpStatus[err.status],
    stack: config.env === 'development' ? err.stack : {}
  })
);

export default app;
