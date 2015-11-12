'use strict';

var squad = require('squad');

var categorize = require('./categorize');
var getList = squad(categorize, makeList);

module.exports = parenthesize;

function parenthesize(input, list) {
    check(input);

    var token;

    if (!list) {
        return parenthesize(input, []);
    } else {
        token = input.shift();

        if (!token) {
            return list.pop();
        } else if (isList(token, input)) {
            list.push(getList(input));
            cutList(input);
            return list;
        } else if (token === '(') {
            list.push(parenthesize(input, []));
            return parenthesize(input, list);
        } else if (token === ')') {
            return list;
        } else {
            return parenthesize(input, list.concat(categorize(token)));
        }
    }
}

function check(input) {
    if (!Array.isArray(input)) throw Error('input should be an array!');
}

function isList(token, input) {
    return token === '\'' && input[0] === '(';
}

function makeList(input) {
    var closeIndex = input.indexOf(')');

    return input.slice(1, closeIndex);
}

function cutList(input) {
    var closeIndex = input.indexOf(')');

    input.splice(0, closeIndex + 2);
}