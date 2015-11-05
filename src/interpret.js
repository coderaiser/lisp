(function() {
    'use strict';
    
    module.exports      = interpret;
    
    let Context         = require('./context'),
        library         = require('./library'),
        interpretList   = require('./interpret-list');
    
    let isArray         = require('is-array');
    
    function interpret(input, context) {
        let result;
        let ctx = context || new Context(library);
        
        if (isArray(input))
            result = interpretList(input, ctx);
        else if (input.type === 'identifier')
            result = ctx.get(input.value);
        else // literal
            result = input.value;
        
        return result;
    }
})();
