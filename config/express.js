'use strict';

const express = require('express');
const logger = require('morgan');
const path = require('path');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const compress = require('compression');
const methodOverride = require('method-override');
const cors = require('cors');
const uuid = require('uuid');
const httpStatus = require('http-status');
const expressSession = require('express-session');
const expressWinston = require('express-winston');
const expressValidation = require('express-validation');
const helmet = require('helmet');
const winstonInstance = require('./winston');
const passport = require('passport');
const { OIDCStrategy } = require('passport-azure-ad');
const favicon = require('serve-favicon');


const routes = require('../server/routes/index.route');
const config = require('./config');
const APIErrorHelper = require('../server/helpers/error.helper');

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
    const error = new ErrorHelper(unifiedErrorMessage, err.status, true);
    return next(error);
  } else if (!(err instanceof Helper)) {
    const error = new ErrorHelper(err.message, err.status, err.isPublic);
    return next(error);
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

module.exports = app;
