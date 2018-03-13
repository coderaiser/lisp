'use strict';

const squad = require('squad/legacy');
const currify = require('currify/legacy');

const interpret = require('./interpret');
const lexer = require('./lexer');

module.exports = squad(
    interpret,
    lexer,
);

