(function() {
    'use strict';
    
    const squad         = require('squad');
    
    module.exports      = lisp;
    
    let checkString     = partial(check, 'string');
    let checkExpression = partial(checkString, 'expression');
    
    function lisp(expression) {
        checkExpression(expression);
        
        let exps = split(expression)
            .filter(not(empty))
            .filter(not(space))
            .reverse();
        
        return exps
            .reduce((value, exp) => 
                parse(exp + value), '');
        
        function split(value) {
            return value.split(/\(|\)/);
        }
    }
    
    var engine      = machine();
    
    var operation   = {
        '+': calc((a, b) => a + b),
        '-': calc((a, b) => a - b),
        '*': calc((a, b) => a * b),
        '/': calc((a, b) => a / b),
        
        'head': head,
        'tail': tail
    };
    
    Object
        .keys(operation)
        .forEach(name => {
            let fn = squad(guessType, operation[name]);
            
            engine(name, fn);
        });
    
    function calc(operation) {
        return args =>
            args.map(Number)
                .reduce(operation);
    }
    
    function guessType(value) {
        var result;
        
        if (/^\d$/.test(value))
            result = Number(value);
        else if (Array.isArray(value))
            result = value.map(guessType);
        else
            result = value;
        
        return result;
    }
    
    function parse(expression) {
        var exp = split(expression)
                .filter(not(empty))
                .filter(not(spec));
        
        var fn = exp.slice(0, 1).pop();
        var args = exp.slice(1);
        
        return engine(fn)(args);
        
        function split(value) {
            return value.split(/^\(|\s|\)$/);
        }
    }
    
    function machine() {
        var operation = {},
            engine = function(name, fn) {
                var value;
                
                if (arguments.length === 2)
                    set(name, fn);
                else
                    value = get(name);
                
                return value;
            };
        
        function get(name) {
            return check(name), operation[name];
        }
        
        function set(name, fn) {
            operation[name] = fn;
        }
        
        function check(name) {
            if (!operation[name])
                throw Error(`${ name } is not a function!`);
        }
        
        return engine;
    }
    
   function not(fn) {
        return function() {
            return !fn.apply(null, arguments);
        };
    }
    
    function empty(a) {
        return !a;
    }
    
    function space(value) {
        return /^(\s)*$/.test(value);
    }
    
    function spec(a) {
        return /\(|\)|\s/.test(a);
    }
    
    function head(args) {
        return args[0];
    }
    
    function tail(args) {
        return slice(args, 1);
    }
    
    function check(type, name, value) {
        if (typeof value !== type)
            throw Error(name + ' should be string!');
    }
    
    function slice(array, from, to) {
        return [].slice.call(array, from, to);
    }
    
    function partial(fn) {
        let first = tail(arguments);
        
        return function() {
            let last    = slice(arguments),
                args    = first.concat(last);
            
            fn.apply(null, args);
        };
    }
})();
