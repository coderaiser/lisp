'use strict';

let squad           = require('squad');
let currify         = require('currify/legacy');

let interpret       = require('./interpret');
let parenthesize    = require('./parenthesize');
let tokenize        = require('./tokenize');
let bracketsCheck   = require('./brackets-check');
let check           = require('./check');

let checkString     = currify(check, 'string');
let checkExpression = checkString('expression');

let lisp            = squad(
    interpret,
    parenthesize,
    bracketsCheck,
    tokenize,
    checkExpression
);

module.exports      = lisp;
