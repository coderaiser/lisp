(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.lisp = f()}})(function(){var define,module,exports;return (function(){function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s}return e})()({1:[function(require,module,exports){
'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var squad = require('squad/legacy');
var currify = require('currify/legacy');

var is = function is(type, value) {
    return (typeof value === 'undefined' ? 'undefined' : _typeof(value)) === type;
};
var isUndefined = currify(is, 'undefined');

module.exports = function (tokens) {
    var openCount = incMonad();
    var closeCount = incMonad();

    var ifOpen = ifCondition(openCount, '(');
    var ifClose = ifCondition(closeCount, ')');

    tokens.forEach(squad(ifOpen, ifClose));
    checkMonads(openCount, closeCount);

    return tokens;
};

var ifCondition = function ifCondition(fn, ideal) {
    return function (value) {
        return value !== ideal ? value : fn(value);
    };
};

var checkMonads = function checkMonads(f, g) {
    if (f() !== g()) throw Error('different count of parentheses: open ' + f() + ', close ' + g());
};

function incMonad() {
    var i = 0;

    return function (value) {
        if (isUndefined(value)) return i;

        i++;
        return value;
    };
}
},{"currify/legacy":10,"squad/legacy":12}],2:[function(require,module,exports){
'use strict';

module.exports = categorize;

var library = require('./library');

var head = library.head;
var last = library.last;

var isString = function isString(value) {
    return typeof value === 'string';
};
var isArray = Array.isArray;
var isType = function isType(value) {
    return isString(value) || isArray(value);
};

var check = function check(value) {
    if (!isType(value)) throw Error('input should be string or array!');
};

function categorize(input) {
    check(input);

    if (!isNaN(input)) return {
        type: 'literal',
        value: Number(input)
    };

    if (Array.isArray(input)) return {
        type: 'literal',
        value: input.map(parseInput)
    };

    if (wrapedByQuotes(input)) return {
        type: 'literal',
        value: unwrap(input)
    };

    return {
        type: 'identifier',
        value: input
    };
}

function parseInput(value) {
    if (wrapedByQuotes(value)) return unwrap(value);

    if (!isNaN(value)) return Number(value);

    return value;
}

function unwrap(input) {
    return input.slice(1, -1);
}

function wrapedByQuotes(value) {
    return head(value) === '"' && last(value) === '"';
}
},{"./library":7}],3:[function(require,module,exports){
'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var is = function is(type, value) {
    return (typeof value === 'undefined' ? 'undefined' : _typeof(value)) === type;
};

module.exports = function (type, name, value) {
    if (!is(type, value)) throw Error(name + ' should be ' + type + '!');

    return value;
};
},{}],4:[function(require,module,exports){
'use strict';

module.exports = Context;

function Context(scope, parent) {
    this.scope = scope;
    this.parent = parent;

    this.get = function (identifier) {
        var result = void 0;

        if (identifier in this.scope) result = this.scope[identifier];else if (this.parent) result = this.parent.get(identifier);

        return result;
    };
}
},{}],5:[function(require,module,exports){
'use strict';

/* should be exported before require of interpret */

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

module.exports = interpretList;

var interpret = require('./interpret');
var Context = require('./context');
var library = require('./library');

var head = library.head;
var tail = library.tail;

var isFunction = function isFunction(fn) {
    return typeof fn === 'function';
};

var special = {
    let: function _let(input, context) {
        var letContext = input[1].reduce(function (acc, x) {
            acc.scope[x[0].value] = interpret(x[1], context);

            return acc;
        }, new Context({}, context));

        return interpret(input[2], letContext);
    },

    lambda: function lambda(input, context) {
        return function () {
            var lambdaArguments = arguments,
                lambdaScope = input[1].reduce(function (acc, x, i) {
                acc[x.value] = lambdaArguments[i];
                return acc;
            }, {}),
                newContext = new Context(lambdaScope, context);

            return interpret(input[2], newContext);
        };
    },

    if: function _if(input, context) {
        return interpret(input[1], context) ? interpret(input[2], context) : interpret(input[3], context);
    }
};

var checkFunction = function checkFunction(name, value) {
    if (!isFunction(value)) throw Error(name + ' is not a function!');
};

function interpretList(input, context) {
    var first = head(input);

    if (input.length && first.value in special) {
        return special[first.value](input, context);
    } else {
        var fnData = input[0];

        var list = input.map(function (x) {
            return interpret(x, context);
        });

        var fn = head(list);

        checkFunction(fnData.value, fn);

        return fn.apply(undefined, _toConsumableArray(tail(list)));
    }
}
},{"./context":4,"./interpret":6,"./library":7}],6:[function(require,module,exports){
'use strict';

(function () {
    'use strict';

    module.exports = interpret;

    var Context = require('./context'),
        library = require('./library'),
        interpretList = require('./interpret-list');

    var isArray = Array.isArray;

    function interpret(input, context) {
        var result = void 0;
        var ctx = context || new Context(library);

        if (isArray(input)) result = interpretList(input, ctx);else if (input.type === 'identifier') result = ctx.get(input.value);else // literal
            result = input.value;

        return result;
    }
})();
},{"./context":4,"./interpret-list":5,"./library":7}],7:[function(require,module,exports){
'use strict';

module.exports = {
    print: print,
    head: head,
    tail: tail,
    last: last,
    car: head,
    cdr: tail,
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
    })
};

function print(x) {
    console.log(x);
    return x;
}

function last(list) {
    return head(slice(list, -1));
}

function head(list) {
    return list[0];
}

function tail(list) {
    return slice(list, 1);
}

function calc(operation) {
    return function () {
        return [].reduce.call(arguments, operation);
    };
}

function slice(array, from, to) {
    return [].slice.call(array, from, to);
}
},{}],8:[function(require,module,exports){
'use strict';

var squad = require('squad/legacy');
var categorize = require('./categorize');
var getList = squad(categorize, makeList);

module.exports = parenthesize;

function parenthesize(input, list) {
    check(input);

    if (!list) return parenthesize(input, []);

    var token = input.shift();

    if (!token) return list.pop();

    if (isList(token, input)) {
        list.push(getList(input));
        cutList(input);
        return list;
    }

    if (token === '(') {
        list.push(parenthesize(input, []));
        return parenthesize(input, list);
    }

    if (token === ')') return list;

    return parenthesize(input, list.concat(categorize(token)));
}

function check(input) {
    if (!Array.isArray(input)) throw Error('input should be an array!');
}

function isList(token, input) {
    return token === '\'' && input[0] === '(';
}

function makeList(input) {
    var closeIndex = input.indexOf(')');

    return input.slice(1, closeIndex);
}

function cutList(input) {
    var closeIndex = input.indexOf(')');

    input.splice(0, closeIndex + 2);
}
},{"./categorize":2,"squad/legacy":12}],9:[function(require,module,exports){
'use strict';

var isString = function isString(str) {
    return typeof str === 'string';
};

module.exports = tokenize;

var regexp = /^\s*((\r|\n|$)|#;|#\||#\\[^\w]|#?(\(|\[|{)|\)|\]|}|\'|`|,@|,|\+inf\.0|-inf\.0|\+nan\.0|\"(\\(.|$)|[^\"\\])*(\"|$)|[^\s()\[\]{}]+)/;

function tokenize(expression) {
    check(expression);

    var tokens = [];
    var txt = expression;
    var add = function add(array, token) {
        tokens.push(token);

        return '';
    };

    while (txt) {
        txt = txt.replace(regexp, add);
    }return tokens;
}

function check(str) {
    if (!isString(str)) throw Error('expression should be string!');
}
},{}],10:[function(require,module,exports){
module.exports = require('./lib/currify');

},{"./lib/currify":11}],11:[function(require,module,exports){
'use strict';

var f = function f(fn) {
    return [
    /*eslint no-unused-vars: 0*/
    function (a) {
        return fn.apply(undefined, arguments);
    }, function (a, b) {
        return fn.apply(undefined, arguments);
    }, function (a, b, c) {
        return fn.apply(undefined, arguments);
    }, function (a, b, c, d) {
        return fn.apply(undefined, arguments);
    }, function (a, b, c, d, e) {
        return fn.apply(undefined, arguments);
    }];
};

module.exports = function currify(fn) {
    for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        args[_key - 1] = arguments[_key];
    }

    check(fn);

    if (args.length >= fn.length) return fn.apply(undefined, args);

    var again = function again() {
        return currify.apply(undefined, [fn].concat(args, Array.prototype.slice.call(arguments)));
    };

    var count = fn.length - args.length - 1;
    var func = f(again)[count];

    return func || again;
};

function check(fn) {
    if (typeof fn !== 'function') throw Error('fn should be function!');
}
},{}],12:[function(require,module,exports){
module.exports = require('./squad');

},{"./squad":13}],13:[function(require,module,exports){
'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

module.exports = function () {
    for (var _len = arguments.length, funcs = Array(_len), _key = 0; _key < _len; _key++) {
        funcs[_key] = arguments[_key];
    }

    check('function', funcs);

    return function () {
        for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
            args[_key2] = arguments[_key2];
        }

        return funcs.reduceRight(apply, args).pop();
    };
};

function apply(value, fn) {
    return [fn.apply(undefined, _toConsumableArray(value))];
}

function check(type, array) {
    var wrongType = partial(wrong, type);
    var notType = partial(notEqual, type);

    if (!array.length) return wrongType(type);

    array.map(getType).filter(notType).forEach(wrongType);
}

function partial(fn, value) {
    return fn.bind(null, value);
}

function getType(item) {
    return typeof item === 'undefined' ? 'undefined' : _typeof(item);
}

function notEqual(a, b) {
    return a !== b;
}

function wrong(type) {
    throw Error('fn should be ' + type + '!');
}
},{}],"lisp":[function(require,module,exports){
'use strict';

var squad = require('squad/legacy');
var currify = require('currify/legacy');

var interpret = require('./interpret');
var parenthesize = require('./parenthesize');
var tokenize = require('./tokenize');
var bracketsCheck = require('./brackets-check');
var check = require('./check');

var checkString = currify(check, 'string');
var checkExpression = checkString('expression');

var lisp = squad(interpret, parenthesize, bracketsCheck, tokenize, checkExpression);

module.exports = lisp;
},{"./brackets-check":1,"./check":3,"./interpret":6,"./parenthesize":8,"./tokenize":9,"currify/legacy":10,"squad/legacy":12}]},{},["lisp"])("lisp")
});