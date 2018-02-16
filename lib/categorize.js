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

    if (!isNaN(input)) return {
        type: 'literal',
        value: Number(input)
    };

    if (Array.isArray(input)) return {
        type: 'literal',
        value: input.map(parseInput)
    };

    if (wrapedByQuotes(input)) return {
        type: 'literal',
        value: unwrap(input)
    };

    return {
        type: 'identifier',
        value: input
    };
}

function parseInput(value) {
    if (wrapedByQuotes(value)) return unwrap(value);

    if (!isNaN(value)) return Number(value);

    return value;
}

function unwrap(input) {
    return input.slice(1, -1);
}

function wrapedByQuotes(value) {
    return head(value) === '"' && last(value) === '"';
}