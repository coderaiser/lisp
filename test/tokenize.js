(function() {
    'use strict';
    
    let tokenize    = require('../src/tokenize'),
        test        = require('tape');
    
    test('tokenize: expression', t => {
        let expr = '(+ 2 2)';
        let result = tokenize(expr);
        let tokens  = ['(', '+', '2', '2', ')'];
        
        t.deepEqual(result, tokens);
        t.end();
    });
    
    test('tokenize: expression not string', t => {
        t.throws(tokenize, /expression should be string!/, 'should throw when expression not string');
        t.end();
    });
})();
