'use strict';

module.exports = categorize;

let head        = require('head');
let last        = require('last');
let check       = require('check');
let partial     = require('partial');

let checkString = partial(check, 'string');
let checkInput  = partial(checkString, 'input');

function categorize(input) {
    checkInput(input);
    
    let result;
    let num = Number(input);
    
    if (!isNaN(num))
        result = {
            type: 'literal',
            value: num
        };
    else if (wrapedByQuotes(input)) {
        result = {
            type: 'literal',
            value: input.slice(1, -1) };
    } else
        result =  {
            type: 'identifier',
            value: input
        };
    
    return result;
 }
 
function wrapedByQuotes(value) {
    return  head(value) === '"' &&
            last(value) === '"';
}