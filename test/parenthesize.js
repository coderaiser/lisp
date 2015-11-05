(function() {
    'use strict';
    
    let dir             = '../src/',
        parenthesize    = require(dir + 'parenthesize'),
        test            = require('tape');
    
    test('parenthesize: expression', t => {
        let tokens = ['(', '+', '2', '2', ')'];
        let result = parenthesize(tokens);
        let RESULT = [{
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
})();
