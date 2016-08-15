/**
 * Object attribute names converters
 * @module ormist/query-builders
 */
var converters = require('./converters');

function padDatePart(datePart) {
  return ('0' + datePart).slice(-2);
}

function getMySqlDate() {
  var aDate = new Date();
  var formattedDate = aDate.getFullYear() + '-' + padDatePart(aDate.getMonth() + 1) + '-' +  padDatePart(aDate.getDay()) + 
    ' ' + padDatePart(aDate.getHours()) + ':' + padDatePart(aDate.getMinutes()) + ':' +  padDatePart(aDate.getSeconds());
  return formattedDate;
}

module.exports = {
  /**
   * Convert a payload to a SQL query
   */
  insert: function(tableName, modelAttrs) {
    var attributes = converters.camelToSnake(modelAttrs);
    var fields = Object.keys(attributes);
    var sqlFields = '(' + fields.join(',') + ',created_at,updated_at)';
    var mysqlDate = getMySqlDate(); //new Date().toISOString().slice(0, 19).replace('T', ' ');
    // console.log('#### ORMist createdAt...', new Date(), new Date().toISOString(), theDate);
    var sqlValues = [];
    for (var k in attributes) {
      var val = attributes[k];
      if (typeof val === 'number') sqlValues.push(val);
      else if (typeof val === 'boolean') sqlValues.push(val ? 'TRUE' : 'FALSE');
      else if (typeof val === 'string') sqlValues.push("'" + val.split("'").join("''") + "'");
      else if (typeof val === 'undefined') throw new Error('Field ' + k + ' has undefined value');
    }
    sqlValues.push("'" + mysqlDate + "'");
    sqlValues.push("'" + mysqlDate + "'");
    return 'INSERT INTO ' + tableName + sqlFields + ' VALUES(' + sqlValues.join(',') + ')';
  },

  /**
   * Convert a payload to a SQL query
   */
  update: function(tableName, id, modelAttrs) {
    var attributes = converters.camelToSnake(modelAttrs);
    // var fields = Object.keys(attributes);
    // var sqlFields = '(' + fields.join(',') + ',updated_at)';
    var mysqlDate = getMySqlDate();
    var sqlValues = [];
    for (var k in attributes) {
      var val = attributes[k];
      // if (typeof val === 'number') sqlValues.push(val);
      if (typeof val === 'boolean') val = (val ? 'TRUE' : 'FALSE');
      else if (typeof val === 'string') val = "'" + val.split("'").join("''") + "'";
      else if (typeof val === 'undefined') throw new Error('Field ' + k + ' has undefined value');
      sqlValues.push(k + '=' + val);
    }
    sqlValues.push("updated_at='" + mysqlDate + "'");
    return 'UPDATE ' + tableName + ' SET ' + sqlValues.join(',') + ' WHERE id = ' + id;
  }
};
