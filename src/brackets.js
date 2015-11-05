'use strict';

let squad       = require('squad');

module.exports  = () => {
    let openCount   = incMonad();
    let closeCount  = incMonad();
    
    let fn = processParenthese(openCount, closeCount);
    
    fn.check = () =>
        checkMonads(openCount, closeCount);
    
    return fn;
};

let ifCondition = (fn, ideal) => 
    value =>
        value !== ideal ?
            value
            :
            fn(value);

let processParenthese       = (openCount, closeCount) => {
    let ifOpen      = ifCondition(openCount, '(');
    let ifClose     = ifCondition(closeCount, ')');
    
    return squad(ifOpen, ifClose);
};

let checkMonads         = function(f, g) {
    if (f() !== g())
        throw Error(`different count of parentheses: open ${ f() }, close ${ g() }`);
};

function incMonad() {
    let i = 0;
    
    return value => {
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
