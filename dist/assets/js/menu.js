(function(window, document, $) {
  'use strict';

  $.site.menu = {
    speed: 250,
    accordion: true, // A setting that changes the collapsible behavior to expandable instead of the default accordion style

    init: function() {
      this.$instance = $('.site-dashboard-menu');

      this.bind();
    },

    bind: function() {
      var self = this;

      this.$instance.on('mouseenter.site.menu', '.site-dashboard-menu-item', function() {
        console.log($.site.menubar.folded)
        if ($.site.menubar.folded === true && $(this).is('.has-sub')) {
          var $sub = $(this).children('.site-dashboard-menu-sub');
          self.position($(this), $sub);
        }

        $(this).addClass('hover');
      }).on('mouseleave.site.menu', '.site-dashboard-menu-item', function() {
        $(this).removeClass('hover');
      }).on('deactive.site.menu', '.site-dashboard-menu-item.active', function(e) {
        var $item = $(this);

        $item.removeClass('active');

        e.stopPropagation();
      }).on('active.site.menu', '.site-dashboard-menu-item', function(e) {
        var $item = $(this);

        $item.addClass('active');

        e.stopPropagation();
      }).on('open.site.menu', '.site-dashboard-menu-item', function(e) {
        var $item = $(this);

        self.expand($item, function() {
          $item.addClass('open');
        });

        if (self.accordion) {
          $item.siblings('.open').trigger('close.site.menu');
        }

        e.stopPropagation();
      }).on('close.site.menu', '.site-dashboard-menu-item.open', function(e) {
        var $item = $(this);

        self.collapse($item, function() {
          $item.removeClass('open');
        });

        e.stopPropagation();
      }).on('click.site.menu', '.site-dashboard-menu-item', function(e) {
        if ($(this).is('.has-sub')) {
          e.preventDefault();

          if ($(this).is('.open')) {
            $(this).trigger('close.site.menu');
          } else {
            $(this).trigger('open.site.menu');
          }
        } else {
          if (!$(this).is('.active')) {
            $(this).siblings('.active').trigger('deactive.site.menu');
            $(this).trigger('active.site.menu');
          }
        }

        e.stopPropagation();
      });
    },

    collapse: function($item, callback) {
      var self = this;
      var $sub = $item.children('.site-dashboard-menu-sub');

      $sub.show().slideUp(this.speed, function() {
        $(this).css('display', '');

        $(this).find('> .site-dashboard-menu-item').removeClass('is-shown');

        if (callback) {
          callback();
        }

        self.$instance.trigger('collapsed.site.menu');
      });
    },

    expand: function($item, callback) {
      var self = this;
      var $sub = $item.children('.site-dashboard-menu-sub');
      var $children = $sub.children('.site-dashboard-menu-item').addClass('is-hidden');

      $sub.hide().slideDown(this.speed, function() {
        $(this).css('display', '');

        if (callback) {
          callback();
        }

        self.$instance.trigger('expanded.site.menu');
      });

      setTimeout(function() {
        $children.addClass('is-shown');
        $children.removeClass('is-hidden');
      }, 0);
    },

    refresh: function() {
      this.$instance.find('.open').removeClass('open');
    },

    position: function($item, $dropdown) {
      var offsetTop = $item.position().top,
        dropdownHeight = $dropdown.outerHeight(),
        menubarHeight = $('.site-dashboard-menubar').outerHeight();

      if ((offsetTop + dropdownHeight > menubarHeight) && (offsetTop > menubarHeight / 2)) {
        $dropdown.addClass('site-dashboard-menu-sub-up');
      } else {
        $dropdown.removeClass('site-dashboard-menu-sub-up');
      }
    }
  };
})(window, document, jQuery);




