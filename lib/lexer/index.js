'use strict';

const squad = require('squad/legacy');
const currify = require('currify/legacy');

const parenthesize = require('./parenthesize');
const tokenize = require('./tokenize');
const bracketsCheck = require('./brackets-check');
const check = require('../check');

const checkExpression = currify(check, 'string', 'expression');

module.exports = squad(
    parenthesize,
    bracketsCheck,
    tokenize,
    checkExpression,
);

