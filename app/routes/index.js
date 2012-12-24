
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index', { title: 'Twitter Stock Dashboard', subtitle: 'Test App written with Node.js + Express.js', });
};