'use strict';

let squad           = require('squad');

let interpret       = require('./interpret');
let parenthesize    = require('./parenthesize');
let tokenize        = require('./tokenize');
let bracketsCheck   = require('./brackets-check');

let partial         = require('partial');
let check           = require('check');

let checkString     = partial(check, 'string');
let checkExpression = partial(checkString, 'expression');

let lisp            = squad(
    interpret,
    parenthesize,
    bracketsCheck,
    tokenize,
    checkExpression
);

module.exports      = lisp;
