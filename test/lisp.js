(function() {
    'use strict';
    
    let lisp    = require('../src/lisp'),
        test    = require('tape');
    
    test('expression: +', t => {
        const expr = '(+ 1 2 3 4)';
        let result = lisp(expr);
        
        t.equal(result, 10, 'sum');
        t.end();
    });
    
    test('expression: *', t => {
        const expr = '(* 1 2 3 4)';
        let result = lisp(expr);
        
        t.equal(result, 24, 'mult');
        t.end();
    });
    
    test('expression: -', t => {
        const expr = '(- 5 2 3)';
        let result = lisp(expr);
        
        t.equal(result, 0, 'subst');
        t.end();
    });
    
    test('expression: /', t => {
        const expr = '(/ 8 4 2)';
        let result = lisp(expr);
        
        t.equal(result, 1, 'div');
        t.end();
    });
    
    test('nested expressions', t => {
        const expr = '(+ 2 (+ 8 4 2))';
        let result = lisp(expr);
        
        t.equal(result, 16, 'return sum');
        t.end();
    });
    
    test('expression: space before function', t => {
        const expr = '(+ 1 2 3 4)';
        let result = lisp(expr);
        
        t.equal(result, 10, 'sum');
        t.end();
    });
    
    test('error in expression: not a function', t => {
        let fn  = () => lisp('(+1 2 3 4)');
        
        t.throws(fn, /1 is not a function!/, 'should throw when not a function!');
        t.end();
    });
    
    test('no arguments', t => {
        t.throws(lisp, /expression should be string!/, 'should throw when no expression');
        t.end();
    });
    
    test('arguments: wrong type', t => {
        let fn  = () => lisp(1);
       
        t.throws(fn, /expression should be string!/, 'should throw when no expression');
        t.end();
    });
    
    test('throw: different count of parentheses', t => {
        const expr = '(+ 2 (+ 8 4 2)';
        let fn = () => lisp(expr);
        
        t.throws(fn, 
            /different count of parentheses: open 2, close 1/, 
            'should throw when different count of parentheses');
        
        t.end();
    });
})();
