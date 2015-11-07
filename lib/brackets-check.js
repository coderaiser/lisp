'use strict';

var squad = require('squad');

var is = require('is');
var partial = require('partial');
var isUndefined = partial(is, 'undefined');

module.exports = function (tokens) {
    var openCount = incMonad();
    var closeCount = incMonad();

    var ifOpen = ifCondition(openCount, '(');
    var ifClose = ifCondition(closeCount, ')');

    tokens.forEach(squad(ifOpen, ifClose));
    checkMonads(openCount, closeCount);

    return tokens;
};

var ifCondition = function ifCondition(fn, ideal) {
    return function (value) {
        return value !== ideal ? value : fn(value);
    };
};

var checkMonads = function checkMonads(f, g) {
    if (f() !== g()) throw Error('different count of parentheses: open ' + f() + ', close ' + g());
};

function incMonad() {
    var i = 0;

    return function (value) {
        if (isUndefined(value)) {
            return i;
        } else {
            i++;
            return value;
        }
    };
}