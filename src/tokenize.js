'use strict';

let partial     = require('partial');
let isString    = require('is-string');

let addSpaces   = (a) => ` ${ a } `;

module.exports = tokenize;

function tokenize(expression) {
    check(expression);
    
    let marker          = generateStr(expression);
    
    return expression
        .split('"')
        .map(partial(spacesInQuotes, addSpaces, marker))
        .join('"')
        .split(' ')
        .filter(Boolean)
        .map(x =>
            x.replace(RegExp(marker, 'g'), ' ')
        );
}

function spacesInQuotes(strProcess, marker, x, i) {
    return i % 2 === 0 ?
        notInString(strProcess, x)
        :
        inString(marker, x);
}

function inString(marker, x) {
    return x.replace(/ /g, marker);
}

function notInString(strProcess, x) {
    let str =  x.replace(/\(|\)/g, strProcess);
    
    return str;
}

function check(str) {
    if (!isString(str))
        throw Error('expression should be string!');
}

let uniq            = (expression, str) => ~expression.indexOf(str);
let generateRandom  = () => `>---${ Math.random() }---<`;

function generateStr(expression) {
    let str;
    
    do 
        str = generateRandom();
    while (uniq(expression, str));
    
    return str;
}
