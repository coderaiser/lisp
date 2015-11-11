'use strict';

function _typeof(obj) { return obj && typeof Symbol !== "undefined" && obj.constructor === Symbol ? "symbol" : typeof obj; }

var is = function is(type, value) {
    return (typeof value === 'undefined' ? 'undefined' : _typeof(value)) === type;
};

module.exports = function (type, name, value) {
    if (!is(type, value)) throw Error(name + ' should be ' + type + '!');

    return value;
};