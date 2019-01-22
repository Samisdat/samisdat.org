var Metalsmith = require('metalsmith');
var sass = require('metalsmith-sass');
var redirect = require('metalsmith-redirect');
metalsmith.use(redirect({
  '/hexo-staging.html': '/blog/hexo-staging/',
  '/bar.html': '/img/'
}));

metalsmith.use(sass({
  outputStyle: 'expanded',
  outputDir: 'css/'
}));
metalsmith.build(function (err, files) {
  if (err) { throw err; }
});
