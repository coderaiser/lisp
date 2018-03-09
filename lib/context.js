'use strict';

module.exports = Context;

function Context(scope, parent) {
    this.scope = scope;
    this.parent = parent;
    
    this.get = function(identifier) {
        let result;
        
        if (identifier in this.scope)
            result = this.scope[identifier];
        else if (this.parent)
            result = this.parent.get(identifier);
        
        return result;
    };
}
