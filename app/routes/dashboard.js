
/*
 * GET dashboard page.
 */

exports.index = function(req, res){
  res.render('dashboard', { title: 'Twitter Stock Dashboard', });
};