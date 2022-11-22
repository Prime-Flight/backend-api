require('dotenv').config();

const {
  DB_USERNAME_DEV,
  DB_PASSWORD_DEV,
  DB_NAME_DEV,
  DB_HOST_DEV,
  DB_PORT_DEV,
  DB_USERNAME_STAGING,
  DB_PASSWORD_STAGING,
  DB_NAME_STAGING,
  DB_HOST_STAGING,
  DB_PORT_STAGING,
  DB_USERNAME_PROD,
  DB_PASSWORD_PROD,
  DB_NAME_PROD,
  DB_HOST_PROD,
  DB_PORT_PROD,
  DB_DIALECT = 'postgres'
} = process.env;

module.exports = {
  "development": {
    "username": DB_USERNAME_DEV,
    "password": DB_PASSWORD_DEV,
    "database": DB_NAME_DEV,
    "host": DB_HOST_DEV,
    "port": DB_PORT_DEV,
    "dialect": DB_DIALECT
  },
  "test": {
    "username": DB_USERNAME_STAGING,
    "password": DB_PASSWORD_STAGING,
    "database": DB_NAME_STAGING,
    "host": DB_HOST_STAGING,
    "port": DB_PORT_STAGING,
    "dialect": DB_DIALECT
  },
  "production": {
    "username": DB_USERNAME_PROD,
    "password": DB_PASSWORD_PROD,
    "database": DB_NAME_PROD,
    "host": DB_HOST_PROD,
    "port": DB_PORT_PROD,
    "dialect": DB_DIALECT
  }
};
