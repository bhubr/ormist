/**
 * Object attribute names converters
 * @module ormist/query-builders
 */
import converters from './converters';

module.exports = {
  /**
   * Convert a payload to a SQL query
   */
  insert: function(tableName, modelAttrs) {
    const attributes = converters.camelToSnake(modelAttrs);
    const fields = Object.keys(attributes);
    const sqlFields = '(' + fields.join(',') + ',created_at,updated_at)';
    const theDate = new Date().toISOString().slice(0, 19).replace('T', ' ');
    let sqlValues = [];
    for (let k in attributes) {
      const val = attributes[k];
      if (typeof val === 'number') sqlValues.push(val);
      else if (typeof val === 'boolean') sqlValues.push(val ? 'TRUE' : 'FALSE');
      else if (typeof val === 'string') sqlValues.push("'" + val.split("'").join("''") + "'");
      else if (typeof val === 'undefined') throw new Error('Field ' + k + ' has undefined value');
    }
    sqlValues.push("'" + theDate + "'");
    sqlValues.push("'" + theDate + "'");
    return 'INSERT INTO ' + tableName + sqlFields + ' VALUES(' + sqlValues.join(',') + ')';
  },

  /**
   * Convert a payload to a SQL query
   */
  update: function(tableName, id, modelAttrs) {
    const attributes = converters.camelToSnake(modelAttrs);
    // const fields = Object.keys(attributes);
    // const sqlFields = '(' + fields.join(',') + ',updated_at)';
    const theDate = new Date().toISOString().slice(0, 19).replace('T', ' ');
    let sqlValues = [];
    for (let k in attributes) {
      let val = attributes[k];
      // if (typeof val === 'number') sqlValues.push(val);
      if (typeof val === 'boolean') val = (val ? 'TRUE' : 'FALSE');
      else if (typeof val === 'string') val = "'" + val.split("'").join("''") + "'";
      else if (typeof val === 'undefined') throw new Error('Field ' + k + ' has undefined value');
      sqlValues.push(k + '=' + val);
    }
    sqlValues.push("updated_at='" + theDate + "'");
    return 'UPDATE ' + tableName + ' SET ' + sqlValues.join(',') + ' WHERE id = ' + id;
  }
};
