(function($) {
/**
 * Team Model.
 */
var Team = Backbone.Model.extend({
  
});

/**
 * Team View
 */
var TeamView = Backbone.View.extend({
  tagName: 'div',
  className: 'team',
  
  template: $('#teamTmpl').template(),
  
  render: function() {
    $.tpml(this.template, this.model).appendTo(this.el);
    return this; 
  }
});

/**
 * Teams Collection.
 */
var Teams = Backbone.Collection.extend({
  model: Team,
  url: '/teams',
  
  parse: function(response) {
    var teams = [];
    $(response).find('team').each(function() {
      var $team = $(this);
      var team = {
        team_key: $team.find('team_key').text(),
        team_id: $team.find('team_id').text(),
        name: $team.find('name').text(),
        url: $team.find('url').text(),
        logo: $team.find('team_logos team_logo url').text(),
        division_id: $team.find('division_id').text()
      };
      teams.push(team);
    });
    return teams;
  }
});
  
/**
 * Teams View.
 */
var TeamsView = Backbone.View.extend({
  tagName: 'ul',
  className: 'teams',
  
  initialize: function() {
    _.bindAll(this);
  },
  
  render: function() {
    var view = this;
    this.collection.each(function(team) {
      view.el.append('<li>' + team.render().el + '</li>');
    });
  }
});

/**
 * Application View.
 */
var AppView = Backbone.View.extend({
  el: $('#content'),
  
  events: {
    
  },
  
  initialize: function() {
    var app = this;
    _.bindAll(app);
    
    app.collections.teams = new Teams();
    app.collections.teams.fetch({
      success: function(collection, response) {
        app.views.teams = new TeamsView({collection: app.collections.teams});
        app.el.append(app.views.teams.render().el);
      }
    });
  },
  
  collections: {},
  views: {},
});

// Initaize the application.
$(function() {
  window.appView = new AppView({});
});

})(jQuery);
