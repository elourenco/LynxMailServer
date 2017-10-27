'use strict';

const Joi = require('joi');
// MONGOOSE_DEBUG: Joi.boolean()
// .when('NODE_ENV', {
//   is: Joi.string().equal('development'),
//   then: Joi.boolean().default(true),
//   otherwise: Joi.boolean().default(false)
// }),
// JWT_SECRET: Joi.string().required()
// .description('JWT Secret required to sign'),
// MONGO_HOST: Joi.string().required()
// .description('Mongo DB host url'),
// MONGO_PORT: Joi.number()
// .default(27017)

// require and configure dotenv, will load vars in .env in PROCESS.ENV
require('dotenv').config();

// define validation for all the env vars
const envVarsSchema = Joi.object({
  NODE_ENV: Joi.string()
    .allow(['development', 'production', 'test', 'provision'])
    .default('development'),
  PORT: Joi.number()
    .default(4040),
  JWT_SECRET: Joi.string()
    .required()
    .description('JWT Secret required to sign'),
  MS_REDIRECT_URL: Joi.string()
    .required()
    .description('Required Microsoft RedirectTo URL'),
  MS_CLIENT_ID: Joi.string()
    .required()
    .description('Required Microsoft clientID URL'),
  MS_SECRET_ID: Joi.string()
    .required()
    .description('Required Microsoft secretId URL')
}).unknown()
  .required();

const { error, value: envVars } = Joi.validate(process.env, envVarsSchema);
if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

// mongooseDebug: envVars.MONGOOSE_DEBUG,
// jwtSecret: envVars.JWT_SECRET,
// mongo: {
//   host: envVars.MONGO_HOST,
//   port: envVars.MONGO_PORT
// }

const config = {
  env: envVars.NODE_ENV,
  port: envVars.PORT,
  jwtSecret: envVars.JWT_SECRET,
  strategyOutlook: 'azuread-openidconnect',
  credsOIDCStrategy:{
    redirectUrl: envVars.MS_REDIRECT_URL,
    clientID: envVars.MS_CLIENT_ID,
    clientSecret: envVars.MS_SECRET_ID,
    identityMetadata: 'https://login.microsoftonline.com/common/v2.0/.well-known/openid-configuration',
    allowHttpForRedirectUrl: true, // For development only
    responseType: 'code',
    validateIssuer: false, // For development only
    responseMode: 'query',
    scope: ['User.Read', 'Mail.Send', 'Mail.Read', 'Files.ReadWrite']
  }
};

module.exports = config;
