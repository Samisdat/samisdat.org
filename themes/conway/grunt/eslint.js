'use strict';

var files = [
    'grunt/*.js',
    'source/js/github-charts/github-charts-fixed-labels.js'
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
