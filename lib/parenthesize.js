'use strict';

var categorize = require('./categorize');

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