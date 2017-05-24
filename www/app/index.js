'use strict';

function noop() {}

function bindEvents(thisArg, events) {
   Object.keys(events).forEach(function (selector) {
        Object.keys(events[selector]).forEach(function (event) {
            var handler = events[selector][event].bind(thisArg);
            if('document' === selector) {
                document.addEventListener(event, handler, false);
            } else if ('window' === selector) {
                window.addEventListener(event, handler, false);
            } else {
                document.querySelectorAll(selector).forEach(function (dom) {
                    dom.addEventListener(event, handler, false);
                });
            }
        });
    }); // all events bound
}

function f(name, params) {
  params = Array.prototype.slice.call(arguments, 1, arguments.length);
  return name + '(' + params.join(', ') + ')';
}

var IS_CORDOVA = !!window.cordova;

var app = {
  // options
  DATA_KEY: 'com.metaist.walkloop.data',
  store: null,
  options: {
    debug: true
  },

  // internal
  // TODO

  // DOM
  // TODO

  init: function () {
    bindEvents(this, {
      'document': {'deviceready': this.ready},
      'form input': {'change': this.change}
    });

    if(!IS_CORDOVA) {
      this.options.debug && console.log('NOT cordova');
      bindEvents(this, {'window': {'load': this.ready}});
    }

    return this;
  },

  ready: function () {
    // Store DOM nodes
    // TODO

    // Grab preferences
    if(IS_CORDOVA) {
      this.store = plugins.appPreferences;
      this.store.fetch(this.DATA_KEY).then(function (data) {
        Object.assign(this.options, data || {});
        // TODO: update settings UI
        this.render();
      }.bind(this));
    }

    return this;
  },

  change: function () {
    // TODO: check values and update options

    if (IS_CORDOVA) {
      this.store.store(noop, noop, this.DATA_KEY, this.options);
    }//end if: options stored
    return this;
  },

  render: function () {
    return this;
  }
};

app.init();
