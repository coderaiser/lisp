'use strict';

/* browserify could not handle expression in require */
module.exports = {
    print   : require('print'),
    '+'     : require('sum'),
    '-'     : require('subs'),
    '*'     : require('multiply'),
    '/'     : require('divide')
};
