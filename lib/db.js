var OrmistError = require('./ormist-error');
var allowedDrivers = ['mysql', 'pgsql', 'sqlite'];

function DB(driver, params) {
  this.driver = driver;
  this.params = params;
  try {
    this.module = require('ormist-' + driver);
  } catch(e) {
    var errorMessage = allowedDrivers.indexOf(driver) === -1 ?
      'Bad driver "' + driver + '", allowed values: [' + allowedDrivers.join(', ') + ']' :
      'Driver "ormist' + driver + '" not found... install it?';
    throw new OrmistError(errorMessage);
  }
}  

DB.prototype.connect = function() {
  console.log('connecting with driver: [' + this.driver + '] and params:', this.params);
  return this.module.connect(this.params);
}

DB.prototype.getConnection = function() {
  if (this.module.connection === null) throw new Error('[DB] connection not ready');
  return this.module.connection;
}

DB.prototype.query = function(sql) {
  return this.module.query(sql);
}

module.exports = function(driver, params) {
  return new DB(driver, params);
}