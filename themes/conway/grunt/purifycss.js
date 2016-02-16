/*global module */



var purifycss =  {
    options: {},
    target: {
        src: ['../../public/**/*.html'],
        css: ['source/css/<%= pkg.name %>.css'],
        dest: 'source/css/<%= pkg.name %>.min.css'
    }    
};

module.exports = purifycss;
