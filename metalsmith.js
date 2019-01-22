var Metalsmith = require('metalsmith');
var redirect = require('metalsmith-redirect');
metalsmith.use(redirect({
  '/hexo-staging.html': '/blog/hexo-staging/',
  '/bar.html': '/img/'
}));

metalsmith.build(function (err, files) {
  if (err) { throw err; }
});
