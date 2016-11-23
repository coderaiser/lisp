'use strict';

var squad = require('squad');
var currify = require('currify/legacy');

var interpret = require('./interpret');
var parenthesize = require('./parenthesize');
var tokenize = require('./tokenize');
var bracketsCheck = require('./brackets-check');
var check = require('./check');

var checkString = currify(check, 'string');
var checkExpression = checkString('expression');

var lisp = squad(interpret, parenthesize, bracketsCheck, tokenize, checkExpression);

module.exports = lisp;