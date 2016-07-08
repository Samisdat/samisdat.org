'use strict';

var files = [
    'grunt/*.js',
    'source/js/github-charts/github-charts.js'
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
