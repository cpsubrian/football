/**
 * Main application. 
 */
var express = require('express'),
    everyauth = require('everyauth'),
    app = module.exports = express.createServer(),
    conf = require('./conf.js'),
    helpers = require('./helpers.js')(app, conf);
    
// Setup everyauth.
var usersById = {};
var usersByYahooId = {};
var nextUserId = 0;

everyauth.everymodule.findUserById( function (userId, callback) {
  callback(null, usersById[userId]);
});

function addUser (source, sourceUser) {
  var user;
  if (arguments.length === 1) { // password-based
    user = sourceUser = source;
    user.id = ++nextUserId;
    return usersById[nextUserId] = user;
  } else { // non-password-based
    user = usersById[++nextUserId] = {id: nextUserId};
    user[source] = sourceUser;
  }
  return user;
}

// Configure yahoo oauth.
everyauth.yahoo
  .consumerKey(conf.yahoo.key)
  .consumerSecret(conf.yahoo.secret)
  .myHostname('http://football.brianthomaslink.com')
  .findOrCreateUser( function (sess, accessToken, accessSecret, yahooUser) {
    return usersByYahooId[yahooUser.guid] || (usersByYahooId[yahooUser.guid] = addUser('yahoo', yahooUser));
  })
  .redirectPath('/');

// Configuration
app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'html');
  app.register(".html", require("jqtpl").express);
  app.use(express.compiler({ src: __dirname + '/public', enable: ['less'] }));
  app.use(express.static(__dirname + '/public'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser());
  app.use(express.session({ secret:  conf.session.secret}));
  app.use(everyauth.middleware());
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
everyauth.helpExpress(app);

// Routes
app.get('/', function(req, res){
  res.render('index'); 
});
app.post('/', function(req, res) {
  if (req.user && req.body.api_url) {
    var yahoo = req.session.auth.yahoo;
    everyauth.yahoo.oauth.get(req.body.api_url, yahoo.accessToken, yahoo.accessTokenSecret, function(error, data) {
      res.render('index', {
        results: data  
      });
    });
  }
  else {
    res.render('index'); 
  }
});

//Only listen on $ node app.js
if (!module.parent) {
  app.listen(conf.port);
  console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
}
