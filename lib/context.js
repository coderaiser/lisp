'use strict';

module.exports = Context;

function Context(scope, parent) {
    this.scope = scope;
    this.parent = parent;
    
    this.get = function(identifier) {
        if (identifier in this.scope)
            return this.scope[identifier];
        
        if (this.parent)
            return this.parent.get(identifier);
    };
}
