'use strict';

var isString = function isString(str) {
    return typeof str === 'string';
};

module.exports = tokenize;

var regexp = /^\s*((\r|\n|$)|#;|#\||#\\[^\w]|#?(\(|\[|{)|\)|\]|}|\'|`|,@|,|\+inf\.0|-inf\.0|\+nan\.0|\"(\\(.|$)|[^\"\\])*(\"|$)|[^\s()\[\]{}]+)/;

function tokenize(expression) {
    check(expression);

    var tokens = [];
    var txt = expression;
    var add = function add(array, token) {
        tokens.push(token);

        return '';
    };

    while (txt) txt = txt.replace(regexp, add);

    return tokens;
}

function check(str) {
    if (!isString(str)) throw Error('expression should be string!');
}