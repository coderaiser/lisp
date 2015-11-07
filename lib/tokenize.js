'use strict';

var partial = require('partial');
var isString = require('is-string');

var addSpaces = function addSpaces(a) {
    return ' ' + a + ' ';
};

module.exports = tokenize;

function tokenize(expression) {
    check(expression);

    var marker = generateStr(expression);

    return expression.split('"').map(partial(spacesInQuotes, addSpaces, marker)).join('"').split(' ').filter(Boolean).map(function (x) {
        return x.replace(RegExp(marker, 'g'), ' ');
    });
}

function spacesInQuotes(strProcess, marker, x, i) {
    return i % 2 === 0 ? notInString(strProcess, x) : inString(marker, x);
}

function inString(marker, x) {
    return x.replace(/ /g, marker);
}

function notInString(strProcess, x) {
    var str = x.replace(/\(|\)/g, strProcess);

    return str;
}

function check(str) {
    if (!isString(str)) throw Error('expression should be string!');
}

var uniq = function uniq(expression, str) {
    return ~expression.indexOf(str);
};
var generateRandom = function generateRandom() {
    return '>---' + Math.random() + '---<';
};

function generateStr(expression) {
    var str = undefined;

    do str = generateRandom(); while (uniq(expression, str));

    return str;
}