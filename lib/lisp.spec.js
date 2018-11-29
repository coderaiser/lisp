'use strict';

const lisp = require('..');
const test = require('tape');
const stub = require('@cloudcmd/stub');

test('expression: +', (t) => {
    const expr = '(+ 1 2 3 4)';
    const result = lisp(expr);
    
    t.equal(result, 10, 'sum');
    t.end();
});

test('expression: + strings', (t) => {
    const expr = '(+ "hello" " world")';
    const result = lisp(expr);
    
    t.equal(result, 'hello world', 'strings concat');
    t.end();
});

test('expression: *', (t) => {
    const expr = '(* 1 2 3 4)';
    const result = lisp(expr);
    
    t.equal(result, 24, 'mult');
    t.end();
});

test('expression: -', (t) => {
    const expr = '(- 5 2 3)';
    const result = lisp(expr);
    
    t.equal(result, 0, 'subst');
    t.end();
});

test('expression: /', (t) => {
    const expr = '(/ 8 4 2)';
    const result = lisp(expr);
    
    t.equal(result, 1, 'div');
    t.end();
});

test('nested expressions', (t) => {
    const expr = '(+ 2 (+ 8 4 2))';
    const result = lisp(expr);
    
    t.equal(result, 16, 'return sum');
    t.end();
});

test('expression: space before function', (t) => {
    const expr = '(+ 1 2 3 4)';
    const result = lisp(expr);
    
    t.equal(result, 10, 'sum');
    t.end();
});

test('expression: head', (t) => {
    const expr = '(head \'(1 2 3 4))';
    const result = lisp(expr);
    
    t.equal(result, 1, 'head');
    t.end();
});

test('expression: tail', (t) => {
    const expr = '(tail \'(1 2 3 4))';
    const result = lisp(expr);
    
    t.deepEqual(result, [2, 3, 4], 'tail');
    t.end();
});

test('expression: print', (t) => {
    const expr = '(print "hello world")';
    const {log} = console;
    console.log = stub();
    const result = lisp(expr);
    
    t.ok(console.log.calledWith('hello world'), 'should call console.log');
    
    console.log = log;
    t.end();
});

test('expression: car', (t) => {
    const expr = '(car \'(1 2 3 4))';
    const result = lisp(expr);
    
    t.equal(result, 1, 'car');
    t.end();
});

test('expression: cdr', (t) => {
    const expr = '(cdr \'(1 2 3 4))';
    const result = lisp(expr);
    
    t.deepEqual(result, [2, 3, 4], 'cdr');
    t.end();
});

test('error in expression: not a function', (t) => {
    const fn  = () => lisp('(+1 2 3 4)');
    
    t.throws(fn, /1 is not a function!/, 'should throw when not a function!');
    t.end();
});

test('no arguments', (t) => {
    t.throws(lisp, /expression should be string!/, 'should throw when no expression');
    t.end();
});

test('arguments: wrong type', (t) => {
    const fn  = () => lisp(1);
   
    t.throws(fn, /expression should be string!/, 'should throw when no expression');
    t.end();
});

test('throw: different count of parentheses', (t) => {
    const expr = '(+ 2 (+ 8 4 2)';
    const fn = () => lisp(expr);
    
    t.throws(fn,
        /different count of parentheses: open 2, close 1/,
        'should throw when different count of parentheses');
    
    t.end();
});
