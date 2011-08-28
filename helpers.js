/**
 * Application helpers.
 */
module.exports = function(app, conf) {
  return {
    // Application title.
    title: conf.title,  
    
    // Return styles from conf.js.
    headStyles: function() {
      return conf.styles.map(function(src) {
        return '<link rel="stylesheet" href="' + src + '" />';
      }).join("\n");
    },
    
    // Return scripts from conf.js
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