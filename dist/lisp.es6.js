(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.lisp = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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

},{}],2:[function(require,module,exports){
'use strict';

module.exports = categorize;

let head        = require('head');
let last        = require('last');
let check       = require('check');
let partial     = require('partial');

let checkString = partial(check, 'string');
let checkInput  = partial(checkString, 'input');

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

},{"check":8,"head":10,"last":15,"partial":17}],3:[function(require,module,exports){
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

},{}],4:[function(require,module,exports){
'use strict';

/* should be exported before require of interpret */
module.exports  = interpretList;

let interpret   = require('./interpret');
let Context     = require('./context');

let head        = require('head');
let tail        = require('tail');
let isFunction  = require('is-function');

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

},{"./context":3,"./interpret":5,"head":10,"is-function":12,"tail":23}],5:[function(require,module,exports){
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

},{"./context":3,"./interpret-list":4,"./library":6,"is-array":11}],6:[function(require,module,exports){
'use strict';

/* browserify could not handle expression in require */
module.exports = {
    print   : require('print'),
    '+'     : require('sum'),
    '-'     : require('subs'),
    '*'     : require('multiply'),
    '/'     : require('divide')
};

},{"divide":9,"multiply":16,"print":18,"subs":21,"sum":22}],7:[function(require,module,exports){
'use strict';

let reduce = require('./reduce');

module.exports = operation => 
    function() {
        return reduce(operation, arguments);
    };

},{"./reduce":19}],8:[function(require,module,exports){
'use strict';

let is = require('is');

module.exports = (type, name, value) => {
    if (!is(type, value))
        throw Error(`${ name } should be ${ type }!`);
    
    return value;
};

},{"is":14}],9:[function(require,module,exports){
'use strict';

let calc = require('./calc');

module.exports = calc((a, b) => a / b);

},{"./calc":7}],10:[function(require,module,exports){
'use strict';

module.exports = list => list[0];

},{}],11:[function(require,module,exports){
'use strict';

module.exports = list => Array.isArray(list);

},{}],12:[function(require,module,exports){
'use strict';

let is = require('is');

module.exports = fn =>
    is('function', fn);

},{"is":14}],13:[function(require,module,exports){
'use strict';

let is = require('is');

module.exports = str =>
    is('string', str);
},{"is":14}],14:[function(require,module,exports){
'use strict';

module.exports = (type, value) => typeof value === type;
},{}],15:[function(require,module,exports){
'use strict';

let slice   = require('./slice');
let head    = require('./head');

module.exports = list => head(slice(list, -1));

},{"./head":10,"./slice":20}],16:[function(require,module,exports){
'use strict';

let calc = require('./calc');

module.exports = calc((a, b) => a * b);

},{"./calc":7}],17:[function(require,module,exports){
'use strict';

let tail    = require('./tail');
let slice   = require('./slice');

module.exports = partial;

function partial(fn) {
    let first = tail(arguments);
    
    return function() {
        let last    = slice(arguments),
            args    = [...first, ...last];
        
        return fn(...args);
    };
}

},{"./slice":20,"./tail":23}],18:[function(require,module,exports){
'use strict';

module.exports = (x) => {
    console.log(x);
    return x;
};

},{}],19:[function(require,module,exports){
'use strict';

module.exports = (fn, array) => 
    [].reduce.call(array, fn);

},{}],20:[function(require,module,exports){
'use strict';

module.exports = (array, from, to) => 
    [].slice.call(array, from, to);
},{}],21:[function(require,module,exports){
'use strict';

let calc = require('./calc');

module.exports = calc((a, b) => a - b);

},{"./calc":7}],22:[function(require,module,exports){
'use strict';

let calc = require('./calc');

module.exports = calc((a, b) => a + b);

},{"./calc":7}],23:[function(require,module,exports){
'use strict';

let slice = require('./slice');

module.exports = list => slice(list, 1);

},{"./slice":20}],24:[function(require,module,exports){
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

},{"./categorize":2}],25:[function(require,module,exports){
'use strict';

let partial     = require('partial');
let isString    = require('is-string');

module.exports = tokenize;

function tokenize(expression) {
    check(expression);
    
    var marker = generateStr(expression);
    
    return expression
        .split('"')
        .map(partial(spacesInQuotes, marker))
        .join('"')
        .split(' ')
        .filter(Boolean)
        .map(x =>
            x.replace(RegExp(marker, 'g'), ' ')
        );
}

function spacesInQuotes(marker, x, i) {
    if (i % 2 === 0) { // not in string
        return x
            .replace(/\(/g, ' ( ')
            .replace(/\)/g, ' ) ');
    } else { // in string
        return x.replace(/ /g, marker);
    }
}

function check(str) {
    if (!isString(str))
        throw Error('expression should be string!');
}

var uniq            = (expression, str) => ~expression.indexOf(str);
var generateRandom  = () => `>--- ${ Math.random() } ---<`;

function generateStr(expression) {
    var str;
    
    do 
        str = generateRandom();
    while (uniq(expression, str));
    
    return str;
}

},{"is-string":13,"partial":17}],"lisp":[function(require,module,exports){
'use strict';

let squad           = require('squad');

let interpret       = require('./interpret');
let parenthesize    = require('./parenthesize');
let tokenize        = require('./tokenize');

let partial         = require('partial');
let check           = require('check');

let checkString     = partial(check, 'string');
let checkExpression = partial(checkString, 'expression');

let lisp            = squad(interpret, parenthesize, tokenize, checkExpression);

module.exports      = lisp;

},{"./interpret":5,"./parenthesize":24,"./tokenize":25,"check":8,"partial":17,"squad":1}]},{},[2,3,4,5,6,"lisp",24,25])("lisp")
});