'use strict';

module.exports = categorize;

let library     = require('./library');

let head        = library.head;
let last        = library.last;

let isString    = value => typeof value === 'string';
let isArray     = Array.isArray;
let isType      = value => isString(value) || isArray(value);
let check       = value => {
    if (!isType(value))
        throw Error('input should be string or array!');
};

function categorize(input) {
    check(input);
    let result;
    
    if (!isNaN(input))
        result = {
            type: 'literal',
            value: Number(input)
        };
    else if (Array.isArray(input))
        result = {
            type: 'literal',
            value: input.map(parseInput)
        };
    else if (wrapedByQuotes(input))
        result = {
            type: 'literal',
            value: unwrap(input)
        };
    else
        result =  {
            type: 'identifier',
            value: input
        };
    
    return result;
 }

function parseInput(value) {
    if (wrapedByQuotes(value))
        return unwrap(value);
    else if (!isNaN(value))
        return Number(value);
    else
        return value;
}

function unwrap(input) {
    return input.slice(1, -1);
}

function wrapedByQuotes(value) {
    return  head(value) === '"' &&
            last(value) === '"';
}
