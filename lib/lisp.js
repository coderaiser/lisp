'use strict';

const squad = require('squad');

const interpret = require('./interpret');
const lexer = require('./lexer');

module.exports = squad(
    interpret,
    lexer,
);

