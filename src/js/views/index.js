var GitError = require('../util/errors').GitError;
var _ = require('underscore');
// horrible hack to get localStorage Backbone plugin
var Backbone = (!require('../util').isBrowser()) ? require('backbone') : window.Backbone;

var ConfirmCancelView = Backbone.View.extend({
  tagName: 'div',
  className: 'box horizontal justify',
  template: _.template($('#confirm-cancel-template').html()),
  events: {
    'click .confirmButton': 'confirmed',
    'click .cancelButton': 'cancel'
  },

  initialize: function(options) {
    if (!options.destination || !options.deferred) {
      throw new Error('needmore');
    }

    this.destination = options.destination;
    this.deferred = options.deferred;
    this.JSON = {
      confirm: options.confirm || 'Confirm',
      cancel: options.cancel || 'Cancel'
    };

    this.render();
  },

  confirmed: function() {
    this.deferred.resolve();
  },

  cancel: function() {
    this.deferred.reject();
  },

  render: function() {
    this.$el.html(this.template(this.JSON));
    $(this.destination).append(this.el);
  }
});

var BaseView = Backbone.View.extend({
  render: function() {
    var destination = this.container.getInsideElement();
    this.$el.html(this.template(this.JSON));
    $(destination).append(this.el);
  },

  show: function() {
    this.container.show();
  },

  hide: function() {
    this.container.hide();
  }
});

var ModalView = Backbone.View.extend({
  tagName: 'div',
  className: 'modalView box horizontal center transitionOpacity',
  template: _.template($('#modal-view-template').html()),

  initialize: function(options) {
    this.render();
  },

  render: function() {
    // add ourselves to the DOM
    this.$el.html(this.template({}));
    $('body').append(this.el);
  },

  show: function() {
    this.toggleZ(true);
    this.toggleShow(true);
  },

  hide: function() {
    this.toggleShow(false);
    // TODO -- do this in a way where it wont
    // bork if we call it back down. these views should
    // be one-off though so...
    setTimeout(_.bind(function() {
      this.toggleZ(false);
    }, this), 700);
  },

  getInsideElement: function() {
    return this.$('.contentHolder');
  },

  toggleShow: function(value) {
    this.$el.toggleClass('show', value);
  },

  toggleZ: function(value) {
    this.$el.toggleClass('inFront', value);
  },

  tearDown: function() {
    this.hide();
  }
});

var ModalTerminal = BaseView.extend({
  tagName: 'div',
  className: 'box flex1',
  template: _.template($('#terminal-window-template').html()),

  initialize: function(options) {
    options = options || {};

    this.container = new ModalView();
    this.JSON = {
      title: options.title || 'Heed This Warning!'
    };

    this.render();
  },

  getInsideElement: function() {
    return this.$('#inside');
  }
});

var ModalAlert = BaseView.extend({
  tagName: 'div',
  template: _.template($('#modal-alert-template').html()),

  initialize: function(options) {
    options = options = {};
    this.JSON = {
      title: options.title || 'Something to say',
      text: options.text || 'Here is a paragraph'
    };

    this.container = new ModalTerminal({
      title: 'Alert!'
    });
    this.render();
  }
});

exports.ModalView = ModalView;
exports.ModalTerminal = ModalTerminal;
exports.ModalAlert = ModalAlert;
exports.BaseView = BaseView;
exports.ConfirmCancelView = ConfirmCancelView;

