(function($) {

    // Preloader 
    jQuery(window).on('load', function() {
        jQuery("#status").fadeOut();
        jQuery("#preloader").delay(200).fadeOut("slow");
        $('#first_modal').modal('show');

        new WOW().init({
            mobile: false
        });
    });

    // -------------------------------------------------------------
    // Shuffle
    // -------------------------------------------------------------

    jQuery(window).on('load', function() {
        /** this is come when complete page is fully loaded, including all frames, objects and images **/

        $('.revolution-slider').revolution({
            delay: 1000,
            startwidth: 1170,
            startheight: 460,
            hideThumbs: 10,
            fullWidth: "on",
            fullScreen: "on",
            navigationType: "none",
            navigationArrows: "solo",
            hideCaptionAtLimit: "",
            navigationStyle: "preview4",
            fullWidth: "on",
            touchenabled: "on", // Enable Swipe Function : on/off
            onHoverStop: "on", // Stop Banner Timet at Hover on Slide on/off
            fullScreenOffsetContainer: "",
            shadow: 0
        });
        $('.revolution-slider-sp').revolution({
            delay: 1000,
            startwidth: 1170,
            startheight: 460,
            hideThumbs: 10,
            fullWidth: "on",
            fullScreen: "on",
            navigationType: "none",
            navigationArrows: "solo",
            hideCaptionAtLimit: "",
            navigationStyle: "preview4",
            fullWidth: "on",
            touchenabled: "on", // Enable Swipe Function : on/off
            onHoverStop: "on", // Stop Banner Timet at Hover on Slide on/off
            fullScreenOffsetContainer: "",
            shadow: 0
        });

        $(".owl-carousel-slider").owlCarousel({
            loop: true,
            margin: 0,
            responsiveClass: true,
            nav: true,
            autoplay: true,
            autoplayTimeout: 4000,
            smartSpeed: 1000,
            navText: ['<i class="lnr lnr-chevron-left"></i>', '<i class="lnr lnr-chevron-right"></i>'],
            responsive: {
                0: {
                    items: 1,
                },
                600: {
                    items: 2
                },
                1000: {
                    items: 4
                }
            }
        });
        $(".owl-carousel-slider .section-item-slider").css("width", "100%");

        var send_url = window.location.href;
        var send_data = send_url.split('?');
        if (send_data.length > 1) {
            var tag_flag = send_data[1].split('=');
            if (tag_flag[1] == "eye") {
                $(".article-name").removeClass('active');
                $('#eye').parent().parent().addClass('active');

            }
        }

    });


    // on ready function
    $(document).ready(function() {
        "use strict";
        //----------------------- MENU FIXED JS -----------------------//

        $(window).scroll(function() {
            var window_top = $(window).scrollTop() + 1;
            if (window_top > 83) {
                if (!$('.header').hasClass('active')) {
                    $('.header').addClass('menu_fixed animated fadeInDown');
                }
            } else {
                $('.header').removeClass('menu_fixed animated fadeInDown');
            }
        });
        var window_width = $(window).width();
        $(".one-down").on('click', function(e) {
            e.preventDefault();
            let pos;
            if (window_width < 768) {
                pos = $("#section-01").offset().top - 89;
            } else {
                pos = $("#section-01").offset().top - 164;
            }

            $('body,html').animate({
                scrollTop: pos
            }, 500);
        });
        $(".classic-menu-dropdown > a.title").on('click', function(e) {
            if (window_width < 768) {
                e.preventDefault();
            }
        });

        // -----------------------PulSate ------------------------- //
        $("#btn-pulsate-method").pulsate({ color: "#ff0000", reach: 15, speed: 2e3, glow: !0 });

        /*------------------- Scroll to top ----------------------*/
        $.scrollUp({
            scrollText: '<i class="lnr lnr-chevron-up"></i>',
            easingType: 'linear',
            scrollSpeed: 900,
            animation: 'fade'
        });
        /*--- Responsive Menu Start ----*/

        $(".navbar-toggle").on('click', function() {
            var w = $('#sidebar').width();
            var pos = $('#sidebar').offset().left;

            if (pos === 0) {
                $("#sidebar").animate({ "left": -w - 50 }, "slow");
            } else {
                $("#sidebar").animate({ "left": "0" }, "slow");
            }

        });

        (function($) {
            $(document).ready(function() {

                $('.nav-hamburger').on('click', function() {
                    $(this).toggleClass('hamburger--open');
                    $(".header").toggleClass('active');
                });

                $('.search-icon-btn').on('click', function() {
                    $(".header .search-wrap").toggleClass('active');
                });

                $('#cssmenu li.active').addClass('open').children('ul').show();
                $('#cssmenu li.has-sub>a').on('click', function() {
                    $(this).removeAttr('href');
                    var element = $(this).parent('li');
                    if (element.hasClass('open')) {
                        element.removeClass('open');
                        element.find('li').removeClass('open');
                        element.find('ul').slideUp(200);
                    } else {
                        element.addClass('open');
                        element.children('ul').slideDown(200);
                        element.siblings('li').children('ul').slideUp(200);
                        element.siblings('li').removeClass('open');
                        element.siblings('li').find('li').removeClass('open');
                        element.siblings('li').find('ul').slideUp(200);
                    }
                });

            });
        })(jQuery);

        /*--- Responsive Menu End ----*/


        // -------------------------------------------------------------
        // Progress Bar
        // -------------------------------------------------------------

        $('.progress_wrapper').on('inview', function(event, visible, visiblePartX, visiblePartY) {
            if (visible) {
                $.each($('div.progress-bar'), function() {
                    $(this).css('width', $(this).attr('aria-valuenow') + '%');
                });
                $(this).off('inview');
            }
        });





        /*--------------------------
        scrollUp
        ---------------------------- */
        // ===== Scroll to Top ==== 
        $(window).scroll(function() {
            if ($(this).scrollTop() >= 100) {
                $('#return-to-top').fadeIn(200);
            } else {
                $('#return-to-top').fadeOut(200);
            }
        });
        $('#return-to-top').on('click', function() {
            $('body,html').animate({
                scrollTop: 0
            }, 500);
        });



        // main_slider_section slider_area ==================== start

        //Function to animate slider captions 
        function doAnimations(elems) {
            //Cache the animationend event in a variable
            var animEndEv = 'webkitAnimationEnd animationend';

            elems.each(function() {
                var $this = $(this),
                    $animationType = $this.data('animation');
                $this.addClass($animationType).one(animEndEv, function() {
                    $this.removeClass($animationType);
                });
            });
        }

        //Variables on page load 
        var $myCarousel = $('#carousel-example-generic'),
            $firstAnimatingElems = $myCarousel.find('.item:first').find("[data-animation ^= 'animated']");

        //Initialize carousel 
        $myCarousel.carousel();

        //Animate captions in first slide on page load 
        doAnimations($firstAnimatingElems);

        //Pause carousel  
        $myCarousel.carousel('pause');


        //Other slides to be animated on carousel slide event 
        $myCarousel.on('slide.bs.carousel', function(e) {
            var $animatingElems = $(e.relatedTarget).find("[data-animation ^= 'animated']");
            doAnimations($animatingElems);
        });

        // main_slider_section slider_area ==================== end



        // Modal alarm(new) --(ʲ���� �ϻ�)�ޱ��� ����---//
        setTimeout(function() {
            $('#top-menu').modal();
        }, 2000);


        // var windowHeight = $(window).height();
        // var windowWidth = $(window).width();
        // var boxHeight = $('.modal-dialog').height();
        // var boxWidth = $('.modal-dialog').width();
        // $('.modal-dialog').css({ 'left': ((windowWidth - boxWidth) / 2), 'top': ((windowHeight - boxHeight) / 6) });


        var send_tag = null;
        $(".article-name a").on('click', function(e) {
            e.preventDefault();
            $(".article-name").removeClass('active');
            $(this).parent().addClass('active');
            send_tag = $(this).find('.article-subttl-name').attr('id');
            var send_url = window.location.href;
            var send_data = send_url.split('?');
            location.href = send_data[0] + '?show=' + send_tag;
        });

        function load_posts() {
            var str = '&tag=' + send_tag + '&action=get_list_data';
            showLoading();
            $.ajax({
                type: "POST",
                dataType: "html",
                url: ajaxurl,
                data: str,
                success: function(data) {
                    console.log(data);
                },
                error: function(jqXHR, textStatus, errorThrown) {
                    console.log(jqXHR + " :: " + textStatus + " :: " + errorThrown);
                    hideLoading();
                },
                complete: function() {
                    hideLoading();
                }

            }).done(function() {
                hideLoading();
            });

            return false;
        }

        function showLoading() {
            $("#status").fadeIn();
            $("#preloader").delay(100).fadeIn();
        }

        function hideLoading() {
            $("#status").fadeOut();
            $("#preloader").delay(200).fadeOut("slow");
        }

        // EG Custom Code

        $(".show-imgs").click(function() {
            var $wrapper = $(".revreport-wrapper");
            var items = [];
            var index = 0;
            $wrapper.find("img").each(function() {
                items.push({
                    href : $(this).attr("src"), 
                    // title : ++index + ""
                });
            });

            $.fancybox.open(
            items, {
                wrapCSS    : 'fancybox-revreport',
                openEffect : 'none',
                closeEffect : 'none',
                prevEffect : 'none',
                nextEffect : 'none',

                padding: 0,

                arrows : false,
                nextClick : true,
                helpers : {
                    buttons : {
                        tpl : '<div id="fancybox-buttons"><ul class="fancybox-btnclose"><a class="btnClose" title="" href="javascript:jQuery.fancybox.close();"></a></ul><ul><li><a class="btnPrev" title="" href="javascript:;"></a></li><li class="idx-wrapper"><a class="itemIdx" title="" href="javascript:;">'+'1 / '+items.length+'</a></li><li><a class="btnNext" title="" href="javascript:;"></a></li></ul></div>',
                        position: "bottom"
                    },
                    title : {
                        type : 'outside'
                    },
                    overlay : {
                        css : {
                            'background' : 'rgba(128,0,0,1)'
                        }
                    }
                },

                afterLoad : function() {
                    $("#fancybox-buttons a.itemIdx").text((this.index + 1) + ' / ' + this.group.length);
                }
            });
        });

        $(".show-post-imgs").click(function(e) {
            e.preventDefault();
            var $imgDiv = $(this).parents(".section-list-content").find(".post-imgs");
            var $imgs = $imgDiv.data('imgs').split(";;");
            var items = [];
            var index = 0;
            for (var i = 0; i < $imgs.length-1; i++) {
                items.push({
                    href : $imgs[i], 
                    // title : ++index + ""
                });
            };

            $.fancybox.open(
            items, {
                wrapCSS    : 'fancybox-revreport',
                openEffect : 'none',
                closeEffect : 'none',
                prevEffect : 'none',
                nextEffect : 'none',

                padding: 0,

                arrows : false,
                nextClick : true,
                helpers : {
                    buttons : {
                        tpl : '<div id="fancybox-buttons"><ul class="fancybox-btnclose"><a class="btnClose" title="" href="javascript:jQuery.fancybox.close();"></a></ul><ul><li><a class="btnPrev" title="" href="javascript:;"></a></li><li class="idx-wrapper"><a class="itemIdx" title="" href="javascript:;">'+'1 / '+items.length+'</a></li><li><a class="btnNext" title="" href="javascript:;"></a></li></ul></div>',
                        position: "bottom"
                    },
                    title : {
                        type : 'outside'
                    },
                    overlay : {
                        css : {
                            'background' : 'rgba(128,0,0,1)'
                        }
                    }
                },

                afterLoad : function() {
                    $("#fancybox-buttons a.itemIdx").text((this.index + 1) + ' / ' + this.group.length);
                }
            });
        });

        $("body").on('contextmenu', ".fancybox-overlay", function(e) {
            e.preventDefault();
            return false;
        });
         $("body").on('contextmenu', ".bottom", function(e) {
            e.preventDefault();
            return false;
        });

    });

})(jQuery);