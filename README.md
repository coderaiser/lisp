# Lisp [![License][LicenseIMGURL]][LicenseURL] [![NPM version][NPMIMGURL]][NPMURL] [![Dependency Status][DependencyStatusIMGURL]][DependencyStatusURL] [![Build Status][BuildStatusIMGURL]][BuildStatusURL]

Simple lisp implementation.

## Install

```
npm i lisp --save
```

## How to use?

```js
let lisp = require('lisp');

lisp('(+ 1 2 3 4');
// returns
10

lisp('(head 1 2 3)');
// returns
1

lisp('(tail 1 2 3)');
//returns
[2, 3]
```

## License

MIT

[NPMIMGURL]:                https://img.shields.io/npm/v/lisp.svg?style=flat
[BuildStatusIMGURL]:        https://img.shields.io/travis/coderaiser/lisp/master.svg?style=flat
[DependencyStatusIMGURL]:   https://img.shields.io/gemnasium/coderaiser/lisp.svg?style=flat
[LicenseIMGURL]:            https://img.shields.io/badge/license-MIT-317BF9.svg?style=flat
[NPMURL]:                   https://npmjs.org/package/lisp "npm"
[BuildStatusURL]:           https://travis-ci.org/coderaiser/lisp  "Build Status"
[DependencyStatusURL]:      https://gemnasium.com/coderaiser/lisp "Dependency Status"
[LicenseURL]:               https://tldrlegal.com/license/mit-license "MIT License"
