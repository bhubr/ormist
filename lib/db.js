function DB(driver, params) {
  this.driver = driver;
  this.params = params;
  this.module = require('ormist-' + driver);
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