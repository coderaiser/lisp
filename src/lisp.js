'use strict';

let squad           = require('squad');
let apart           = require('apart');

let interpret       = require('./interpret');
let parenthesize    = require('./parenthesize');
let tokenize        = require('./tokenize');
let bracketsCheck   = require('./brackets-check');
let check           = require('./check');

let checkString     = apart(check, 'string');
let checkExpression = apart(checkString, 'expression');

let lisp            = squad(
    interpret,
    parenthesize,
    bracketsCheck,
    tokenize,
    checkExpression
);

module.exports      = lisp;
