function OrmistError() {
    var temp = Error.apply(this, arguments);
    temp.name = this.name = 'OrmistError';
    this.stack = temp.stack;
    this.message = temp.message;
}
//inherit prototype using ECMAScript 5 (IE 9+)
OrmistError.prototype = Object.create(Error.prototype, {
    constructor: {
        value: OrmistError,
        writable: true,
        configurable: true
    }
});

module.exports = OrmistError;