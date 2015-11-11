'use strict';

module.exports = categorize;

let apart       = require('apart');

let check       = require('./check');
let library     = require('./library');

let head        = library.head;
let last        = library.last;

let checkString = apart(check, 'string');
let checkInput  = apart(checkString, 'input');

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
    console.log('>>>', value)
    return  head(value) === '"' &&
            last(value) === '"';
}
