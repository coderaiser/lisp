'use strict';

const {run} = require('madrun');

module.exports = {
    'test': () => 'tape \'lib/**/*.spec.js\'',
    'coverage': () => 'nyc npm test',
    'lint': () => 'putout lib .madrun.js',
    'fix:lint': () => run('lint', '--fix'),
};

