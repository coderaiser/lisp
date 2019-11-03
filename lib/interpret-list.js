'use strict';

/* should be exported before require of interpret */
module.exports = interpretList;

const currify = require('currify');

const swap = currify((fn, a, b) => fn(b, a));
const interpret = swap(require('./interpret'));
const Context = require('./context');
const library = require('./library');

const head = library.head;
const tail = library.tail;

const isFunction = (fn) => typeof fn === 'function';

const special = {
    const(input, context) {
        const constContext = input[1].reduce((acc, x) => {
            acc.scope[x[0].value] = interpret(x[1], context);
            
            return acc;
        }, new Context({}, context));
        
        return interpret(input[2], constContext);
    },
    
    lambda: (input, context) => (...lambdaArguments) => {
        const lambdaScope = input[1].reduce((acc, x, i) => {
            acc[x.value] = lambdaArguments[i];
            return acc;
        }, {});
        
        const newContext = new Context(lambdaScope, context);
        
        return interpret(input[2], newContext);
    },
    
    if: (input, context) => {
        const [,
            first,
            second,
            third,
        ] = input;
        
        if (interpret(first, context))
            return interpret(second, context);
        
        interpret(third, context);
    },
};

const checkFunction = (name, value) => {
    if (!isFunction(value))
        throw Error(`${name} is not a function!`);
};

function interpretList(input, context) {
    const first = head(input);
    
    if (input.length && first.value in special)
        return special[first.value](input, context);
    
    const [fnData] = input;
    
    const list = input.map(interpret(context));
    const fn = head(list);
    
    checkFunction(fnData.value, fn);
    
    return fn(...tail(list));
}

