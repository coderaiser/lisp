'use strict';

var squad = require('squad');

var interpret = require('./interpret');
var parenthesize = require('./parenthesize');
var tokenize = require('./tokenize');

var partial = require('partial');
var check = require('check');

var checkString = partial(check, 'string');
var checkExpression = partial(checkString, 'expression');

var lisp = squad(interpret, parenthesize, tokenize, checkExpression);

module.exports = lisp;