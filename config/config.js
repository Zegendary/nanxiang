const path = require('path');

module.exports = {
  development: {
    storage: path.join(__dirname, 'nanxiang.sqlite'),
    host: 'localhost',
    dialect: 'sqlite',
    logging: console.log
  },
  production: {
    storage: path.join(__dirname, 'nanxiang.sqlite'),
    host: 'localhost',
    dialect: 'sqlite',
    logging: console.log
  },
  test: {
    storage: path.join(__dirname, 'nanxiang.test.sqlite'),
    host: 'localhost',
    dialect: 'sqlite',
    logging: console.log
  }
};
