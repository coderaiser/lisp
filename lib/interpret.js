'use strict';

module.exports = interpret;

const Context = require('./context');
const library = require('./library');
const interpretList = require('./interpret-list');

const {isArray} = Array;

function interpret(input, context) {
    const ctx = context || new Context(library);
    
    if (isArray(input))
        return interpretList(input, ctx);
    
    if (input.type === 'identifier')
        return ctx.get(input.value);
     
    // literal
    return input.value;
}
