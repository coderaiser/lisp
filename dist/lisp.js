require=(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function(global) {
    'use strict';
    
    if (typeof module !== 'undefined' && module.exports)
        module.exports  = squad;
    else
        global.squad    = squad;
    
    function squad() {
        var funcs = []
                .slice.call(arguments)
                .reverse();
                
        check('function', funcs);
        
        return function() {
            return funcs
                .reduce(apply, arguments)
                .pop();
        };
    }
    
    function apply(value, fn) {
        return [fn.apply(null, value)];
    }
    
    function check(type, array) {
        var wrongType   = partial(wrong, type),
            notType     = partial(notEqual, type);
        
        if (!array.length)
            wrongType(type);
        else
            array
                .map(getType)
                .filter(notType)
                .forEach(wrongType);
    }
    
    function partial(fn, value) {
        return fn.bind(null, value);
    }
    
    function getType(item) {
        return typeof item;
    }
    
    function notEqual(a, b) {
        return a !== b;
    }
    
    function wrong(type) {
        throw Error('fn should be ' + type + '!');
    }
    
})(this);

},{}],"lisp":[function(require,module,exports){
'use strict';

(function () {
    'use strict';

    var squad = require('squad');

    module.exports = lisp;

    var checkString = partial(check, 'string');
    var checkExpression = partial(checkString, 'expression');

    function lisp(expression) {
        checkExpression(expression);

        var exps = split(expression).filter(not(empty)).filter(not(space)).reverse();

        return exps.reduce(function (value, exp) {
            return parse(exp + value);
        }, '');

        function split(value) {
            return value.split(/\(|\)/);
        }
    }

    var engine = machine();

    var operation = {
        '+': calc(function (a, b) {
            return a + b;
        }),
        '-': calc(function (a, b) {
            return a - b;
        }),
        '*': calc(function (a, b) {
            return a * b;
        }),
        '/': calc(function (a, b) {
            return a / b;
        }),

        'head': head,
        'tail': tail
    };

    Object.keys(operation).forEach(function (name) {
        var fn = squad(guessType, operation[name]);

        engine(name, fn);
    });

    function calc(operation) {
        return function (args) {
            return args.map(Number).reduce(operation);
        };
    }

    function guessType(value) {
        var result;

        if (/^\d$/.test(value)) result = Number(value);else if (Array.isArray(value)) result = value.map(guessType);else result = value;

        return result;
    }

    function parse(expression) {
        var exp = split(expression).filter(not(empty)).filter(not(spec));

        var fn = exp.slice(0, 1).pop();
        var args = exp.slice(1);

        return engine(fn)(args);

        function split(value) {
            return value.split(/^\(|\s|\)$/);
        }
    }

    function machine() {
        var operation = {},
            engine = function engine(name, fn) {
            var value;

            if (arguments.length === 2) set(name, fn);else value = get(name);

            return value;
        };

        function get(name) {
            return (check(name), operation[name]);
        }

        function set(name, fn) {
            operation[name] = fn;
        }

        function check(name) {
            if (!operation[name]) throw Error(name + ' is not a function!');
        }

        return engine;
    }

    function not(fn) {
        return function () {
            return !fn.apply(null, arguments);
        };
    }

    function empty(a) {
        return !a;
    }

    function space(value) {
        return (/^(\s)*$/.test(value)
        );
    }

    function spec(a) {
        return (/\(|\)|\s/.test(a)
        );
    }

    function head(args) {
        return args[0];
    }

    function tail(args) {
        return slice(args, 1);
    }

    function check(type, name, value) {
        if (typeof value !== type) throw Error(name + ' should be string!');
    }

    function slice(array, from, to) {
        return [].slice.call(array, from, to);
    }

    function partial(fn) {
        var first = tail(arguments);

        return function () {
            var last = slice(arguments),
                args = first.concat(last);

            fn.apply(null, args);
        };
    }
})();
},{"squad":1}]},{},[]);
