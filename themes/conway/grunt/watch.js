'use strict';

var watch = {
    sass: {
        files: [
            'dependencies/scss/**/*.scss'
        ],
        tasks: [
            'development'
        ],
        options: {
            nospawn: true
        }
    }
};

module.exports = watch;
