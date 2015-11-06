'use strict';

let squad       = require('squad');

let partial     = require('partial');
let isString    = require('is-string');

let brackets = require('./brackets');

let addSpaces   = (a) => ` ${ a } `;

module.exports = tokenize;

function tokenize(expression) {
    check(expression);
    
    let marker = generateStr(expression);
    
    return expression
        .split('"')
        .map(partial(spacesInQuotes, marker))
        .join('"')
        .split(' ')
        .filter(Boolean)
        .map(x =>
            x.replace(RegExp(marker, 'g'), ' ')
        );
}

function spacesInQuotes(marker, x, i) {
    return i % 2 === 0 ?
        notInString(x)
        :
        inString(marker, x);
}

function inString(marker, x) {
    return x.replace(/ /g, marker);
}

function notInString(x) {
    let roundBrackets   = brackets();
    let process         = squad(addSpaces, roundBrackets);
    
    let str =  x.replace(/\(|\)/g, process);
    
    roundBrackets.check();
    
    return str;
}

function check(str) {
    if (!isString(str))
        throw Error('expression should be string!');
}

let uniq            = (expression, str) => ~expression.indexOf(str);
let generateRandom  = () => `>--- ${ Math.random() } ---<`;

function generateStr(expression) {
    let str;
    
    do 
        str = generateRandom();
    while (uniq(expression, str));
    
    return str;
}
