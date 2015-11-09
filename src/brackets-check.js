'use strict';

let squad       = require('squad');

let is          = require('is');
let apart       = require('apart');
let isUndefined = apart(is, 'undefined');

module.exports  = tokens => {
    let openCount   = incMonad();
    let closeCount  = incMonad();
    
    let ifOpen      = ifCondition(openCount, '(');
    let ifClose     = ifCondition(closeCount, ')');
    
    tokens.forEach(squad(ifOpen, ifClose));
    checkMonads(openCount, closeCount);
    
    return tokens;
};

let ifCondition = (fn, ideal) => 
    value =>
        value !== ideal ?
            value
            :
            fn(value);

let checkMonads         = (f, g) => {
    if (f() !== g())
        throw Error(`different count of parentheses: open ${ f() }, close ${ g() }`);
};

function incMonad() {
    let i = 0;
    
    return value => {
        if (isUndefined(value)) {
            return i;
        } else {
            i++;
            return value;
        }
    };
}
