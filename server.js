var cluster = require('cluster');
var conf = require('./conf');

cluster('./app')
  .use(cluster.logger('logs'))
  .use(cluster.stats())
  .use(cluster.pidfiles('pids'))
  .use(cluster.cli())
  .use(cluster.reload())
  .listen(conf.port);