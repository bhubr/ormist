var fs   = require('fs');
var path = require('path');
var Promise = require('bluebird');



module.exports = {

  /**
   * DB wrapper
   */
  db: null,

  /**
   * Model directories
   */
  modelDirs: [],

  /**
   * Models
   */
  models: {},

  /**
   * Turn model definition to ORM Model
   */
  ormize: function(modelName, modelDefinition) {
    console.log('ormize...', arguments);
    return (_modelName => {
      return {
        create: function(values) {
          const conn = db.getConnection();
          const query = buildInsertQuery(_modelName, values);
          console.log('ORM:create:' + _modelName + "\n", query);
          return conn.query(query)
          .then(result => conn.query('SELECT * from ' + _modelName + ' WHERE id = ' + result.insertId))
          .then(entries => rest.snakeToCamel(entries[0]));
        },
    
        read: function(id) {
          const conn = db.getConnection();
          const where = ' WHERE id = ' + id;
          console.log('ORM:read:' + _modelName);
          return conn.query('SELECT * from ' + _modelName + where)
          .then(entries => {
            if (entries.length === 0) return undefined;
            return rest.snakeToCamel(entries[0]);
          });
        },

        readAll: function() {
          const conn = db.getConnection();
          console.log('ORM:readAll:' + _modelName);
          return conn.query('SELECT * from ' + _modelName)
          .then(entries => entries.map(rest.snakeToCamel));

        },

        update: function(id, values) {
          const conn = db.getConnection();
          const query = buildUpdateQuery(_modelName, id, values);
          console.log('ORM:update:' + _modelName + "\n", query);
          return conn.query(query)
          .then(result => conn.query('SELECT * from ' + _modelName + ' WHERE id = ' + id))
          .then(entries => rest.snakeToCamel(entries[0]));
          // .then(console.log);
        },

        delete: function(id) {
          const conn = db.getConnection();
          console.log('ORM:delete:' + _modelName);
          return conn.query('DELETE from ' + _modelName + ' WHERE id = ' + id);
        }
      };
    })(modelName);
  },

  /**
   * Get models from model directories
   */
  getModels: function() {
    var _this = this;
    return new Promise(function(resolve, reject) {
      console.log('getModels', _this);
      var modelsDir = path.normalize(__dirname + '/models');
      var files = fs.readdirSync(modelsDir);
      var _models = {};
      files.forEach(function(file) {
        const modelName = path.basename(file, '.json');
        const modelDefinition = require(modelsDir + '/' + file);
        _models[modelName] = modelDefinition;
      });
      for (var modelName in _models) {
        console.log(modelName, _models[modelName]);
        _this.models[modelName] = _this.ormize(modelName, _models[modelName]);
      }
      console.log("done", _this.models);
      resolve(_this.models);
    });


  },

  /**
   * Initialize ORM
   */
  init: function(driver, params) {
    this.db = require('./lib/db')(driver, params);
    return this.db.connect()
    .then(ret => {
      // console.log(ret);
      // console.log(this);
      // console.log('\n### DB connection', this.db.getConnection());
      return this.getModels();
      // .catch(console.log);
    });
  }

};






