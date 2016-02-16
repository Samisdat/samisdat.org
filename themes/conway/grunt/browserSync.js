/*global module */

var browserSync = {
    dev: {
        files: {
            src: [
                'source/css/<%= pkg.name %>.css'
            ]
        },
        injectChanges: true,
        options: {
            watchTask: true
        }
    }
};

module.exports = browserSync;
