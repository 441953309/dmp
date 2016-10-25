const path = require('path');

const config = {
  env: process.env.NODE_ENV || 'dev',
  logType: process.env.LOGTYPE || 'dev',
  root: path.normalize(__dirname + '../../'),
  session:{
    secrets: '0a6b944d-d2fb-46fc-a85e-0295c986cd9f',
  },

  host: 'http://d2.mobaders.com',
  // db: 'mongodb://localhost/mobaders'
  db: 'mongodb://mobaders:2283250@dds-2zedcc03374ee6c41.mongodb.rds.aliyuncs.com:3717,dds-2zedcc03374ee6c42.mongodb.rds.aliyuncs.com:3717/mobaders?replicaSet=mgset-2002845'
};

module.exports = config;
