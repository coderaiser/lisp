'use strict';

module.exports = {
    print   : print,
    '+'     : calc((a, b) => a + b),
    '-'     : calc((a, b) => a - b),
    '*'     : calc((a, b) => a * b),
    '/'     : calc((a, b) => a / b)
};

function print(x) {
    console.log(x);
    return x;
}

function calc(operation) {
    return function() {
        return [].reduce.call(arguments, operation);
    };
}
