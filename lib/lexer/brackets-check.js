'use strict';

const squad = require('squad');
const currify = require('currify');

const is = (type, value) => typeof value === type;
const isUndefined = currify(is, 'undefined');

module.exports = (tokens) => {
    const openCount = incMonad();
    const closeCount = incMonad();
    
    const ifOpen = ifCondition(openCount, '(');
    const ifClose = ifCondition(closeCount, ')');
    
    tokens.forEach(squad(ifOpen, ifClose));
    checkMonads(openCount, closeCount);
    
    return tokens;
};

const ifCondition = currify((fn, ideal, value) => {
    if (value !== ideal)
        return value;
    
    fn(value);
});

const checkMonads = (f, g) => {
    if (f() !== g())
        throw Error(`different count of parentheses: open ${ f() }, close ${ g() }`);
};

function incMonad() {
    let i = 0;
    
    return (value) => {
        if (isUndefined(value))
            return i;
        
        i++;
        return value;
    };
}

