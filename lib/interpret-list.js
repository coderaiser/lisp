'use strict'

/* should be exported before require of interpret */
;

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i]; return arr2; } else { return Array.from(arr); } }

module.exports = interpretList;

var interpret = require('./interpret');
var Context = require('./context');
var library = require('./library');

var head = library.head;
var tail = library.tail;

var isFunction = function isFunction(fn) {
    return typeof fn === 'function';
};

var special = {
    let: function _let(input, context) {
        var letContext = input[1].reduce(function (acc, x) {
            acc.scope[x[0].value] = interpret(x[1], context);

            return acc;
        }, new Context({}, context));

        return interpret(input[2], letContext);
    },

    lambda: function lambda(input, context) {
        return function () {
            var lambdaArguments = arguments,
                lambdaScope = input[1].reduce(function (acc, x, i) {
                acc[x.value] = lambdaArguments[i];
                return acc;
            }, {}),
                newContext = new Context(lambdaScope, context);

            return interpret(input[2], newContext);
        };
    },

    if: function _if(input, context) {
        return interpret(input[1], context) ? interpret(input[2], context) : interpret(input[3], context);
    }
};

var checkFunction = function checkFunction(name, value) {
    if (!isFunction(value)) throw Error(name + ' is not a function!');
};

function interpretList(input, context) {
    var first = head(input);

    if (input.length && first.value in special) {
        return special[first.value](input, context);
    } else {
        var fnData = input[0];

        var list = input.map(function (x) {
            return interpret(x, context);
        });

        var fn = head(list);

        checkFunction(fnData.value, fn);

        return fn.apply(undefined, _toConsumableArray(tail(list)));
    }
}