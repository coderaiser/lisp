'use strict';

const lexer = require('.');
const test = require('tape');

test('lisp: lexer: sum', (t) => {
    const result = lexer('(+ 2 3 4)');
    const expected = [{
        type: 'identifier',
        value: '+'
    }, {
        type: 'literal',
        value: 2
    }, {
        type: 'literal',
        value: 3
    }, {
        type: 'literal',
        value: 4
    }];
    
    t.deepEqual(result, expected, 'should equal');
    t.end();
});

test('lisp: lexer: sum: strings', (t) => {
    const result = lexer('(+ "hello" " world")');
    const expected = [{
        type: 'identifier',
        value: '+' 
    }, {
        type: 'literal',
        value: 'hello'
    }, {
        type: 'literal',
        value: ' world'
    }]
    
    t.deepEqual(result, expected, 'should equal');
    t.end();
});

test('lisp: lexer: list: head: strings', (t) => {
    const result = lexer('(head \'("hello" "world"))');
    const expected = [{
        type: 'identifier',
        value: 'head'
    }, {
        type: 'literal',
        value: [ 'hello', 'world' ]
    }];
    
    t.deepEqual(result, expected, 'should equal');
    t.end();
});

test('lisp: lexer: list: head: head', (t) => {
    const fn = () => lexer('(head \'(tail "hello" "world"))');
    
    t.throws(fn, /Unexpected list item value: "tail"/, 'should throw');
    t.end();
});

