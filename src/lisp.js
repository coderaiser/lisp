'use strict';

const squad = require('squad/legacy');
const currify = require('currify/legacy');

const interpret = require('./interpret');
const parenthesize = require('./parenthesize');
const tokenize = require('./tokenize');
const bracketsCheck = require('./brackets-check');
const check = require('./check');

const checkString = currify(check, 'string');
const checkExpression = checkString('expression');

const lisp = squad(
    interpret,
    parenthesize,
    bracketsCheck,
    tokenize,
    checkExpression
);

module.exports = lisp;
