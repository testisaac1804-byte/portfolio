
var Layout = function () {
    // Handles the horizontal menu
    var handleHorizontalMenu = function () {
        // handle hover dropdown menu for desktop devices only
        $('[data-hover="megamenu-dropdown"]').not('.hover-initialized').each(function() {
            $(this).dropdownHover({
                delay: 100
            });
            $(this).addClass('hover-initialized');
        });
    };

    var handleSidebarMenu = function () {
        // handle sidebar link click
        $('.page-sidebar-menu').on('click', 'li > a.nav-toggle, li > a > span.nav-toggle', function (e) {
            var that = $(this).closest('.nav-item').children('.nav-link');

            var hasSubMenu = that.next().hasClass('sub-menu');

            var parent =that.parent().parent();
            var the = that;
            var menu = $('.page-sidebar-menu');
            var sub = that.next();

            var autoScroll = menu.data("auto-scroll");
            var slideSpeed = parseInt(menu.data("slide-speed"));
            var keepExpand = menu.data("keep-expanded");

            if (!keepExpand) {
                parent.children('li.open').children('a').children('.arrow').removeClass('open');
                parent.children('li.open').children('.sub-menu:not(.always-open)').slideUp(slideSpeed);
                parent.children('li.open').removeClass('open');
            }

            var slideOffeset = -200;

            if (sub.is(":visible")) {
                $('.arrow', the).removeClass("open");
                the.parent().removeClass("open");
                sub.slideUp(slideSpeed);
            } else if (hasSubMenu) {
                $('.arrow', the).addClass("open");
                the.parent().addClass("open");
                sub.slideDown(slideSpeed);
            }

            e.preventDefault();
        });
    };

    var handleHash = function() {
        // Anchors Position
        $('[data-hash]').each(function() {

            var target = $(this).attr('href'),
                offset = ($(this).is("[data-hash-offset]") ? $(this).data('hash-offset') : 0);

            if($(target).get(0)) {
                $(this).on('click', function(e) {
                    e.preventDefault();

                    // Close Collapse if Opened
                    $(this).parents('.collapse.in').removeClass('in');

                    scrollToTarget(target, offset);

                    return;
                });
            }

        });
    };

    var scrollToTarget = function(target, offset) {
        var self = this;

        $('body').addClass('scrolling');

        $('html, body').animate({
            scrollTop: $(target).offset().top - offset
        }, 600, 'easeOutQuad', function() {
            $('body').removeClass('scrolling');
        });

        return this;

    };

    return {
        initHeader: function () {
            handleHorizontalMenu(); // handles horizontal menu
            handleSidebarMenu(); // handles horizontal menu
        },

        init: function () {
            this.initHeader();
            handleHash();
        }
    }
}();

jQuery(document).ready(function() {
    Layout.init();
});

// Sticky Header
(function($) {

    var stickyHeader;

    stickyHeader = {

        defaults: {
            header: $('.header')
        },

        initialize: function($header) {
            var self = this;

            self.$header = ($header || self.defaults.header);
            self.$header_wrap = self.$header.parent();
            self.sticky_height = 0;
            self.sticky_offset = 0;
            self.sticky_pos = 0;

            if (!self.$header.length)
                return this;

            var $menu_wrap = self.$header.find('> .header-menu');
            self.$menu_wrap = $menu_wrap;
            self.menu_height = $menu_wrap.height();

            self.is_sticky = false;

            self.reset()
                .build()
                .events();

            return self;
        },

        build: function() {
            var self = this;

            if (!self.is_sticky && ($(window).height() + self.header_height) >= $(document).height()) {
                return self;
            }

            if ($(window).height() > $('body').height())
                window.scrollTo(0, 0);

            var scroll_top = $(window).scrollTop();

            if (scroll_top > self.sticky_pos) {
                if (!self.$header.hasClass('sticky-header')) {
                    self.$header.addClass('sticky-header');
                    self.$header.css('padding-bottom', self.menu_height + 10);

                    if (self.$header_wrap.hasClass('fixed-header')) {
                        self.$header.css('padding-bottom', 0);
                    }

                    self.is_sticky = true;
                }
            } else {
                if (self.$header.hasClass('sticky-header')) {
                    self.$header.removeClass('sticky-header');
                    self.$header.css('padding-bottom', 0);
                    self.$menu_wrap.stop().removeClass('sticky').css('top', 0);

                    self.is_sticky = false;
                }
            }

            return self;
        },

        reset: function() {
            var self = this;

            // show main menu
            self.$header.addClass('sticky-header sticky-header-calc');
            self.$menu_wrap.addClass('sticky');
            self.sticky_height = self.$menu_wrap.height() + parseInt(self.$menu_wrap.css('border-top'));
            self.sticky_offset = 0;
            self.$menu_wrap.removeClass('sticky');
            self.$header.removeClass('sticky-header');

            self.header_height = self.$header.height();
            self.menu_height = self.$menu_wrap.height() + parseInt(self.$menu_wrap.css('border-top'));
            self.$header.removeClass('sticky-header-calc');

            self.sticky_pos = (self.header_height - self.sticky_height);
            self.$header.removeAttr('style');

            return self;
        },

        events: function() {
            var self = this, w1 = 0, w2 = 0;

            $(window).on('resize', function() {
                if (w1 != $(window).width()) {
                    self.reset()
                        .build();
                    w1 = $(window).width();
                }
            });

            $(window).on('scroll', function() {
                self.build();
            });

            return self;
        }
    };

    stickyHeader.initialize();

}).apply(this, [jQuery]);

// Carousel
(function($) {

    var instanceName = '__carousel';

    var Carousel = function($el, opts) {
        return this.initialize($el, opts);
    };

    Carousel.defaults = $.extend({}, {
        loop: true,
        navText: [],
        themeConfig: false,
        lazyLoad: true,
        lg: 0,
        md: 0,
        sm: 0,
        xs: 0,
        responsive: {},
        single: false,
        refreshTimeOut: 200,
        autoHeight: true
    });

    // Add default responsive options
    var w_sm = 481,
        w_md = 768,
        w_lg = 992,
        w_xl = 1201;

    Carousel.defaults.responsive[0] = {items: 1};
    Carousel.defaults.responsive[w_sm] = {items: 1, mergeFit: false};
    Carousel.defaults.responsive[w_md] = {items: 1, mergeFit: false};
    Carousel.defaults.responsive[w_lg] = {items: 1, mergeFit: false};
    Carousel.defaults.responsive[w_xl] = {items: 1, mergeFit: false};

    Carousel.prototype = {
        initialize: function($el, opts) {
            if ($el.data(instanceName)) {
                return this;
            }

            this.$el = $el;

            this
                .setData()
                .setOptions(opts)
                .build()
                .bindEvent();

            return this;
        },

        setData: function() {
            this.$el.data(instanceName, this);

            return this;
        },

        setOptions: function(opts) {
            if ((opts && opts.themeConfig) || !opts) {
                this.options = $.extend(true, {}, Carousel.defaults, opts, {
                    wrapper: this.$el,
                    themeConfig: true
                });
            } else {
                this.options = $.extend(true, {}, Carousel.defaults, opts, {
                    wrapper: this.$el
                });
            }

            return this;
        },

        build: function() {
            if (!($.isFunction($.fn.owlCarousel))) {
                return this;
            }

            var self = this,
                $el = this.options.wrapper,
                loop = this.options.loop,
                lg = this.options.lg ? this.options.lg : this.options.items,
                md = this.options.md ? this.options.md : this.options.items,
                sm = this.options.sm ? this.options.sm : this.options.items,
                xs = this.options.xs ? this.options.xs : this.options.items,
                single = this.options.single,
                responsive = {},
                items,
                count = $el.find('> *').length;

            if (single) {
                items = 1;
            } else {
                items = this.options.items ? this.options.items : (lg ? lg : 1);
                responsive[w_xl] = { items: items, loop: (loop && count >= items) ? true : false, mergeFit: this.options.mergeFit };
                if (lg) responsive[w_lg] = { items: lg, loop: (loop && count >= lg) ? true : false, mergeFit: this.options.mergeFit_lg };
                if (md) responsive[w_md] = { items: md, loop: (loop && count >= md) ? true : false, mergeFit: this.options.mergeFit_md };
                if (sm) responsive[w_sm] = { items: sm, loop: (loop && count >= sm) ? true : false, mergeFit: this.options.mergeFit_sm };
                if (xs) responsive[0] = { items: xs, loop: (loop && count >= xs) ? true : false, mergeFit: this.options.mergeFit_xs };
            }

            this.options = $.extend(true, {}, this.options, {
                items: items,
                loop: (loop && count >= items) ? true : false,
                responsive: responsive,
                onInitialized: function() {
                    $el.find('.owl-stage-outer').css({
                        'margin-left': this.options.stagePadding,
                        'margin-right': this.options.stagePadding
                    });

                    $el.find('.owl-stage').css({
                        'padding-left': 0,
                        'padding-right': 0
                    });
                },
                touchDrag: (count == 1) ? false : true,
                mouseDrag: (count == 1) ? false : true
            });

            // Auto Height Fixes
            if (this.options.autoHeight) {
                function calcOwlHeight() {
                    var h = 0;
                    $el.find('.owl-item.active').each(function() {
                        if (h < $(this).height())
                            h = $(this).height();
                    });
                    $el.find('.owl-stage-outer').height( h );
                }
                $(window).on('resize', function() {
                    calcOwlHeight();
                });

                $(window).on('load', function() {
                    calcOwlHeight();
                });
            }

            setTimeout(function() {
                $el.owlCarousel(self.options);

                if (self.options.customNav) {
                    $el.parent().find('.custom-owl-prev').off('click').on('click', function() {
                        $el.find('.owl-nav .owl-prev').click();
                    });
                    $el.parent().find('.custom-owl-next').off('click').on('click', function() {
                        $el.find('.owl-nav .owl-next').click();
                    });

                }
                self.updateImageHeight();
            }, self.options.refreshTimeOut);

            return this;
        },

        updateImageHeight: function() {
            var self = this,
                $el = this.options.wrapper,
                autoHeight = this.options.autoHeight,
                $imgs = $el.find('img');

            if (autoHeight)
                return;

            $imgs.removeAttr('style');
            $el.owlCarousel('update');

            var height;

            height = 0;

            $imgs.each(function() {
                var $img = $(this),
                    img_height = $img.height();

                if (img_height > height)
                    height = img_height;
            });

            $imgs.each(function() {
                var $img = $(this),
                    img_height = $img.height();

                $img.css('margin-top', (height - img_height) / 2);
                $img.css('margin-bottom', (height - img_height) / 2);
            });

            $el.owlCarousel('update');
        },

        bindEvent: function() {
            var self = this,
                $el = this.options.wrapper;

            $(window).on('load resize', function () {
                setTimeout(function () {
                    self.updateImageHeight();
                    $el.owlCarousel('destroy');
                    $el.owlCarousel(self.options);
                }, self.options.refreshTimeOut + 200);
            });
        }
    };

    // jquery plugin
    $.fn.themeCarousel = function(opts) {
        return this.map(function() {
            var $this = $(this);

            if ($this.data(instanceName)) {
                return $this.data(instanceName);
            } else {
                return new Carousel($this, opts);
            }

        });
    }

}).apply(this, [jQuery]);

jQuery(document).ready(function($) {
    var $carousel = $('.owl-carousel');

    $carousel.each(function() {
        var $this = $(this), options;

        if ($this.hasClass('manual'))
            return;

        if ($this.attr('data-plugin-options')) {
            try {
                options = JSON.parse($this.attr('data-plugin-options'));
            } catch(e) {
                options = {};
            }
        } else {
            options = {};
        }

        $this.themeCarousel(options);
    });

    $('.post-gallery-title .type-photo').click(function() {
        var $this = $(this),
            $article = $this.closest('article');

        $this.addClass('active');
        $article.find('.post-gallery-title .type-video').removeClass('active');
        $article.find('.post-gallery-title .type-doc').removeClass('active');
        $article.find('.post-gallery-photo').removeClass('hidden');
        $article.find('.post-gallery-video').addClass('hidden');
        $article.find('.post-gallery-doc').addClass('hidden');
        $(window).trigger('resize');
    });

    $('.post-gallery-title .type-video').click(function() {
        var $this = $(this),
            $article = $this.closest('article');

        $this.addClass('active');
        $article.find('.post-gallery-title .type-photo').removeClass('active');
        $article.find('.post-gallery-title .type-doc').removeClass('active');
        $article.find('.post-gallery-video').removeClass('hidden');
        $article.find('.post-gallery-photo').addClass('hidden');
        $article.find('.post-gallery-doc').addClass('hidden');
    });

    $('.post-gallery-title .type-doc').click(function() {
        var $this = $(this),
            $article = $this.closest('article');

        $this.addClass('active');
        $article.find('.post-gallery-title .type-photo').removeClass('active');
        $article.find('.post-gallery-title .type-video').removeClass('active');
        $article.find('.post-gallery-doc').removeClass('hidden');
        $article.find('.post-gallery-photo').addClass('hidden');
        $article.find('.post-gallery-video').addClass('hidden');
    });
});

// Scroll to Top
(function($) {

    var initialized = false, scrollToTop;

    scrollToTop = {
        defaults: {
            wrapper: $('body'),
            offset: 150,
            buttonClass: 'scroll-to-top',
            iconClass: 'fa fa-chevron-up',
            delay: 1000,
            visibleMobile: false,
            label: false,
            easing: 'easeOutBack'
        },

        initialize: function(opts) {
            initialized = true;

            this
                .setOptions(opts)
                .build()
                .events();

            return this;
        },

        setOptions: function(opts) {
            this.options = $.extend(true, {}, this.defaults, opts);

            return this;
        },

        build: function() {
            var self = this,
                $el;

            // Base HTML Markup
            $el = $('<a />')
                .addClass(self.options.buttonClass)
                .attr({
                    'href': '#'
                })
                .append(
                    $('<i />')
                        .addClass(self.options.iconClass)
                );

            // Visible Mobile
            if (!self.options.visibleMobile) {
                $el.addClass('mobile-hidden');
            }

            // Label
            if (self.options.label) {
                $el.append(
                    $('<span />').html(self.options.label)
                );
            }

            this.options.wrapper.append($el);

            this.$el = $el;

            return this;
        },

        events: function() {
            var self = this,
                _isScrolling = false;

            // Click Element Action
            self.$el.on('click', function(e) {
                e.preventDefault();
                $('body, html').animate({
                    scrollTop: 0
                }, self.options.delay, self.options.easing);
                return false;
            });

            // Show/Hide Button on Window Scroll event.
            $(window).scroll(function() {

                if (!_isScrolling) {

                    _isScrolling = true;

                    if ($(window).scrollTop() > self.options.offset) {

                        self.$el.stop(true, true).addClass('visible');
                        _isScrolling = false;

                    } else {

                        self.$el.stop(true, true).removeClass('visible');
                        _isScrolling = false;

                    }
                }

            });

            return this;
        }
    };

    scrollToTop.initialize();

}).apply(this, [jQuery]);

jQuery(document).ready(function($) {
    // Product Details Gallery
    if ($.fn.elevateZoom) {
        $('#product-zoom').elevateZoom({
            responsive: true,
            zoomType: "inner",
            cursor: "default"
        });
    }

    $('#productGalleryThumbs')
        .owlCarousel({
            margin: 5,
            items: 4,
            nav: false,
            center: false,
            dots: false,
            autoplay: false
        })
        .on('click', '.owl-item', function(e) {
            var ez = $('#product-zoom').data('elevateZoom'),
                targetLink= $(this).find('a'),
                smallImg = targetLink.data('image'),
                bigImg = targetLink.data('zoom-image');

            // Sync data-zoom-image for gallery
            $('#product-zoom').attr('data-zoom-image',bigImg);

            // prevent default
            $.magnificPopup.close();

            ez.swaptheimage(smallImg, bigImg);
        });

    // Set up gallery on click
    var galleryZoom = $('#productGalleryThumbs');
    galleryZoom.magnificPopup({
        delegate: 'a',
        type: 'image',
        gallery:{
            enabled: true
        },
        callbacks: {
            elementParse: function(item) {
                item.src = item.el.attr('data-zoom-image');
            }
        }
    });

    // Zoom image when click on icon
    $('.product-img-zoom').on('click', function(){
        var current = $('#product-zoom').attr('data-zoom-image');

        $('#productGalleryThumbs .owl-item').each(function(){
            if( current == $(this).find('.product-gallery-item').attr('data-zoom-image') ) {
                return galleryZoom.magnificPopup('open', $(this).index());
            }
        });
    });

    // No def events for links
    $('#productGalleryThumbs').find('a').on('click', function (e) {
        e.preventDefault();
    });
});