(function() {
    'use strict';
    
    let categorize  = require('../src/categorize'),
        test        = require('tape');
    
    test('categorize: literal', t => {
        t.deepEqual(categorize('5'), {
            type: 'literal',
            value: 5
        });
        
        t.deepEqual(categorize('"hello"'), {
            type: 'literal',
            value: 'hello'
        });
        
        t.end();
    });
    
    test('categorize: identifier', t => {
        t.deepEqual(categorize('hello'), {
            type: 'identifier',
            value: 'hello'
        });
        
        t.end();
    });
    
    test('tokenize: wrong type', t => {
        t.throws(categorize, /input should be string or array!/, 'should throw when input not string, not array');
        t.end();
    });
})();
