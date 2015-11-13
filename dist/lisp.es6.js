(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.lisp = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i]; return arr2; } else { return Array.from(arr); } }

module.exports = currify;

var tail = function tail(list) {
    return [].slice.call(list, 1);
};

function currify(fn) {
    check(fn);

    var args = tail(arguments);

    if (args.length >= fn.length) return fn.apply(undefined, _toConsumableArray(args));else return function () {
        return currify.apply(undefined, [fn].concat(_toConsumableArray(args), Array.prototype.slice.call(arguments)));
    };
}

function check(fn) {
    if (typeof fn !== 'function') throw Error('fn should be function!');
}
},{}],2:[function(require,module,exports){
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

},{}],3:[function(require,module,exports){
'use strict';

let squad       = require('squad');
let currify     = require('currify');

let is          = (type, value) => typeof value === type;
let isUndefined = currify(is, 'undefined');

module.exports  = tokens => {
    let openCount   = incMonad();
    let closeCount  = incMonad();
    
    let ifOpen      = ifCondition(openCount, '(');
    let ifClose     = ifCondition(closeCount, ')');
    
    tokens.forEach(squad(ifOpen, ifClose));
    checkMonads(openCount, closeCount);
    
    return tokens;
};

let ifCondition = (fn, ideal) => 
    value =>
        value !== ideal ?
            value
            :
            fn(value);

let checkMonads         = (f, g) => {
    if (f() !== g())
        throw Error(`different count of parentheses: open ${ f() }, close ${ g() }`);
};

function incMonad() {
    let i = 0;
    
    return value => {
        if (isUndefined(value)) {
            return i;
        } else {
            i++;
            return value;
        }
    };
}

},{"currify":1,"squad":2}],4:[function(require,module,exports){
'use strict';

module.exports = categorize;

let library     = require('./library');

let head        = library.head;
let last        = library.last;

let isString    = value => typeof value === 'string';
let isArray     = Array.isArray;
let isType      = value => isString(value) || isArray(value);
let check       = value => {
    if (!isType(value))
        throw Error('input should be string or array!');
};

function categorize(input) {
    check(input);
    let result;
    
    if (!isNaN(input))
        result = {
            type: 'literal',
            value: Number(input)
        };
    else if (Array.isArray(input))
        result = {
            type: 'literal',
            value: input.map(parseInput)
        };
    else if (wrapedByQuotes(input))
        result = {
            type: 'literal',
            value: unwrap(input)
        };
    else
        result =  {
            type: 'identifier',
            value: input
        };
    
    return result;
 }

function parseInput(value) {
    if (wrapedByQuotes(value))
        return unwrap(value);
    else if (!isNaN(value))
        return Number(value);
    else
        return value;
}

function unwrap(input) {
    return input.slice(1, -1);
}

function wrapedByQuotes(value) {
    return  head(value) === '"' &&
            last(value) === '"';
}

},{"./library":9}],5:[function(require,module,exports){
'use strict';

let is = (type, value) => typeof value === type;

module.exports = (type, name, value) => {
    if (!is(type, value))
        throw Error(`${ name } should be ${ type }!`);
    
    return value;
};

},{}],6:[function(require,module,exports){
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

},{}],7:[function(require,module,exports){
'use strict';

/* should be exported before require of interpret */
module.exports  = interpretList;

let interpret   = require('./interpret');
let Context     = require('./context');
let library     = require('./library');

let head        = library.head;
let tail        = library.tail;

let isFunction  = fn => typeof fn === 'function';

let special = {
    let: function(input, context) {
        let letContext = input[1].reduce((acc, x) => {
            acc.scope[x[0].value] = interpret(x[1], context);
            
            return acc;
        }, new Context({}, context));
        
      return interpret(input[2], letContext);
    },
    
    lambda: (input, context) => function() {
        let lambdaArguments = arguments,
            lambdaScope     = input[1].reduce((acc, x, i) => {
                acc[x.value] = lambdaArguments[i];
                return acc;
            }, {}),
            
            newContext = new Context(lambdaScope, context);
        
        return interpret(input[2], newContext);
    },
    
    if: (input, context) =>
        interpret(input[1], context)
            ?
            interpret(input[2], context)
            :
            interpret(input[3], context)
};

let checkFunction = (name, value) => {
    if (!(isFunction(value)))
        throw Error(`${ name } is not a function!`);
};

function interpretList(input, context) {
    let first = head(input);
    
    if (input.length && first.value in special) {
        return special[first.value](input, context);
    } else {
        let fnData  = input[0];
        
        let list    = input.map(x =>
            interpret(x, context)
        );
        
        let fn = head(list);
        
        checkFunction(fnData.value, fn);
            
        return fn(...tail(list));
    }
}

},{"./context":6,"./interpret":8,"./library":9}],8:[function(require,module,exports){
(function() {
    'use strict';
    
    module.exports      = interpret;
    
    let Context         = require('./context'),
        library         = require('./library'),
        interpretList   = require('./interpret-list');
    
    let isArray         = Array.isArray;
    
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

},{"./context":6,"./interpret-list":7,"./library":9}],9:[function(require,module,exports){
'use strict';

module.exports = {
    print   : print,
    head    : head,
    tail    : tail,
    last    : last,
    car     : head,
    cdr     : tail,
    '+'     : calc((a, b) => a + b),
    '-'     : calc((a, b) => a - b),
    '*'     : calc((a, b) => a * b),
    '/'     : calc((a, b) => a / b),
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
    return function() {
        return [].reduce.call(arguments, operation);
    };
}

function slice(array, from, to) {
    return [].slice.call(array, from, to);
}

},{}],10:[function(require,module,exports){
'use strict';

let squad       = require('squad');

let categorize  = require('./categorize');
let getList     = squad(categorize, makeList);

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
        } else if (isList(token, input)) {
            list.push(getList(input));
            cutList(input);
            return list;
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
    if (!Array.isArray(input))
        throw Error('input should be an array!');
}

function isList(token, input) {
    return token === '\'' && input[0] === '(';
}

function makeList(input) {
    let closeIndex = input.indexOf(')');
    
    return input.slice(1, closeIndex);
}

function cutList(input) {
    let closeIndex = input.indexOf(')');
    
    input.splice(0, closeIndex + 2);
}

},{"./categorize":4,"squad":2}],11:[function(require,module,exports){
'use strict';

let isString    = str => typeof str === 'string';

module.exports = tokenize;

let regexp  = /^\s*((\r|\n|$)|#;|#\||#\\[^\w]|#?(\(|\[|{)|\)|\]|}|\'|`|,@|,|\+inf\.0|-inf\.0|\+nan\.0|\"(\\(.|$)|[^\"\\])*(\"|$)|[^\s()\[\]{}]+)/;

function tokenize(expression) {
    check(expression);
    
    let tokens  = [];
    let txt     = expression;
    let add     = (array, token) => {
        tokens.push(token);
        
        return '';
    };
    
    while(txt)
        txt = txt.replace(regexp, add);
    
    return tokens;
}

function check(str) {
    if (!isString(str))
        throw Error('expression should be string!');
}

},{}],"lisp":[function(require,module,exports){
'use strict';

let squad           = require('squad');
let currify           = require('currify');

let interpret       = require('./interpret');
let parenthesize    = require('./parenthesize');
let tokenize        = require('./tokenize');
let bracketsCheck   = require('./brackets-check');
let check           = require('./check');

let checkString     = currify(check, 'string');
let checkExpression = checkString( 'expression');

let lisp            = squad(
    interpret,
    parenthesize,
    bracketsCheck,
    tokenize,
    checkExpression
);

module.exports      = lisp;

},{"./brackets-check":3,"./check":5,"./interpret":8,"./parenthesize":10,"./tokenize":11,"currify":1,"squad":2}]},{},["lisp"])("lisp")
});