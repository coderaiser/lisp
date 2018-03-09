'use strict';

const parenthesize = require('../lib/parenthesize');
const test = require('tape');

test('parenthesize: expression', t => {
    const tokens = ['(', '+', '2', '2', ')'];
    const result = parenthesize(tokens);
    const RESULT = [{
        type: 'identifier',
            value: '+'
        }, {
            type: 'literal',
            value: 2
        }, {
            type: 'literal',
            value: 2
        }];
    
    t.deepEqual(result, RESULT);
    
    t.end();
});

test('parenthesize: input not array', t => {
    t.throws(parenthesize, /input should be an array!/, 'should throw when input not array');
    t.end();
});

