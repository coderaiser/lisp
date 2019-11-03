# Lisp [![License][LicenseIMGURL]][LicenseURL] [![NPM version][NPMIMGURL]][NPMURL] [![Dependency Status][DependencyStatusIMGURL]][DependencyStatusURL] [![Build Status][BuildStatusIMGURL]][BuildStatusURL]

Simple lisp implementation. Could be used in browser as global `lisp`, `node.js` environment or bundled with help of `browserify`.

## Install

```
npm i lisp
```

## How to use?

```js
const lisp = require('lisp');

lisp('(+ 1 2 3 4');
// returns
10

lisp('(+ "hello" " world"');
// returns
'hello world'

lisp ('(+ 5 (* 2 2) (/ 4 2))');
// returns
11

lisp('(head \'(1 2 3 4)');
// returns
1

lisp('(tail \'(1 2 3 4)');
// returns
[2, 3, 4]

```

## License

MIT

[NPMIMGURL]:                https://img.shields.io/npm/v/lisp.svg?style=flat
[BuildStatusIMGURL]:        https://img.shields.io/travis/coderaiser/lisp/master.svg?style=flat
[DependencyStatusIMGURL]:   https://img.shields.io/david/coderaiser/lisp.svg?style=flat
[LicenseIMGURL]:            https://img.shields.io/badge/license-MIT-317BF9.svg?style=flat
[NPMURL]:                   https://npmjs.org/package/lisp "npm"
[BuildStatusURL]:           https://travis-ci.org/coderaiser/lisp  "Build Status"
[DependencyStatusURL]:      https://david-dm.org/coderaiser/lisp "Dependency Status"
[LicenseURL]:               https://tldrlegal.com/license/mit-license "MIT License"

