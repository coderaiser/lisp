'use strict';

var squad = require('squad');

var interpret = require('./interpret');
var parenthesize = require('./parenthesize');
var tokenize = require('./tokenize');
var bracketsCheck = require('./brackets-check');

var apart = require('apart');
var check = require('check');

var checkString = apart(check, 'string');
var checkExpression = apart(checkString, 'expression');

var lisp = squad(interpret, parenthesize, bracketsCheck, tokenize, checkExpression);

module.exports = lisp;