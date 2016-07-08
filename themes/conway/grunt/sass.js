'use strict';

var sass = {
    development: {
        options: {
            sourceMap: true
        },
        files: {
            'source/css/<%= pkg.name %>.css': 'dependencies/scss/<%= pkg.name %>.scss',
        }
    },
    production: {
        options: {
            sourceMap: false,
            outputStyle: 'compressed'
        },
        files: {
            'source/css/<%= pkg.name %>.min.css': 'dependencies/scss/<%= pkg.name %>.scss',
        }
    }
};

module.exports = sass;
