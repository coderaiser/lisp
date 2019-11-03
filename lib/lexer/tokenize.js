'use strict';

const isString = (str) => typeof str === 'string';

module.exports = tokenize;

const regexp = /^\s*((\r|\n|$)|#;|#\||#\\[^\w]|#?(\(|\[|{)|\)|\]|}|'|`|,@|,|\+inf\.0|-inf\.0|\+nan\.0|"(\\(.|$)|[^"\\])*("|$)|[^\s()[\]{}]+)/;
function tokenize(expression) {
    check(expression);
    
    const tokens = [];
    const add = (array, token) => {
        tokens.push(token);
        
        return '';
    };
    
    let txt = expression;
    
    while (txt)
        txt = txt.replace(regexp, add);
    
    return tokens;
}

function check(str) {
    if (!isString(str))
        throw Error('expression should be string!');
}
