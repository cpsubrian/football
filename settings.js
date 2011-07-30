/**
 * Application Settings.
 */
module.exports = {
  port: 3000,
  title: 'BoilerPlate Application',
  session: {
    secret: 'your secret here'
  },
  scripts: {
    'head': [
      'http://ajax.googleapis.com/ajax/libs/jquery/1.6.2/jquery.min.js',
      //'https://ajax.googleapis.com/ajax/libs/jqueryui/1.8.14/jquery-ui.min.js', 
      //'http://cdnjs.cloudflare.com/ajax/libs/underscore.js/1.1.7/underscore-min.js',
      //'http://cdnjs.cloudflare.com/ajax/libs/backbone.js/0.5.1/backbone-min.js',
      //'http://cdnjs.cloudflare.com/ajax/libs/socket.io/0.7.0/socket.io.min.js', 
      //'http://html5shim.googlecode.com/svn/trunk/html5.js',     
    ],
    'footer': [
      '/js/script.js'       
    ]
  }
};