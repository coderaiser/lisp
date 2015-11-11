'use strict';

module.exports = categorize;

var apart = require('apart');

var check = require('./check');
var library = require('./library');

var head = library.head;
var last = library.last;

var checkString = apart(check, 'string');
var checkInput = apart(checkString, 'input');

function categorize(input) {
    checkInput(input);

    var result = undefined;
    var num = Number(input);

    if (!isNaN(num)) result = {
        type: 'literal',
        value: num
    };else if (wrapedByQuotes(input)) {
        result = {
            type: 'literal',
            value: input.slice(1, -1) };
    } else result = {
        type: 'identifier',
        value: input
    };

    return result;
}

function wrapedByQuotes(value) {
    console.log('>>>', value);
    return head(value) === '"' && last(value) === '"';
}