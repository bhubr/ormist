/**
 * Object attribute names converters
 * @module ormist/converters
 */

module.exports = {
  /**
   * JSON API conversion (lowerCamelCase) => DB fields (snake_case)
   */
  camelToSnake: function(attributes) {
    let output = {};
    for (let k in attributes) {
      if (k === 'id') continue;
      const snake = _.snakeCase(k);
      output[snake] = attributes[k];
    }
    return output;
  }

  /**
   * DB fields (snake_case) => JSON API conversion (lowerCamelCase)
   */
  snakeToCamel: function(attributes) {
    let output = {};
    for (let k in attributes) {
      // if (k === 'id') continue;
      const snake = _.camelCase(k);
      output[snake] = attributes[k];
    }
    return output;
  }
};
