'use strict';

var squad = require('squad');

module.exports = function () {
    var openCount = incMonad();
    var closeCount = incMonad();

    var fn = processParenthese(openCount, closeCount);

    fn.check = function () {
        return checkMonads(openCount, closeCount);
    };

    return fn;
};

var ifCondition = function ifCondition(fn, ideal) {
    return function (value) {
        return value !== ideal ? value : fn(value);
    };
};

var processParenthese = function processParenthese(openCount, closeCount) {
    var ifOpen = ifCondition(openCount, '(');
    var ifClose = ifCondition(closeCount, ')');

    return squad(ifOpen, ifClose);
};

var checkMonads = function checkMonads(f, g) {
    if (f() !== g()) throw Error('different count of parentheses: open ' + f() + ', close ' + g());
};

function incMonad() {
    var i = 0;

    return function (value) {
        var result;

        if (!value) {
            result = i;
        } else {
            result = value;
            i++;
        }

        return result;
    };
}