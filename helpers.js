/**
 * Application helpers.
 */
module.exports = function(app, conf) {
  return {
    // Application title.
    title: conf.title,  
    
    // Return scripts from settings.js
    headScripts: function() {
      return conf.scripts['head'].map(function(src) {
        return '<script type="text/javascript" src="' + src + '"></script>'
      }).join("\n");
    },
    footerScripts: function() {
      return conf.scripts['footer'].map(function(src) {
        return '<script type="text/javascript" src="' + src + '"></script>'
      }).join("\n");
    }
  };
}