'use strict';

var files = [
    'grunt/*.js',
    'lib/**/*.js',
    'test/**/*.js'
];

var eslint = {
    lint: {
        src: files
    },
    lintAndFix: {
        options: {
            fix: true
        },
        src: files
    }
};



module.exports = eslint;
