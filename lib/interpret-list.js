'use strict'

/* should be exported before require of interpret */
;
module.exports = interpretList;

var interpret = require('./interpret');
var Context = require('./context');

var head = require('head');
var tail = require('tail');
var isFunction = require('is-function');

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

        return fn.call(null, tail(list));
    }
}