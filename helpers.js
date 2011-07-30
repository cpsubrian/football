/**
 * Application helpers.
 */
module.exports = function(app, settings) {
  return {
    // Application title.
    title: settings.title,  
    
    // Return scripts from settings.js
    headScripts: function() {
      return settings.scripts['head'].map(function(src) {
        return '<script type="text/javascript" src="' + src + '"></script>'
      }).join("\n");
    },
    footerScripts: function() {
      return settings.scripts['footer'].map(function(src) {
        return '<script type="text/javascript" src="' + src + '"></script>'
      }).join("\n");
    }
  };
}