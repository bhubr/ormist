/**
 * Object attribute names converters
 * @module ormist/converters
 */

module.exports = {
  /**
   * JSON API conversion (lowerCamelCase) => DB fields (snake_case)
   */
  camelToSnake: function(attributes) {
    var output = {};
    for (var k in attributes) {
      if (k === 'id') continue;
      var snake = _.snakeCase(k);
      output[snake] = attributes[k];
    }
    return output;
  },

  /**
   * DB fields (snake_case) => JSON API conversion (lowerCamelCase)
   */
  snakeToCamel: function(attributes) {
    var output = {};
    for (var k in attributes) {
      // if (k === 'id') continue;
      var snake = _.camelCase(k);
      output[snake] = attributes[k];
    }
    return output;
  }
};
