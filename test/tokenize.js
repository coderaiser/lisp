'use strict';

const tokenize = require('../lib/tokenize');
const test = require('tape');

test('tokenize: expression', t => {
    const expr = '(+ 2 2)';
    const result = tokenize(expr);
    const tokens  = ['(', '+', '2', '2', ')'];
    
    t.deepEqual(result, tokens);
    t.end();
});

test('tokenize: expression not string', t => {
    t.throws(tokenize, /expression should be string!/, 'should throw when expression not string');
    t.end();
});
