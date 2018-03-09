'use strict';

module.exports = {
    print   : print,
    head    : head,
    tail    : tail,
    last    : last,
    car     : head,
    cdr     : tail,
    '+'     : calc((a, b) => a + b),
    '-'     : calc((a, b) => a - b),
    '*'     : calc((a, b) => a * b),
    '/'     : calc((a, b) => a / b),
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
    return (...args) => {
        return args.reduce(operation);
    };
}

function slice(array, from, to) {
    return array.slice(from, to);
}

