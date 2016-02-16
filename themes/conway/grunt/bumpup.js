/*global module */

var bumpup = {
    files: ['package.json', 'bower.json']
};

module.exports = function (grunt) {

    "use strict";

    grunt.registerTask('version', 'Update version in package.json and composer.json: Specify [--patch|--minor|--major] dafault is patch', function() {
        var part = grunt.option('part');

        if(undefined === part){
          part = 'patch';
        }

        if('patch' !== part && 'minor' !== part &&  'major' !== part){
          grunt.log.error('part must be on of [patch, minor, major]');
          return;
        }

        grunt.task.run('bumpup:' + part);

    });

    return bumpup;
};
