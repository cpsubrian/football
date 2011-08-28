/**
 * Main application. 
 */
var express = require('express'),
    everyauth = require('everyauth'),
    app = module.exports = express.createServer(),
    RedisStore = require('connect-redis')(express),
    redis = require('redis'),
    redisClient = redis.createClient(),
    conf = require('./conf.js'),
    helpers = require('./helpers.js')(app, conf);

// Get a user stored in redis.
everyauth.everymodule.findUserById( function (userId, callback) {
  redisClient.get('users.' + userId, function(err, data) {
    callback(null, JSON.parse(data));
  });
});

// Add a new user to redis.
function addUser (source, sourceUser, callback) {  
  redisClient.incr('next.user.id', function(err, nextId) {
    var user = {'id' : nextId};
    user[source] = sourceUser;
    redisClient.set('users.' + nextId, JSON.stringify(user), function(err, data) {
      callback(err, user);
    });
  });
}

// Configure yahoo oauth.
everyauth.yahoo
  .consumerKey(conf.yahoo.key)
  .consumerSecret(conf.yahoo.secret)
  .myHostname('http://football.brianthomaslink.com')
  .findOrCreateUser( function (sess, accessToken, accessSecret, yahooUser) {
    var promise = this.Promise();
    redisClient.get('users.by.yahoo.guid.' + yahooUser.guid, function(err, userId) {
      if (userId) {
        redisClient.get('users.' + userId, function(err, data) {
          promise.fulfill(JSON.parse(data));
        });
      }
      else {
        addUser('yahoo', yahooUser, function(err, user) {
          promise.fulfill(user);
        });
      }
    });
    return promise;
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
  app.use(express.session({ store: new RedisStore, secret:  conf.session.secret}));
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

// Yahoo api helper.
function yahooGet(method, req, _format, callback) {
  var api = everyauth.yahoo.oauth;
  var auth = req.session.auth.yahoo;
  var format = (_format == 'json' || _format == 'js') ? 'json' : 'xml';
  var url = conf.yahoo.api.base + method + '?format=' + format;
  api.get(url, auth.accessToken, auth.accessTokenSecret, callback);
}

// Routes
app.get('/', function(req, res){
  res.render('index'); 
});
app.get('/teams', function(req, res) {
  var method = 'league/' + conf.yahoo.api.s2011.league_key + '/teams';
  yahooGet(method, req, 'xml', function(err, data) {
    res.send(data, {'Content-Type' : 'application/xml'});
  });
});

// API sandbox.
app.get('/sandbox', function(req, res) {
  if (req.user) {
    res.render('sandbox', {results: 'Results will be here'});
  }
  else {
    res.redirect('/'); 
  }
});
app.post('/sandbox', function(req, res) {
  if (req.user && req.body.api_url) {
    var api = everyauth.yahoo.oauth;
    var yahoo = req.session.auth.yahoo;
    var url = req.body.api_url + (req.body.json ? '?format=json' : '');
    var format = (req.body.json ? 'js' : 'xml');
    api.get(url, yahoo.accessToken, yahoo.accessTokenSecret, function(error, data) {
      if (format == 'js') {
        data = JSON.stringify(JSON.parse(data), null, 2);
      }
      res.render('sandbox', {
        'api_url': req.body.api_url,
        'results': data,
        'format': format
      });
    });
  }
  else {
    res.redirect('/'); 
  }
});

//Only listen on $ node app.js
if (!module.parent) {
  app.listen(conf.port);
  console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
}
