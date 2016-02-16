/*global module */

module.exports = function(grunt) {

    "use strict";
    
    return grunt.file.readJSON('package.json');
};