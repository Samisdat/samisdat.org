'use strict';

var concat = {
    options: {},
    dist: {
        src: [
            'source/bower_components/jquery/jquery.min.js',
            'source/bower_components/tether/javascripts/tether.min.js',
            'source/bower_components/bootstrap/javascripts/bootstrap.min.js',
            'source/bower_components/highlightjs/highlight.pack.min.js',
            'source/js/lib/rAF.js',
            'source/js/conway/patterns.js',
            'source/js/conway/cell.js',
            'source/js/conway/population.js',
            'source/js/conway/generation.js',
            'source/js/conway/observation.js',
            'source/js/conway/canvas.js',
            'source/js/github-charts/github-charts-fixed-labels.js',
            'source/js/app.js',
        ],
        dest: 'source/js/conway.js',
    }
};

module.exports = concat;
