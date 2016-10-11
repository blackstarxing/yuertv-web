var fs = require('fs')
var routerConfig = function(app, options) {

	var files = fs.readdirSync(options.dirPath);
	files.forEach(function(file) {
		var name = file.split('.')[0];
		var el = '/' + name
		if (name == 'index') {
			el = '/';
		} else if (name == 'api') {
			el = '/api/*';
		} else if (name == 'proxy') {
			el = '/proxy/*';
		}
		app.use(el, require(options.dirPath + name))
	})
}

module.exports = routerConfig;
