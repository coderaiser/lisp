(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.lisp = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

function _typeof(obj) { return obj && typeof Symbol !== "undefined" && obj.constructor === Symbol ? "symbol" : typeof obj; }

var squad = require('squad');
var apart = require('apart');

var is = function is(type, value) {
    return (typeof value === 'undefined' ? 'undefined' : _typeof(value)) === type;
};
var isUndefined = apart(is, 'undefined');

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
        if (isUndefined(value)) {
            return i;
        } else {
            i++;
            return value;
        }
    };
}
},{"apart":10,"squad":11}],2:[function(require,module,exports){
'use strict';

module.exports = categorize;

var apart = require('apart');

var check = require('./check');
var library = require('./library');

var head = library.head;
var last = library.last;

var checkString = apart(check, 'string');
var checkInput = apart(checkString, 'input');

function categorize(input) {
    checkInput(input);

    var result = undefined;
    var num = Number(input);

    if (!isNaN(num)) result = {
        type: 'literal',
        value: num
    };else if (wrapedByQuotes(input)) {
        result = {
            type: 'literal',
            value: input.slice(1, -1) };
    } else result = {
        type: 'identifier',
        value: input
    };

    return result;
}

function wrapedByQuotes(value) {
    return head(value) === '"' && last(value) === '"';
}
},{"./check":3,"./library":7,"apart":10}],3:[function(require,module,exports){
'use strict';

function _typeof(obj) { return obj && typeof Symbol !== "undefined" && obj.constructor === Symbol ? "symbol" : typeof obj; }

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
        var result = undefined;

        if (identifier in this.scope) result = this.scope[identifier];else if (this.parent) result = this.parent.get(identifier);

        return result;
    };
}
},{}],5:[function(require,module,exports){
'use strict'

/* should be exported before require of interpret */
;

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i]; return arr2; } else { return Array.from(arr); } }

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
        var result = undefined;
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

var categorize = require('./categorize');

module.exports = parenthesize;

function parenthesize(input, list) {
    check(input);

    var token;

    if (!list) {
        return parenthesize(input, []);
    } else {
        token = input.shift();

        if (!token) {
            return list.pop();
        } else if (token === '(') {
            list.push(parenthesize(input, []));
            return parenthesize(input, list);
        } else if (token === ')') {
            return list;
        } else {
            return parenthesize(input, list.concat(categorize(token)));
        }
    }
}

function check(input) {
    if (!Array.isArray(input)) throw Error('input should be an array!');
}
},{"./categorize":2}],9:[function(require,module,exports){
'use strict';

var apart = require('apart');

var isString = function isString(str) {
    return typeof str === 'string';
};
var addSpaces = function addSpaces(a) {
    return ' ' + a + ' ';
};

module.exports = tokenize;

function tokenize(expression) {
    check(expression);

    var marker = generateStr(expression);

    return expression.split('"').map(apart(spacesInQuotes, addSpaces, marker)).join('"').split(' ').filter(Boolean).map(function (x) {
        return x.replace(RegExp(marker, 'g'), ' ');
    });
}

function spacesInQuotes(strProcess, marker, x, i) {
    return i % 2 === 0 ? notInString(strProcess, x) : inString(marker, x);
}

function inString(marker, x) {
    return x.replace(/ /g, marker);
}

function notInString(strProcess, x) {
    var str = x.replace(/\(|\)/g, strProcess);

    return str;
}

function check(str) {
    if (!isString(str)) throw Error('expression should be string!');
}

var uniq = function uniq(expression, str) {
    return ~expression.indexOf(str);
};
var generateRandom = function generateRandom() {
    return '>---' + Math.random() + '---<';
};

function generateStr(expression) {
    var str = undefined;

    do str = generateRandom(); while (uniq(expression, str));

    return str;
}
},{"apart":10}],10:[function(require,module,exports){
'use strict';

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i]; return arr2; } else { return Array.from(arr); } }

var tail = function tail(list) {
    return slice(list, 1);
};

module.exports = apart;

function apart(fn) {
    check(fn);

    var first = tail(arguments);

    return function () {
        var args = [].concat(_toConsumableArray(first), Array.prototype.slice.call(arguments));

        return fn.apply(undefined, _toConsumableArray(args));
    };
}

function slice(list, from, to) {
    return [].slice.call(list, from, to);
}

function check(fn) {
    if (typeof fn !== 'function') throw Error('fn should be function!');
}
},{}],11:[function(require,module,exports){
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

var squad = require('squad');
var apart = require('apart');

var interpret = require('./interpret');
var parenthesize = require('./parenthesize');
var tokenize = require('./tokenize');
var bracketsCheck = require('./brackets-check');
var check = require('./check');

var checkString = apart(check, 'string');
var checkExpression = apart(checkString, 'expression');

var lisp = squad(interpret, parenthesize, bracketsCheck, tokenize, checkExpression);

module.exports = lisp;
},{"./brackets-check":1,"./check":3,"./interpret":6,"./parenthesize":8,"./tokenize":9,"apart":10,"squad":11}]},{},["lisp"])("lisp")
});