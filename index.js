const serverless = require('serverless-http');
const app = require('./start');

module.exports.handler = serverless(app);
