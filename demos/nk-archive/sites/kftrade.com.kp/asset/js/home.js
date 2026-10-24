$(document).ready(function(){
  
});

var intervalId = window.setInterval(goodsFlicker, 900);

function goodsFlicker(){
  var goodsMark = $("#goods-intro .mark img");
  if(goodsMark.attr("src") == getUrlAssets("asset/img/goods-mark-hover.png"))
    goodsMark.attr("src", getUrlAssets("asset/img/goods-mark.png"));
  else
    goodsMark.attr("src", getUrlAssets("asset/img/goods-mark-hover.png"));
}

function showGoodsCate(){
  $(".yamm.navbar").hide();
  $("#goods-intro").addClass("hide");
  $("#goods-cate").removeClass("hide");
  $("#goods-cate div[class^='col-']").height($(window).height());
  location.href = "#goods-cate";

  $("#goods-cate .item .itemmask").mouseenter(function(){
    $(this).css("visibility", "hidden");
  });
  $("#goods-cate .item").mouseleave(function(){
    $(this).find(".itemmask").css("visibility", "visible");
  });

  $(window).on("scroll", function(){
    var gcPos = $("#goods-cate").position();
    if( ! $("#goods-cate").hasClass("hide")){
      if (window.scrollY != gcPos.top) {
        $(".yamm.navbar").show();
        $("#goods-intro").removeClass("hide");
        $("#goods-cate").addClass("hide");
        $(window).off("scroll");
      }
    }
  });
}

var RevosliderInit = function () {

    return {
        initRevoSlider: function () {
                  jQuery('.fullwidthbanner').show().revolution({ 
                      delay:2000,
                      startheight:760,
                      startwidth:1900,

                      hideThumbs:10,

                      thumbWidth:100,                         // Thumb With and Height and Amount (only if navigation Tyope set to thumb !)
                      thumbHeight:50,
                      thumbAmount:5,

                      navigationType:"bullet",                // bullet, thumb, none
                      navigationArrows:"solo",                // nexttobullets, solo (old name verticalcentered), none

                      navigationStyle:"round",                // round,square,navbar,round-old,square-old,navbar-old, or any from the list in the docu (choose between 50+ different item), custom

                      navigationHAlign:"center",              // Vertical Align top,center,bottom
                      navigationVAlign:"bottom",              // Horizontal Align left,center,right
                      navigationHOffset:0,
                      navigationVOffset:20,

                      soloArrowLeftHalign:"left",
                      soloArrowLeftValign:"center",
                      soloArrowLeftHOffset:20,
                      soloArrowLeftVOffset:0,

                      soloArrowRightHalign:"right",
                      soloArrowRightValign:"center",
                      soloArrowRightHOffset:20,
                      soloArrowRightVOffset:0,

                      touchenabled:"on",                      // Enable Swipe Function : on/off
                      onHoverStop:"off",                       // Stop Banner Timet at Hover on Slide on/off

                      stopAtSlide:-1,
                      stopAfterLoops:-1,

                      hideCaptionAtLimit:0,         // It Defines if a caption should be shown under a Screen Resolution ( Basod on The Width of Browser)
                      hideAllCaptionAtLilmit:0,       // Hide all The Captions if Width of Browser is less then this value
                      hideSliderAtLimit:0,          // Hide the whole slider, and stop also functions if Width of Browser is less than this value

                      shadow:1,                               //0 = no Shadow, 1,2,3 = 3 Different Art of Shadows  (No Shadow in Fullwidth Version !)
                      fullWidth:"on"                          // Turns On or Off the Fullwidth Image Centering in FullWidth Modus
                  });
        }
    };

}();


var initCarouselData = function () {

    return {
        //main function to initiate the module
        init: function () {

            function setItemCount(){
              if ($(window).width() < 998) 
                $(".owl-carousel").attr("data-plugin-options", '{"items": 2, "nav": true, "loop": true, "dots": true, "autoplay": true, "autoplayTimeout": 3000, "stagePadding": 40}');
            }
            
            function owl_carousel() {
                (function(theme, $) {

                    theme = theme || {};

                    var instanceName = '__carousel';

                    var PluginCarousel = function($el, opts) {
                        return this.initialize($el, opts);
                    };

                    PluginCarousel.defaults = {
                        loop: false,
                        rewind: true,
                        startPosition: 0,
                        navText: ['<i class="fa fa-angle-left"></i>', '<i class="fa fa-angle-right"></i>']
                    };

                    PluginCarousel.prototype = {
                        initialize: function($el, opts) {
                            if ($el.data(instanceName)) {
                                return this;
                            }

                            this.$el = $el;

                            this
                                .setData()
                                .setOptions(opts)
                                .build();

                            return this;
                        },

                        setData: function() {
                            this.$el.data(instanceName, this);

                            return this;
                        },

                        setOptions: function(opts) {
                            this.options = $.extend(true, {}, PluginCarousel.defaults, opts, {
                                wrapper: this.$el
                            });

                            return this;
                        },

                        build: function() {
                            if (!($.isFunction($.fn.owlCarousel))) {
                                return this;
                            }

                            var self = this,
                                $el = this.options.wrapper;

                            // Add Theme Class
                            $el.addClass('owl-theme');

                            // Force RTL according to HTML dir attribute
                            if ($('html').attr('dir') == 'rtl') {
                                this.options = $.extend(true, {}, this.options, {
                                    rtl: true
                                });
                            }

                            if (this.options.items == 1) {
                                this.options.responsive = {}
                            }

                            if (this.options.items > 4) {
                                this.options = $.extend(true, {}, this.options, {
                                    responsive: {
                                        1199: {
                                            items: this.options.items
                                        }
                                    }
                                });
                            }

                            // Auto Height Fixes
                            if (this.options.autoHeight) {
                                $(window).afterResize(function() {
                                    $el.find('.owl-stage-outer').height( $el.find('.owl-item.active').height() );
                                });

                                $(window).load(function() {
                                    $el.find('.owl-stage-outer').height( $el.find('.owl-item.active').height() );
                                });
                            }

                            // Initialize OwlCarousel
                            $el.owlCarousel(this.options).addClass("owl-carousel-init");

                            return this;
                        }
                    };

                    // expose to scope
                    $.extend(theme, {
                        PluginCarousel: PluginCarousel
                    });

                    // jquery plugin
                    $.fn.themePluginCarousel = function(opts) {
                        return this.map(function() {
                            var $this = $(this);

                            if ($this.data(instanceName)) {
                                return $this.data(instanceName);
                            } else {
                                return new PluginCarousel($this, opts);
                            }

                        });
                    }

                }).apply(this, [window.theme, jQuery]);
            }

            function owl_carousel_init() {
                (function($) {
                    if ($.isFunction($.fn['themePluginCarousel'])) {
                        $(function() {
                            $('[data-plugin-carousel]:not(.manual), .owl-carousel:not(.manual)').each(function() {
                                var $this = $(this),
                                    opts;

                                var pluginOptions = $this.data('plugin-options');
                                if (pluginOptions)
                                    opts = pluginOptions;

                                $this.themePluginCarousel(opts);
                            });
                        });
                    }
                }).apply(this, [jQuery]);
            }

            setItemCount();
            owl_carousel();
            owl_carousel_init();
        },
        update: function() {
            function owl_carousel_init() {
                (function($) {
                    if ($.isFunction($.fn['themePluginCarousel'])) {
                        $(function() {
                            $('[data-plugin-carousel]:not(.manual), .owl-carousel:not(.manual)').each(function() {
                                var $this = $(this),
                                    opts;

                                if ($(this)[0].id != 'news-featured-2') {
                                    if (($this.data('owl.carousel') != '') && ($this.data('owl.carousel') != null) && ($this.data('owl.carousel') != undefined)) {
                                        $this.data('owl.carousel').destroy();
                                    }

                                    var pluginOptions = $this.data('plugin-options');
                                    if (pluginOptions)
                                        opts = pluginOptions;
                                    opts.loop = (opts.loop == false) ? opts.loop : true;
                                    opts.responsive = {};
                                    opts.navText = [];
                                    $this.owlCarousel(opts).addClass("owl-carousel-init");
                                }
                            });
                        });
                    }
                }).apply(this, [jQuery]);
            }
            owl_carousel_init();
        }
    };

}();

initCarouselData.init();

function activeItem(){
    
}

function initIntro(){
    setTimeout(function () {
        var unique_id = $.gritter.add({
            // (string | mandatory) the heading of the notification
            title: $("#newstitle").val(),
            // (string | mandatory) the text inside the notification
            text: $("#newsContent").val(),
            // (string | optional) the image to display on the left
            image: '',
            // (bool | optional) if you want it to fade out on its own or just sit there
            sticky: true,
            // (int | optional) the time you want it to be alive for before fading out
            time: '',
            // (string | optional) the class name you want to apply to that specific message
            class_name: 'my-sticky-class'
        });
        setTimeout(function () {
            $.gritter.remove(unique_id, {
                fade: true,
                speed: 'slow'
            });
        }, 5000);
    }, 1000);
}

initIntro();

$(".modal").on('shown.bs.modal', function () {
  var vid = $(this).find("video")[0];
  vid.play();
  alizerCount("%2Findex.php%2Fhome%2Findex%3Flang%3Den", $(this).find(".playing-video-title").html(), "video");
});

$(".modal").on('hide.bs.modal', function () {
  var vid = $(this).find("video")[0];
  vid.currentTime = 1;
  vid.pause();
});