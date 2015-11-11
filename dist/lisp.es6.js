(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.lisp = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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
let apart       = require('apart');

let is          = (type, value) => typeof value === type;
let isUndefined = apart(is, 'undefined');

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

},{"apart":1,"squad":2}],4:[function(require,module,exports){
'use strict';

module.exports = categorize;

let apart       = require('apart');

let check       = require('./check');
let library     = require('./library');

let head        = library.head;
let last        = library.last;

let checkString = apart(check, 'string');
let checkInput  = apart(checkString, 'input');

function categorize(input) {
    checkInput(input);
    
    let result;
    let num = Number(input);
    
    if (!isNaN(num))
        result = {
            type: 'literal',
            value: num
        };
    else if (wrapedByQuotes(input)) {
        result = {
            type: 'literal',
            value: input.slice(1, -1) };
    } else
        result =  {
            type: 'identifier',
            value: input
        };
    
    return result;
 }
 
function wrapedByQuotes(value) {
    return  head(value) === '"' &&
            last(value) === '"';
}

},{"./check":5,"./library":9,"apart":1}],5:[function(require,module,exports){
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

let categorize = require('./categorize');

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
    if (!Array.isArray(input))
        throw Error('input should be an array!');
}

},{"./categorize":4}],11:[function(require,module,exports){
'use strict';

let apart       = require('apart');

let isString    = str => typeof str === 'string';
let addSpaces   = (a) => ` ${ a } `;

module.exports = tokenize;

function tokenize(expression) {
    check(expression);
    
    let marker          = generateStr(expression);
    
    return expression
        .split('"')
        .map(apart(spacesInQuotes, addSpaces, marker))
        .join('"')
        .split(' ')
        .filter(Boolean)
        .map(x =>
            x.replace(RegExp(marker, 'g'), ' ')
        );
}

function spacesInQuotes(strProcess, marker, x, i) {
    return i % 2 === 0 ?
        notInString(strProcess, x)
        :
        inString(marker, x);
}

function inString(marker, x) {
    return x.replace(/ /g, marker);
}

function notInString(strProcess, x) {
    let str =  x.replace(/\(|\)/g, strProcess);
    
    return str;
}

function check(str) {
    if (!isString(str))
        throw Error('expression should be string!');
}

let uniq            = (expression, str) => ~expression.indexOf(str);
let generateRandom  = () => `>---${ Math.random() }---<`;

function generateStr(expression) {
    let str;
    
    do 
        str = generateRandom();
    while (uniq(expression, str));
    
    return str;
}

},{"apart":1}],"lisp":[function(require,module,exports){
'use strict';

let squad           = require('squad');
let apart           = require('apart');

let interpret       = require('./interpret');
let parenthesize    = require('./parenthesize');
let tokenize        = require('./tokenize');
let bracketsCheck   = require('./brackets-check');
let check           = require('./check');

let checkString     = apart(check, 'string');
let checkExpression = apart(checkString, 'expression');

let lisp            = squad(
    interpret,
    parenthesize,
    bracketsCheck,
    tokenize,
    checkExpression
);

module.exports      = lisp;

},{"./brackets-check":3,"./check":5,"./interpret":8,"./parenthesize":10,"./tokenize":11,"apart":1,"squad":2}]},{},["lisp"])("lisp")
});