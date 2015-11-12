'use strict';

module.exports = categorize;

var library = require('./library');

var head = library.head;
var last = library.last;

var isString = function isString(value) {
    return typeof value === 'string';
};
var isArray = Array.isArray;
var isType = function isType(value) {
    return isString(value) || isArray(value);
};
var check = function check(value) {
    if (!isType(value)) throw Error('input should be string or array!');
};

function categorize(input) {
    check(input);
    var result = undefined;

    if (!isNaN(input)) result = {
        type: 'literal',
        value: Number(input)
    };else if (Array.isArray(input)) result = {
        type: 'literal',
        value: input.map(parseInput)
    };else if (wrapedByQuotes(input)) result = {
        type: 'literal',
        value: unwrap(input)
    };else result = {
        type: 'identifier',
        value: input
    };

    return result;
}

function parseInput(value) {
    if (wrapedByQuotes(value)) return unwrap(value);else if (!isNaN(value)) return Number(value);else return value;
}

function unwrap(input) {
    return input.slice(1, -1);
}

function wrapedByQuotes(value) {
    return head(value) === '"' && last(value) === '"';
}