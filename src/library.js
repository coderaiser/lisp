'use strict';

/* browserify could not handle expression in require */
module.exports = {
    head    : require('head'),
    tail    : require('tail'),
    print   : require('print'),
    '+'     : require('sum'),
    '-'     : require('subs'),
    '*'     : require('multiply'),
    '/'     : require('divide')
};
