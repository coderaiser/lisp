'use strict';

var squad = require('squad');
var apart = require('apart');

var interpret = require('./interpret');
var parenthesize = require('./parenthesize');
var tokenize = require('./tokenize');
var bracketsCheck = require('./brackets-check');
var check = require('./check');

var checkString = apart(check, 'string');
var checkExpression = apart(checkString, 'expression');

var lisp = squad(interpret, parenthesize, bracketsCheck, tokenize, checkExpression);

module.exports = lisp;