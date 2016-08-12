/**
* Icon Control (TODO: bitly link to soho xi docs)
* Wraps SVG Icons with a Javascript control that can change the icon type, reference
* relative or absolute URLs, and clean up after itself.  Works with the Base tag.
*/

// NOTE:  There are AMD Blocks available

/* start-amd-strip-block */
(function(factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module
    define(['jquery'], factory);
  } else if (typeof exports === 'object') {
    // Node/CommonJS
    module.exports = factory(require('jquery'));
  } else {
    // Browser globals
    factory(jQuery);
  }
}(function($) {
/* end-amd-strip-block */

  //NOTE: Just this part will show up in SoHo Xi Builds.

  $.fn.icon = function(options) {
    'use strict';

    // Settings and Options
    var pluginName = 'icon',
        defaults = {
          use: 'user-profile',
          focusable: false
        },
        settings = $.extend({}, defaults, options);

    // Plugin Constructor
    function Icon(element, settings) {
      this.settings = $.extend({}, settings);
      this.element = $(element);
      this.init();
    }

    // Plugin Methods
    Icon.prototype = {
      init: function() {
        this.getExistingUseTag();

        //Do other init (change/normalize settings, load externals, etc)
        return this
          .render()
          .handleEvents();
      },

      // Add markup to the control
      render: function() {
        this.element.addClass('icon');

        if (!this.element.is('svg')) {
          // TODO: Possibly work with span-based icons here?
          return this;
        }

        // Get a "base-tag-proof" version of the Use tag's definition.
        // jQuery can't work with SVG elements, so we just modify it with regular DOM APIs
        var use = this.element[0].getElementsByTagName('use')[0];
        use.setAttribute('xlink:href', this.getBasedUseTag());

        return this;
      },

      getBasedUseTag: function() {
        return $.getBaseURL('#icon-' + this.settings.use);
      },

      // In the event that a <use> tag exists on an icon, we want to retain it
      // and replace the settings.
      getExistingUseTag: function() {
        if (!this.element.is('svg')) {
          return;
        }

        var useTag = this.element.children('use');
        if (!useTag.length) {
          return this;
        }

        var xlinkHref = useTag.attr('xlink:href');
        this.settings.use = xlinkHref.replace('#icon-', '');

        return this;
      },

      // Sets up event handlers for this control and its sub-elements
      handleEvents: function() {
        var self = this;

        this.element.on('updated.' + pluginName, function() {
          self.updated();
        });

        return this;
      },

      //Handle Updating Settings
      updated: function() {
        return this
          .teardown()
          .init();
      },

      // Simple Teardown - remove events & rebuildable markup.
      teardown: function() {
        this.element.children('use').remove();
        this.element.off('updated.' + pluginName);
        return this;
      },

      // Teardown - Remove added markup and events
      destroy: function() {
        this.teardown();
        $.removeData(this.element[0], pluginName);
      }
    };

    // Initialize the plugin (Once)
    return this.each(function() {
      var instance = $.data(this, pluginName);
      if (instance) {
        instance.settings = $.extend({}, instance.settings, options);
        instance.updated();
      } else {
        instance = $.data(this, pluginName, new Icon(this, settings));
      }
    });
  };

  // Factory Function for instantly building icons.
  // Use this for building icons that don't exist yet.
  // Scoped Privately on purpose...
  (function (){
    'use strict';

    function normalizeIconOptions(options) {
      var defaults = {
        icon: 'user-profile', // omit the "icon-" if you want; this code strips it out.
        classes: ['icon']
      };

      options = options || $.extend({}, defaults);

      if (typeof options === 'string') {
        options = $.extend({}, defaults, {
          icon: options.replace('icon-', '')
        });
      }

      if (!options.classes) {
        options.classes = [].concat(defaults.classes);
      }

      if (typeof options.classes === 'string') {
        options.classes = options.classes.split(' ');
      }

      if (options.classes.indexOf('icon') === -1) {
        options.classes.push('icon');
      }

      return options;
    }

    // Returns the RAW HTML for creating a new icon in string form
    $.createIcon = function createIcon(options) {
      options = normalizeIconOptions(options);

      return [
        '<svg class="' + options.classes.join(' ') + '" focusable="false" aria-hidden="true" role="presentation">' +
          '<use xlink:href="#icon-' + options.icon + '"></use>' +
        '</svg>'
      ].join('');
    };

    // Returns a jQuery-wrapped element containing a new icon
    $.createIconElement = function createIconElement(options) {
      return $($.createIcon(options));
    };

  })();

/* start-amd-strip-block */
}));
/* end-amd-strip-block */