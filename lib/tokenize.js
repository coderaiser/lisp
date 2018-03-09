'use strict';

let isString    = str => typeof str === 'string';

module.exports = tokenize;

let regexp  = /^\s*((\r|\n|$)|#;|#\||#\\[^\w]|#?(\(|\[|{)|\)|\]|}|\'|`|,@|,|\+inf\.0|-inf\.0|\+nan\.0|\"(\\(.|$)|[^\"\\])*(\"|$)|[^\s()\[\]{}]+)/;

function tokenize(expression) {
    check(expression);
    
    let tokens  = [];
    let txt     = expression;
    let add     = (array, token) => {
        tokens.push(token);
        
        return '';
    };
    
    while(txt)
        txt = txt.replace(regexp, add);
    
    return tokens;
}

function check(str) {
    if (!isString(str))
        throw Error('expression should be string!');
}
