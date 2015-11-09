'use strict';

module.exports = categorize;

var head = require('head');
var last = require('last');
var check = require('check');
var apart = require('apart');

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
    return head(value) === '"' && last(value) === '"';
}