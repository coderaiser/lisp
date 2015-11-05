'use strict';

/* should be exported before require of interpret */
module.exports  = interpretList;

let interpret   = require('./interpret');
let Context     = require('./context');

let head        = require('head');
let tail        = require('tail');
let isFunction  = require('is-function');

let special = {
    let: function(input, context) {
        let letContext = input[1].reduce((acc, x) => {
            acc.scope[x[0].value] = interpret(x[1], context);
            
            return acc;
        }, new Context({}, context));
        
      return interpret(input[2], letContext);
    },
    
    lambda: (input, context) => function() {
        let lambdaArguments = arguments,
            lambdaScope     = input[1].reduce((acc, x, i) => {
                acc[x.value] = lambdaArguments[i];
                return acc;
            }, {}),
            
            newContext = new Context(lambdaScope, context);
        
        return interpret(input[2], newContext);
    },
    
    if: (input, context) =>
        interpret(input[1], context)
            ?
            interpret(input[2], context)
            :
            interpret(input[3], context)
};

let checkFunction = (name, value) => {
    if (!(isFunction(value)))
        throw Error(`${ name } is not a function!`);
};

function interpretList(input, context) {
    let first = head(input);
    
    if (input.length && first.value in special) {
        return special[first.value](input, context);
    } else {
        let fnData  = input[0];
        
        let list    = input.map(x =>
            interpret(x, context)
        );
        
        let fn = head(list);
        
        checkFunction(fnData.value, fn);
            
        return fn(...tail(list));
    }
}
