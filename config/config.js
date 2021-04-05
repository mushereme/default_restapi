require('dotenv').config()

module.exports = {
  "development": {
    "username": process.env.DB_USERNAME,
    "password": process.env.DB_PASSWORD,
    "database": process.env.DB_DATABASE,
    "host": process.env.DB_HOST,
    "dialect": process.env.DB_DIALECT,
    "operatorsAliases": process.env.DB_OPERATOR,
    "timezone": process.env.DB_TIMEZONE
  },
  "test": {
    "username": process.env.DB_USERNAME,
    "password": process.env.DB_PASSWORD,
    "database": process.env.DB_DATABASE,
    "host": process.env.DB_HOST,
    "dialect": process.env.DB_DIALECT,
    "operatorsAliases": process.env.DB_OPERATOR,
    "logging": process.env.DB_LOGGING,
    "timezone": process.env.DB_TIMEZONE
  },
  "production": {
    "username": process.env.DB_USERNAME,
    "password": process.env.DB_PASSWORD,
    "database": process.env.DB_DATABASE,
    "host": process.env.DB_HOST,
    "dialect": process.env.DB_DIALECT,
    "operatorsAliases": process.env.DB_OPERATOR,
    "logging": process.env.DB_LOGGING,
    "timezone": process.env.DB_TIMEZONE
  }
}
