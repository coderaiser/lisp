'use strict';

module.exports = {
    print: print,
    head: head,
    tail: tail,
    last: last,
    '+': calc(function (a, b) {
        return a + b;
    }),
    '-': calc(function (a, b) {
        return a - b;
    }),
    '*': calc(function (a, b) {
        return a * b;
    }),
    '/': calc(function (a, b) {
        return a / b;
    })
};

function print(x) {
    console.log(x);
    return x;
}

function last(list) {
    return head(slice(list, -1));
}

function head(list) {
    return list[0];
}

function tail(list) {
    return slice(list, 1);
}

function calc(operation) {
    return function () {
        return [].reduce.call(arguments, operation);
    };
}

function slice(array, from, to) {
    return [].slice.call(array, from, to);
}