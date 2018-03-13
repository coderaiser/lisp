'use strict';

const parenthesize = require('./parenthesize');
const test = require('tape');

test('parenthesize: expression', t => {
    const tokens = ['(', '+', '2', '2', ')'];
    const result = parenthesize(tokens);
    const expected = [{
        type: 'identifier',
            value: '+'
        }, {
            type: 'literal',
            value: 2
        }, {
            type: 'literal',
            value: 2
        }];
    
    t.deepEqual(result, expected);
    
    t.end();
});

test('parenthesize: input not array', t => {
    t.throws(parenthesize, /input should be an array!/, 'should throw when input not array');
    t.end();
});

