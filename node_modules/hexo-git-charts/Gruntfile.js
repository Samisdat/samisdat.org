/*global module, require, process */

module.exports = function(grunt) {
    "use strict";

    require('time-grunt')(grunt);
    
    require('load-grunt-tasks')(grunt, {pattern: [
        'grunt-*', 
        '@*/grunt-*',
        'gruntify-eslint*'
    ]});

    require('load-grunt-config')(grunt);

};
