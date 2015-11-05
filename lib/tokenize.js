'use strict';

var partial = require('partial');
var isString = require('is-string');

module.exports = tokenize;

function tokenize(expression) {
    check(expression);

    var marker = generateStr(expression);

    return expression.split('"').map(partial(spacesInQuotes, marker)).join('"').split(' ').filter(Boolean).map(function (x) {
        return x.replace(RegExp(marker, 'g'), ' ');
    });
}

function spacesInQuotes(marker, x, i) {
    if (i % 2 === 0) {
        // not in string
        return x.replace(/\(/g, ' ( ').replace(/\)/g, ' ) ');
    } else {
        // in string
        return x.replace(/ /g, marker);
    }
}

function check(str) {
    if (!isString(str)) throw Error('expression should be string!');
}

var uniq = function uniq(expression, str) {
    return ~expression.indexOf(str);
};
var generateRandom = function generateRandom() {
    return '>--- ' + Math.random() + ' ---<';
};

function generateStr(expression) {
    var str;

    do str = generateRandom(); while (uniq(expression, str));

    return str;
}