'use strict';

const {run} = require('madrun');

module.exports = {
    'test': () => 'tape \'lib/**/*.spec.js\'',
    'coverage': () => 'nyc npm test',
    'build': () => run(['clean', '6to5', 'legacy']),
    '6to5': () => 'babel lib -d legacy',
    'legacy': () => 'echo "module.exports = require(\'./lisp\');" > legacy/index.js',
    'wisdom': () => run('build'),
    'lint': () => 'putout lib .madrun.js',
    'fix:lint': () => run('lint', '--fix'),
    'clean': () => 'rimraf legacy',
};

