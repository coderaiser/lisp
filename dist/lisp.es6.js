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

let squad       = require('squad');

let is          = require('is');
let partial     = require('partial');
let isUndefined = partial(is, 'undefined');

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

},{"is":15,"partial":18,"squad":1}],3:[function(require,module,exports){
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

},{"check":9,"head":11,"last":16,"partial":18}],4:[function(require,module,exports){
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

},{}],5:[function(require,module,exports){
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

},{"./context":4,"./interpret":6,"head":11,"is-function":13,"tail":24}],6:[function(require,module,exports){
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

},{"./context":4,"./interpret-list":5,"./library":7,"is-array":12}],7:[function(require,module,exports){
'use strict';

/* browserify could not handle expression in require */
module.exports = {
    print   : require('print'),
    '+'     : require('sum'),
    '-'     : require('subs'),
    '*'     : require('multiply'),
    '/'     : require('divide')
};

},{"divide":10,"multiply":17,"print":19,"subs":22,"sum":23}],8:[function(require,module,exports){
'use strict';

let reduce = require('./reduce');

module.exports = operation => 
    function() {
        return reduce(operation, arguments);
    };

},{"./reduce":20}],9:[function(require,module,exports){
'use strict';

let is = require('is');

module.exports = (type, name, value) => {
    if (!is(type, value))
        throw Error(`${ name } should be ${ type }!`);
    
    return value;
};

},{"is":15}],10:[function(require,module,exports){
'use strict';

let calc = require('./calc');

module.exports = calc((a, b) => a / b);

},{"./calc":8}],11:[function(require,module,exports){
'use strict';

module.exports = list => list[0];

},{}],12:[function(require,module,exports){
'use strict';

module.exports = list => Array.isArray(list);

},{}],13:[function(require,module,exports){
'use strict';

let is = require('is');

module.exports = fn =>
    is('function', fn);

},{"is":15}],14:[function(require,module,exports){
'use strict';

let is = require('is');

module.exports = str =>
    is('string', str);
},{"is":15}],15:[function(require,module,exports){
'use strict';

module.exports = (type, value) => typeof value === type;
},{}],16:[function(require,module,exports){
'use strict';

let slice   = require('./slice');
let head    = require('./head');

module.exports = list => head(slice(list, -1));

},{"./head":11,"./slice":21}],17:[function(require,module,exports){
'use strict';

let calc = require('./calc');

module.exports = calc((a, b) => a * b);

},{"./calc":8}],18:[function(require,module,exports){
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

},{"./slice":21,"./tail":24}],19:[function(require,module,exports){
'use strict';

module.exports = (x) => {
    console.log(x);
    return x;
};

},{}],20:[function(require,module,exports){
'use strict';

module.exports = (fn, array) => 
    [].reduce.call(array, fn);

},{}],21:[function(require,module,exports){
'use strict';

module.exports = (array, from, to) => 
    [].slice.call(array, from, to);
},{}],22:[function(require,module,exports){
'use strict';

let calc = require('./calc');

module.exports = calc((a, b) => a - b);

},{"./calc":8}],23:[function(require,module,exports){
'use strict';

let calc = require('./calc');

module.exports = calc((a, b) => a + b);

},{"./calc":8}],24:[function(require,module,exports){
'use strict';

let slice = require('./slice');

module.exports = list => slice(list, 1);

},{"./slice":21}],25:[function(require,module,exports){
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

},{"./categorize":3}],26:[function(require,module,exports){
'use strict';

let partial     = require('partial');
let isString    = require('is-string');

let addSpaces   = (a) => ` ${ a } `;

module.exports = tokenize;

function tokenize(expression) {
    check(expression);
    
    let marker          = generateStr(expression);
    
    return expression
        .split('"')
        .map(partial(spacesInQuotes, addSpaces, marker))
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

},{"is-string":14,"partial":18}],"lisp":[function(require,module,exports){
'use strict';

let squad           = require('squad');

let interpret       = require('./interpret');
let parenthesize    = require('./parenthesize');
let tokenize        = require('./tokenize');
let bracketsCheck   = require('./brackets-check');

let partial         = require('partial');
let check           = require('check');

let checkString     = partial(check, 'string');
let checkExpression = partial(checkString, 'expression');

let lisp            = squad(
    interpret,
    parenthesize,
    bracketsCheck,
    tokenize,
    checkExpression
);

module.exports      = lisp;

},{"./brackets-check":2,"./interpret":6,"./parenthesize":25,"./tokenize":26,"check":9,"partial":18,"squad":1}]},{},["lisp"])("lisp")
});