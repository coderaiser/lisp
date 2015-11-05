(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.lisp = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

module.exports = categorize;

var head = require('head');
var last = require('last');
var check = require('check');
var partial = require('partial');

var checkString = partial(check, 'string');
var checkInput = partial(checkString, 'input');

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
},{"check":7,"head":9,"last":14,"partial":16}],2:[function(require,module,exports){
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
},{}],3:[function(require,module,exports){
'use strict'

/* should be exported before require of interpret */
;
module.exports = interpretList;

var interpret = require('./interpret');
var Context = require('./context');

var head = require('head');
var tail = require('tail');
var isFunction = require('is-function');

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

        return fn.call(null, tail(list));
    }
}
},{"./context":2,"./interpret":4,"head":9,"is-function":11,"tail":21}],4:[function(require,module,exports){
'use strict';

(function () {
    'use strict';

    module.exports = interpret;

    var Context = require('./context'),
        library = require('./library'),
        interpretList = require('./interpret-list');

    var isArray = require('is-array');

    function interpret(input, context) {
        var result = undefined;
        var ctx = context || new Context(library);

        if (isArray(input)) result = interpretList(input, ctx);else if (input.type === 'identifier') result = ctx.get(input.value);else // literal
            result = input.value;

        return result;
    }
})();
},{"./context":2,"./interpret-list":3,"./library":5,"is-array":10}],5:[function(require,module,exports){
'use strict'

/* browserify could not handle expression in require */
;
module.exports = {
    head: require('head'),
    tail: require('tail'),
    print: require('print'),
    '+': require('sum'),
    '-': require('subs'),
    '*': require('multiply'),
    '/': require('divide')
};
},{"divide":8,"head":9,"multiply":15,"print":17,"subs":19,"sum":20,"tail":21}],6:[function(require,module,exports){
'use strict';

module.exports = function (operation) {
    return function (args) {
        return args.map(Number).reduce(operation);
    };
};
},{}],7:[function(require,module,exports){
'use strict';

var is = require('is');

module.exports = function (type, name, value) {
    if (!is(type, value)) throw Error(name + ' should be ' + type + '!');

    return value;
};
},{"is":13}],8:[function(require,module,exports){
'use strict';

var calc = require('./calc');

module.exports = calc(function (a, b) {
  return a / b;
});
},{"./calc":6}],9:[function(require,module,exports){
'use strict';

module.exports = function (list) {
  return list[0];
};
},{}],10:[function(require,module,exports){
'use strict';

module.exports = function (list) {
  return Array.isArray(list);
};
},{}],11:[function(require,module,exports){
'use strict';

var is = require('is');

module.exports = function (fn) {
    return is('function', fn);
};
},{"is":13}],12:[function(require,module,exports){
'use strict';

var is = require('is');

module.exports = function (str) {
    return is('string', str);
};
},{"is":13}],13:[function(require,module,exports){
'use strict';

function _typeof(obj) { return obj && typeof Symbol !== "undefined" && obj.constructor === Symbol ? "symbol" : typeof obj; }

module.exports = function (type, value) {
  return (typeof value === 'undefined' ? 'undefined' : _typeof(value)) === type;
};
},{}],14:[function(require,module,exports){
'use strict';

var slice = require('./slice');
var head = require('./head');

module.exports = function (list) {
  return head(slice(list, -1));
};
},{"./head":9,"./slice":18}],15:[function(require,module,exports){
'use strict';

var calc = require('./calc');

module.exports = calc(function (a, b) {
  return a * b;
});
},{"./calc":6}],16:[function(require,module,exports){
'use strict';

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i]; return arr2; } else { return Array.from(arr); } }

var tail = require('./tail');
var slice = require('./slice');

module.exports = partial;

function partial(fn) {
    var first = tail(arguments);

    return function () {
        var last = slice(arguments),
            args = [].concat(_toConsumableArray(first), _toConsumableArray(last));

        return fn.apply(undefined, _toConsumableArray(args));
    };
}
},{"./slice":18,"./tail":21}],17:[function(require,module,exports){
'use strict';

module.exports = function (x) {
    console.log(x);
    return x;
};
},{}],18:[function(require,module,exports){
'use strict';

module.exports = function (array, from, to) {
    return [].slice.call(array, from, to);
};
},{}],19:[function(require,module,exports){
'use strict';

var calc = require('./calc');

module.exports = calc(function (a, b) {
  return a - b;
});
},{"./calc":6}],20:[function(require,module,exports){
'use strict';

var calc = require('./calc');

module.exports = calc(function (a, b) {
  return a + b;
});
},{"./calc":6}],21:[function(require,module,exports){
'use strict';

var slice = require('./slice');

module.exports = function (list) {
  return slice(list, 1);
};
},{"./slice":18}],22:[function(require,module,exports){
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
},{"./categorize":1}],23:[function(require,module,exports){
'use strict';

var partial = require('partial');
var isString = require('is-string');

module.exports = tokenize;

function tokenize(expression) {
    check(expression);

    var marker = generateStr(expression);

    return expression.split('"').map(partial(spacesInQuotes, marker)).join('"').split(' ').filter(Boolean).map(function (x) {
        return x.replace(RegExp(marker, 'g'), ' ');
    });
}

function spacesInQuotes(marker, x, i) {
    if (i % 2 === 0) {
        // not in string
        return x.replace(/\(/g, ' ( ').replace(/\)/g, ' ) ');
    } else {
        // in string
        return x.replace(/ /g, marker);
    }
}

function check(str) {
    if (!isString(str)) throw Error('expression should be string!');
}

var uniq = function uniq(expression, str) {
    return ~expression.indexOf(str);
};
var generateRandom = function generateRandom() {
    return '>--- ' + Math.random() + ' ---<';
};

function generateStr(expression) {
    var str;

    do str = generateRandom(); while (uniq(expression, str));

    return str;
}
},{"is-string":12,"partial":16}],24:[function(require,module,exports){
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

var interpret = require('./interpret');
var parenthesize = require('./parenthesize');
var tokenize = require('./tokenize');

var partial = require('partial');
var check = require('check');

var checkString = partial(check, 'string');
var checkExpression = partial(checkString, 'expression');

var lisp = squad(interpret, parenthesize, tokenize, checkExpression);

module.exports = lisp;
},{"./interpret":4,"./parenthesize":22,"./tokenize":23,"check":7,"partial":16,"squad":24}]},{},[1,2,3,4,5,"lisp",22,23])("lisp")
});