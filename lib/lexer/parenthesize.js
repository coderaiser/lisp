'use strict';

const squad = require('squad');
const categorize = require('./categorize');
const getList = squad(categorize, makeList);

module.exports = parenthesize;

function parenthesize(input, list) {
    check(input);
    
    if (!list)
        return parenthesize(input, []);
    
    const token = input.shift();
    
    if (!token)
        return list.pop();
    
    if (isList(token, input)) {
        list.push(getList(input));
        cutList(input);
        return list;
    }
    
    if (token === '(') {
        list.push(parenthesize(input, []));
        return parenthesize(input, list);
    }
    
    if (token === ')')
        return list;
    
    return parenthesize(input, list.concat(categorize(token)));
}

function check(input) {
    if (!Array.isArray(input))
        throw Error('input should be an array!');
}

function isList(token, input) {
    return token === '\'' && input[0] === '(';
}

function makeList(input) {
    const closeIndex = input.indexOf(')');
    
    return input.slice(1, closeIndex);
}

function cutList(input) {
    const closeIndex = input.indexOf(')');
    
    input.splice(0, closeIndex + 2);
}

