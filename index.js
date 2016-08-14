var fs   = require('fs');
var path = require('path');
var Promise = require('bluebird');
var queryBuilders = require('./lib/query-builders');
var converters = require('./lib/converters');

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
    console.log('ormize =>', modelName);
    return ((_modelName, _db) => {
      return {
        create: function(values) {
          const conn = _db.getConnection();
          const query = queryBuilders.insert(_modelName, values);
          console.log('ORM:create:' + _modelName + "\n", query);
          return conn.query(query)
          .then(result => conn.query('SELECT * from ' + _modelName + ' WHERE id = ' + result.insertId))
          .then(entries => converters.snakeToCamel(entries[0]));
        },
    
        read: function(id) {
          const conn = _db.getConnection();
          const where = ' WHERE id = ' + id;
          console.log('ORM:read:' + _modelName);
          return conn.query('SELECT * from ' + _modelName + where)
          .then(entries => {
            if (entries.length === 0) return undefined;
            return converters.snakeToCamel(entries[0]);
          });
        },

        latest: function() {
          return this.readAll("ORDER BY id DESC LIMIT 1");
        },

        readAll: function(criteria) {
          const criteria = criteria || "";
          const conn = _db.getConnection();
          console.log('ORM:readAll:' + _modelName);
          return conn.query('SELECT * from ' + _modelName + ' ' + criteria)
          .then(entries => entries.map(converters.snakeToCamel));
        },

        update: function(id, values) {
          const conn = _db.getConnection();
          const query = queryBuilders.update(_modelName, id, values);
          console.log('ORM:update:' + _modelName + "\n", query);
          return conn.query(query)
          .then(result => conn.query('SELECT * from ' + _modelName + ' WHERE id = ' + id))
          .then(entries => converters.snakeToCamel(entries[0]));
          // .then(console.log);
        },

        delete: function(id) {
          const conn = _db.getConnection();
          console.log('ORM:delete:' + _modelName);
          return conn.query('DELETE from ' + _modelName + ' WHERE id = ' + id);
        }
      };
    })(modelName, this.db);
  },

  /**
   * Load models from model directories
   */
  loadModels: function() {
    var _this = this;
    return new Promise(function(resolve, reject) {
      var modelsDir = path.normalize(__dirname + '/../../models');
      var files = fs.readdirSync(modelsDir);
      var _models = {};
      files.forEach(function(file) {
        const modelName = path.basename(file, '.json');
        const modelDefinition = require(modelsDir + '/' + file);
        _models[modelName] = modelDefinition;
      });
      for (var modelName in _models) {
        // console.log(modelName, _models[modelName]);
        _this.models[modelName] = _this.ormize(modelName, _models[modelName]);
      }
      resolve(_this.models);
    });
  },

  /**
   * Get models
   */
  getModels: function() {
    return this.models;
  },

  /**
   * Initialize ORM
   */
  init: function(driver, params) {
    this.db = require('./lib/db')(driver, params);
    return this.db.connect()
    .then(() => this.loadModels());
  }

};