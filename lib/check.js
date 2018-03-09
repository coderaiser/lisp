'use strict';

const is = (type, value) => typeof value === type;

module.exports = (type, name, value) => {
    if (!is(type, value))
        throw Error(`${ name } should be ${ type }!`);
    
    return value;
};

