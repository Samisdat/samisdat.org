/*global module */

var copy = {
    fontawesome: {
        expand: true,
        src: 'dependencies/bower_components/font-awesome/fonts/**',
        dest: 'source/bower_components/font-awesome/fonts/',
        flatten: true,
        filter: 'isFile'
    },
    bootstrap: {
        expand: true,
        src: 'dependencies/bower_components/bootstrap-sass-official/assets/javascripts/bootstrap**',
        dest: 'source/bower_components/bootstrap/javascripts/',
        flatten: true,
        filter: 'isFile'
    },
    jquery: {
        expand: true,
        src: 'dependencies/bower_components/jquery/dist/jquery.**',
        dest: 'source/bower_components/jquery/',
        flatten: true,
        filter: 'isFile'
    },
    highlighjs: {
        expand: true,
        src: [
            'dependencies/bower_components/highlightjs/highlight.pack.min.js',
        ],
        dest: 'source/bower_components/highlightjs/',
        flatten: true,
        filter: 'isFile'
    },
    highlighjs_css: {
        src: [
            'dependencies/bower_components/highlightjs/styles/github.css' 
        ],
        dest: 'dependencies/scss/highlightjs.scss',
        filter: 'isFile'
    }
 
};

module.exports = copy;
