'use strict';

const categorize = require('./categorize');
const test = require('supertape');

test('categorize: literal', (t) => {
    t.deepEqual(categorize('5'), {
        type: 'literal',
        value: 5,
    });
    
    t.deepEqual(categorize('"hello"'), {
        type: 'literal',
        value: 'hello',
    });
    
    t.end();
});

test('categorize: identifier', (t) => {
    t.deepEqual(categorize('hello'), {
        type: 'identifier',
        value: 'hello',
    });
    
    t.end();
});

test('categorize: wrong type', (t) => {
    t.throws(categorize, /input should be string or array!/, 'should throw when input not string, not array');
    t.end();
});

