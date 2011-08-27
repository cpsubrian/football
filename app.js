
/**
 * Module dependencies.
 */

var express = require('express'),
    app = module.exports = express.createServer(),
    conf = require('./conf.js'),
    helpers = require('./helpers.js')(app, conf);

// Configuration
app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'html');
  app.register(".html", require("jqtpl").express);
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser());
  app.use(express.session({ secret:  conf.session.secret}));
  app.use(express.compiler({ src: __dirname + '/public', enable: ['less'] }));
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});
app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true })); 
});
app.configure('test', function() {
  app.use(express.errorHandler());
});
app.configure('production', function(){
  app.use(express.errorHandler()); 
});

// Helpers
app.helpers(helpers);

// Routes
app.get('/', function(req, res){
  res.render('index');
});

//Only listen on $ node app.js
if (!module.parent) {
  app.listen(conf.port);
  console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
}
