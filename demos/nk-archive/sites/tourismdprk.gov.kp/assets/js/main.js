function get_browser() {
    var ua = navigator.userAgent,
        tem,
        M =
            ua.match(
                /(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i
            ) || [];
    if (/trident/i.test(M[1])) {
        tem = /\brv[ :]+(\d+)/g.exec(ua) || [];
        return { name: "IE", version: tem[1] || "" };
    }
    if (M[1] === "Chrome") {
        tem = ua.match(/\bOPR|Edge\/(\d+)/);
        if (tem != null) {
            return { name: "Opera", version: tem[1] };
        }
    }
    M = M[2] ? [M[1], M[2]] : [navigator.appName, navigator.appVersion, "-?"];
    if ((tem = ua.match(/version\/(\d+)/i)) != null) {
        M.splice(1, 1, tem[1]);
    }
    return {
        name: M[0],
        version: M[1],
        isMobile: /Mobi/.test(ua),
    };
}

var check_browser_version = function() {
    var browser = this.get_browser();
    if (
        browser.isMobile === false &&
        (browser.name === "Firefox" || browser.name === "Chrome")
    ) {
        if (
            (browser.name === "Firefox" &&
                parseInt(browser.version, 10) < 45) ||
            (browser.name === "Chrome" && parseInt(browser.version, 10) < 50)
        ) {
            $("#not_support_info").css("display", "block");
            $("#root").css("display", "none");
        } else {
        }
    }
};
check_browser_version();

var loadFlexSlider = function() {
    if (!$().flexslider) {
        console.log("loadFlexSlider: FlexSlider not Defined.");
        return true;
    }

    var $flexSliderEl = $(".fslider:not(.customjs)").find(".flexslider");
    if ($flexSliderEl.length > 0) {
        $flexSliderEl.each(function() {
            var $flexsSlider = $(this),
                flexsAnimation = $flexsSlider
                    .parent(".fslider")
                    .attr("data-animation"),
                flexsEasing = $flexsSlider
                    .parent(".fslider")
                    .attr("data-easing"),
                flexsDirection = $flexsSlider
                    .parent(".fslider")
                    .attr("data-direction"),
                flexsReverse = $flexsSlider
                    .parent(".fslider")
                    .attr("data-reverse"),
                flexsSlideshow = $flexsSlider
                    .parent(".fslider")
                    .attr("data-slideshow"),
                flexsPause = $flexsSlider.parent(".fslider").attr("data-pause"),
                flexsSpeed = $flexsSlider.parent(".fslider").attr("data-speed"),
                flexsVideo = $flexsSlider.parent(".fslider").attr("data-video"),
                flexsPagi = $flexsSlider.parent(".fslider").attr("data-pagi"),
                flexsArrows = $flexsSlider
                    .parent(".fslider")
                    .attr("data-arrows"),
                flexsThumbs = $flexsSlider
                    .parent(".fslider")
                    .attr("data-thumbs"),
                flexsHover = $flexsSlider.parent(".fslider").attr("data-hover"),
                flexsSheight = $flexsSlider
                    .parent(".fslider")
                    .attr("data-smooth-height"),
                flexsTouch = $flexsSlider.parent(".fslider").attr("data-touch"),
                flexsUseCSS = false;

            if (!flexsAnimation) {
                flexsAnimation = "slide";
            }
            if (!flexsEasing || flexsEasing == "swing") {
                flexsEasing = "swing";
                flexsUseCSS = true;
            }
            if (!flexsDirection) {
                flexsDirection = "horizontal";
            }
            if (flexsReverse == "true") {
                flexsReverse = true;
            } else {
                flexsReverse = false;
            }
            if (!flexsSlideshow) {
                flexsSlideshow = true;
            } else {
                flexsSlideshow = false;
            }
            if (!flexsPause) {
                flexsPause = 5000;
            }
            if (!flexsSpeed) {
                flexsSpeed = 600;
            }
            if (!flexsVideo) {
                flexsVideo = false;
            }
            if (flexsSheight == "false") {
                flexsSheight = false;
            } else {
                flexsSheight = true;
            }
            if (flexsDirection == "vertical") {
                flexsSheight = false;
            }
            if (flexsPagi == "false") {
                flexsPagi = false;
            } else {
                flexsPagi = true;
            }
            if (flexsThumbs == "true") {
                flexsPagi = "thumbnails";
            } else {
                flexsPagi = flexsPagi;
            }
            if (flexsArrows == "false") {
                flexsArrows = false;
            } else {
                flexsArrows = true;
            }
            if (flexsHover == "false") {
                flexsHover = false;
            } else {
                flexsHover = true;
            }
            if (flexsTouch == "false") {
                flexsTouch = false;
            } else {
                flexsTouch = true;
            }

            $flexsSlider.flexslider({
                selector: ".slider-wrap > .slide",
                animation: flexsAnimation,
                easing: flexsEasing,
                direction: flexsDirection,
                reverse: flexsReverse,
                slideshow: flexsSlideshow,
                slideshowSpeed: Number(flexsPause),
                animationSpeed: Number(flexsSpeed),
                pauseOnHover: flexsHover,
                video: flexsVideo,
                controlNav: flexsPagi,
                directionNav: flexsArrows,
                smoothHeight: flexsSheight,
                useCSS: flexsUseCSS,
                touch: flexsTouch,
                start: function(slider) {
                    // SEMICOLON.widget.animations();
                    // SEMICOLON.initialize.verticalMiddle();
                    // slider.parent().removeClass('preloader2');
                    // var t = setTimeout( function(){ $('.grid-container').isotope('layout'); }, 1200 );
                    // SEMICOLON.initialize.lightbox();
                    $(".flex-prev").html('<i class="icon-angle-left"></i>');
                    $(".flex-next").html('<i class="icon-angle-right"></i>');
                    // SEMICOLON.portfolio.portfolioDescMargin();
                },
                after: function() {
                    if ($(".grid-container").hasClass("portfolio-full")) {
                        $(".grid-container.portfolio-full").isotope("layout");
                        // SEMICOLON.portfolio.portfolioDescMargin();
                    }
                },
            });
        });
    }
};

var InitAOS = function() {
    AOS.init({
        duration: 800,
        easing: "slide",
    });
};

var initSingleSlider = function(selector) {
    $(selector).carousel({ interval: 4000 });
    $(selector).carousel("cycle");

    // $('video').on('play', function (e) {
    // 	$(selector).carousel('pause');
    // });
    // $('video').on('stop pause ended', function (e) {
    // 	$(selector).carousel();
    // });
};

function openHomeADS() {
    var $lightboxGalleryEl = $('[data-lightbox="home-ads"]');

    if ($lightboxGalleryEl.length > 0) {
        $lightboxGalleryEl.each(function() {
            var element = $(this);

            if (
                element
                    .find('a[data-lightbox="home-ads-item"]')
                    .parent(".clone")
                    .hasClass("clone")
            ) {
                element
                    .find('a[data-lightbox="gallery-item"]')
                    .parent(".clone")
                    .find('a[data-lightbox="home-ads-item"]')
                    .attr("data-lightbox", "");
            }

            if (
                element
                    .find('a[data-lightbox="home-ads-item"]')
                    .parents(".cloned")
                    .hasClass("cloned")
            ) {
                element
                    .find('a[data-lightbox="home-ads-item"]')
                    .parents(".cloned")
                    .find('a[data-lightbox="home-ads-item"]')
                    .attr("data-lightbox", "");
            }

            element.magnificPopup({
                delegate: 'a[data-lightbox="home-ads-item"]',
                type: "image",
                closeOnContentClick: true,
                // closeBtnInside: false,
                fixedContentPos: true,
                mainClass:
                    "mfp-no-margins mfp-with-zoom mfp-no-bg mfp-home-ads", // class to remove default margin from left and right side
                gallery: {
                    enabled: true,
                    navigateByImgClick: true,
                    preload: [0, 1], // Will preload 0 - before current, and 1 after the current image
                },
                image: {
                    verticalFit: true,
                },
                zoom: {
                    enabled: true,
                    duration: 300, // don't foget to change the duration also in CSS
                },
                callbacks: {
                    updateStatus: function(data) {
                        if (data.status === "error") {
                            $.magnificPopup.close();
                        }
                    },
                },
            });
        });
    }

    $("#home_ads").trigger("click");
}

var ellipsisMe = function(selector) {
    $(selector).ellipsis();
};

var activeRightBarItem = function() {
    $("#nav_box>ul>li>a.sidebar-link").each(function() {
        $(this).removeClass("active-link");
        var section = $($.attr(this, "href"));
        var top = section.offset().top;
        var bottom = section.offset().top + section.height();
        if (
            section.offset() !== undefined &&
            window.scrollY + 72 >= top &&
            window.scrollY + 72 < bottom
        ) {
            $(this).addClass("active-link");
        }
    });
};

var InitWOW = function() {
    // ***********************
    // :: 11.0 WOW Active Code
    // ***********************
    if ($(window).width() > 767) {
        new WOW().init();
    }
};

function scrollTop(dest_section, minusVal) {
    if (minusVal == undefined) minusVal = 70;
    $("html, body").animate(
        {
            scrollTop: $(dest_section).offset().top - minusVal,
        },
        500,
        function() {
            $("html, body").stop(true, true);
        }
    );
}

function onClose() {
    $(".menu").removeClass("show");
}

function onSetClass(color) {
    if (color == "dark") $("#ftco-navbar").addClass("color-dark");
    else $("#ftco-navbar").removeClass("color-dark");
}

var initContactSlider = function() {
    $(".contact-slide").owlCarousel({
        items: 3,
        autoplay: true,
        loop: true,
        smartSpeed: 1200,
        dots: false,
        nav: true,
        margin: 20,
        autoplayHoverPause: true,
        navText: [
            '<span class="ion-ios-arrow-back">',
            '<span class="ion-ios-arrow-forward">',
        ],
        responsive: {
            0: { items: 1 },
            768: { items: 3 },
            1280: { items: 4 },
        },
    });
};

var initInfoSlider = function() {
    $(".slide-one-item").owlCarousel({
        // center: false,
        // items: 1,
        // loop: true,
        // stagePadding: 0,
        // smartSpeed: 1000,
        // margin: 0,
        // autoplay: true,
        // pauseOnHover: true,
        // nav: true,
        items: 1,
        margin: 0,
        smartSpeed: 1000,
        rewind: true,
        nav: true,
        autoplay: true,
        autoplayHoverPause: true,
        navText: [
            '<span class="icon-keyboard_arrow_left">',
            '<span class="icon-keyboard_arrow_right">',
        ],
        responsive: {
            0: {
                items: 1,
            },
            400: {
                items: 2,
            },
            800: {
                items: 3,
            },
            1000: {
                items: 4,
            },
        },
    });
};

var refreshInfoSlider = function() {
    if ($(".slide-one-item").length) {
        $(".slide-one-item").owlCarousel("refresh");
    }
};

var initAgencySingleSlider = function() {
    if ($(".agency-slider").length) {
        var loop = $(".agency-slider").find(".item").length > 1 ? true : false;
        $(".agency-slider").owlCarousel({
            items: 1,
            autoplay: true,
            loop: loop,
            autoplayHoverPause: false,
            smartSpeed: 1000,
            mouseDrag: false,
            dots: true,
            nav: true,
            navText: [
                '<span class="ion-ios-arrow-back">',
                '<span class="ion-ios-arrow-forward">',
            ],
            margin: 0,
            stagePadding: 0,
            responsive: {
                0: {
                    items: 1,
                },
                600: {
                    items: 2,
                },
                800: {
                    items: 3,
                },
                1000: {
                    items: 4,
                },
            },
        });
    }
};

var refreshAgencySingleSlider = function() {
    if ($(".agency-slider").length) {
        $(".agency-slider").owlCarousel("refresh");
    }
};

// Added by RCG start
var initClientSlider = function() {
    if ($(".client-slider").length) {
        var loop =
            $(".client-slider").find(".post-thumbnail").length > 1
                ? true
                : false;
        var single_event_slider = $(".client-slider");
        single_event_slider.owlCarousel({
            // animateOut: 'fadeOut',
            // animateIn: 'fadeIn',
            items: 1,
            autoplay: true,
            loop: loop,
            autoplayHoverPause: true,
            mouseDrag: false,
            dots: true,
            nav: true,
            navText: [
                '<span class="ion-ios-arrow-back">',
                '<span class="ion-ios-arrow-forward">',
            ],
            margin: 0,
            stagePadding: 0,
        });
    }
};
//Added by RCG end

var contentWayPoint = function() {
    var i = 0;
    $(".ftco-animate").waypoint(
        function(direction) {
            if (
                direction === "down" &&
                !$(this.element).hasClass("ftco-animated")
            ) {
                i++;

                $(this.element).addClass("item-animate");
                setTimeout(function() {
                    $("body .ftco-animate.item-animate").each(function(k) {
                        var el = $(this);
                        setTimeout(
                            function() {
                                var effect = el.data("animate-effect");
                                if (effect === "fadeIn") {
                                    el.addClass("fadeIn ftco-animated");
                                } else if (effect === "fadeInLeft") {
                                    el.addClass("fadeInLeft ftco-animated");
                                } else if (effect === "fadeInRight") {
                                    el.addClass("fadeInRight ftco-animated");
                                } else {
                                    el.addClass("fadeInUp ftco-animated");
                                }
                                el.removeClass("item-animate");
                            },
                            k * 50,
                            "easeInOutExpo"
                        );
                    });
                }, 100);
            }
        },
        { offset: "95%" }
    );
};

var image = function() {
    $(".image-popup").magnificPopup({
        type: "image",
        closeOnContentClick: true,
        // closeBtnInside: false,
        fixedContentPos: true,
        mainClass: "mfp-no-margins mfp-with-zoom mfp-no-bg", // class to remove default margin from left and right side
        gallery: {
            enabled: true,
            navigateByImgClick: true,
            preload: [0, 1], // Will preload 0 - before current, and 1 after the current image
        },
        image: {
            verticalFit: true,
        },
        zoom: {
            enabled: true,
            duration: 300, // don't foget to change the duration also in CSS
        },
    });
};

function playVideo() {
    $(".play-video").magnificPopup({
        disableOn: 600,
        type: "iframe",
        removalDelay: 160,
        preloader: false,
        fixedContentPos: false,
    });
}

function articleGallery() {
    var $lightboxGalleryEl = $('[data-lightbox="gallery"]');

    if ($lightboxGalleryEl.length > 0) {
        $lightboxGalleryEl.each(function() {
            var element = $(this);

            if (
                element
                    .find('a[data-lightbox="gallery-item"]')
                    .parent(".clone")
                    .hasClass("clone")
            ) {
                element
                    .find('a[data-lightbox="gallery-item"]')
                    .parent(".clone")
                    .find('a[data-lightbox="gallery-item"]')
                    .attr("data-lightbox", "");
            }

            if (
                element
                    .find('a[data-lightbox="gallery-item"]')
                    .parents(".cloned")
                    .hasClass("cloned")
            ) {
                element
                    .find('a[data-lightbox="gallery-item"]')
                    .parents(".cloned")
                    .find('a[data-lightbox="gallery-item"]')
                    .attr("data-lightbox", "");
            }

            element.magnificPopup({
                delegate: 'a[data-lightbox="gallery-item"]',
                type: "image",
                closeOnContentClick: true,
                // closeBtnInside: false,
                fixedContentPos: true,
                mainClass: "mfp-no-margins mfp-with-zoom mfp-no-bg", // class to remove default margin from left and right side
                gallery: {
                    enabled: true,
                    navigateByImgClick: true,
                    preload: [0, 1], // Will preload 0 - before current, and 1 after the current image
                },
                image: {
                    verticalFit: true,
                },
                zoom: {
                    enabled: true,
                    duration: 300, // don't foget to change the duration also in CSS
                },
            });
        });
    }
}
// magnific popup

function gallery() {
    var $lightboxGalleryEl = $('[data-lightbox="gallery"]');

    if ($lightboxGalleryEl.length > 0) {
        $lightboxGalleryEl.each(function() {
            var element = $(this);

            if (
                element
                    .find('a[data-lightbox="gallery-item"]')
                    .parent(".clone")
                    .hasClass("clone")
            ) {
                element
                    .find('a[data-lightbox="gallery-item"]')
                    .parent(".clone")
                    .find('a[data-lightbox="gallery-item"]')
                    .attr("data-lightbox", "");
            }

            if (
                element
                    .find('a[data-lightbox="gallery-item"]')
                    .parents(".cloned")
                    .hasClass("cloned")
            ) {
                element
                    .find('a[data-lightbox="gallery-item"]')
                    .parents(".cloned")
                    .find('a[data-lightbox="gallery-item"]')
                    .attr("data-lightbox", "");
            }

            element.magnificPopup({
                delegate: 'a[data-lightbox="gallery-item"]',
                type: "image",
                closeOnContentClick: true,
                closeBtnInside: false,
                fixedContentPos: true,
                mainClass: "mfp-no-margins mfp-fade rev-photos rev-color", // class to remove default margin from left and right side
                image: {
                    verticalFit: true,
                },
                gallery: {
                    enabled: true,
                    navigateByImgClick: true,
                    preload: [0, 1], // Will preload 0 - before current, and 1 after the current image
                },
            });
        });
    }
}

function initArticleSlider() {
    if ($(".slide-serial-item").length) {
        $(".slide-serial-item").owlCarousel({
            center: false,
            items: 1,
            loop: false,
            stagePadding: 0,
            smartSpeed: 1000,
            margin: 0,
            autoplay: false,
            pauseOnHover: true,
            mouseDrag: true,
            nav: true,
            navText: [
                '<span class="icon-keyboard_arrow_left">',
                '<span class="icon-keyboard_arrow_right">',
            ],
            responsive: {
                0: {
                    items: 1,
                },
                600: {
                    items: 2,
                },
                1000: {
                    items: 5,
                },
            },
        });
    }
}

function checkSize() {
    var windowWidth = $(window).width();

    if (windowWidth > 1024) {
        $("img").each(function() {
            // In case Desktop
            $(this).attr("src", $(this).attr("data-desktop-image"));
        });
    } else if (windowWidth > 767 && windowWidth < 1025) {
        // In case Tablet
        $("img").each(function() {
            // In case Tablet
            $(this).attr("src", $(this).attr("data-tablet-image"));
        });
    } else {
        // In case Mobile
        $("img").each(function() {
            $(this).attr("src", $(this).attr("data-mobile-image"));
        });
    }
}

function menuShowCheck() {
    var windoWidth = window.innerWidth;
    if (windoWidth <= 1251) {
        $("#ftco-navbar")
            .removeClass("breakpoint-off")
            .addClass("breakpoint-on");
    } else {
        $("#ftco-navbar")
            .removeClass("breakpoint-on")
            .addClass("breakpoint-off");
    }
}

function initStellar() {
    $(window).stellar({
        responsive: true,
        parallaxBackgrounds: true,
        parallaxElements: true,
        horizontalScrolling: false,
        hideDistantElements: false,
        scrollProperty: "scroll",
    });
}

function destroyStellar() {
    $(window).stellar("destroy");
}

$(window).on("resize", function() {
    menuShowCheck();
});

(function($) {
    "use strict";

    function binarySearch(length, func) {
        var low = 0;
        var high = length - 1;
        var best = -1;
        var mid;

        while (low <= high) {
            mid = ~~((low + high) / 2); //~~ is a fast way to convert something to an int
            var result = func(mid);
            if (result < 0) {
                high = mid - 1;
            } else if (result > 0) {
                low = mid + 1;
            } else {
                best = mid;
                low = mid + 1;
            }
        }

        return best;
    }

    $.fn.ellipsis = function() {
        return this.each(function() {
            var el = $(this);
            if (el.css("overflow") == "hidden") {
                // var content = el.html();
                var content = el.attr("caption");
                if (content === undefined) return;
                el.html(content);
                content = content.replace(/&nbsp;/g, "");
                var multiline = el.hasClass("multiline");
                var tempElement = $(this.cloneNode(true))
                    .hide()
                    .css("position", "absolute")
                    .css("overflow", "visible")
                    .width(multiline ? el.width() : "auto")
                    .height(multiline ? "auto" : el.height());
                el.after(tempElement);

                var tooTallFunc = function() {
                    return tempElement.height() > el.height();
                };

                var tooWideFunc = function() {
                    return tempElement.width() > el.width();
                };

                var tooLongFunc = multiline ? tooTallFunc : tooWideFunc;

                if (tooLongFunc()) {
                    var originalContent = content;

                    var createContentFunc = function(i) {
                        content = originalContent.substr(0, i);
                        tempElement.html(content + "…");
                    };

                    var searchFunc = function(i) {
                        createContentFunc(i);
                        if (tooLongFunc()) {
                            return -1;
                        }
                        return 0;
                    };

                    var len = binarySearch(content.length - 1, searchFunc);

                    createContentFunc(len);
                    var content = content + "…";

                    // el.html(tempElement.html());

                    var lang = localStorage.getItem("language");
                    lang = lang === undefined || lang === null ? "en" : lang;
                    if (lang === "kp") {
                        var reg = new RegExp(/<nobr>위(.*)…/);
                        var match = reg.exec(content);
                        if (
                            match !== null &&
                            match[0].length <
                                (match[0].split("<nobr>위").length > 2
                                    ? 160
                                    : match[0].split("<nobr>").length > 3
                                    ? 90
                                    : 50)
                        ) {
                            content = content.replace(match[0], "…");
                        }

                        reg = new RegExp(/<nobr>경(.*)…/);
                        match = reg.exec(content);
                        if (match !== null && match[0].length < 100) {
                            content = content.replace(match[0], "…");
                        }

                        reg = new RegExp(/<nobr>최(.*)…/);
                        match = reg.exec(content);
                        if (match !== null && match[0].length < 80) {
                            content = content.replace(match[0], "…");
                        }

                        reg = new RegExp(/<nobr>어(.*)…/);
                        match = reg.exec(content);
                        if (match !== null && match[0].length < 24) {
                            content = content.replace(match[0], "…");
                        }

                        reg = new RegExp(/<nobr>아(.*)…/);
                        match = reg.exec(content);
                        if (match !== null && match[0].length < 24) {
                            content = content.replace(match[0], "…");
                        }

                        reg = new RegExp(/<b>김(.*)…/);
                        match = reg.exec(content);
                        if (
                            match !== null &&
                            match[0].length <
                                (match[0].split("<b>김").length > 2 ? 160 : 34)
                        ) {
                            content = content.replace(match[0], "…");
                        }
                    } else if (lang === "cn" || lang === "jp") {
                        var reg = new RegExp(/<nobr><b>金(.*)…/);
                        var match = reg.exec(content);
                        if (
                            match !== null &&
                            match[0].length <
                                (match[0].split("<b>金").length > 2 ? 80 : 34)
                        ) {
                            content = content.replace(match[0], "…");
                        }
                    } else if (lang === "en") {
                        var reg = new RegExp(/<nobr><b>K(.*)…/);
                        var match = reg.exec(content);
                        if (
                            match !== null &&
                            match[0].length <
                                (match[0].split("<b>K").length > 2 ? 80 : 38)
                        ) {
                            content = content.replace(match[0], "…");
                        }
                    } else if (lang === "ru") {
                        var reg = new RegExp(/<nobr><b>Ки(.*)…/);
                        var match = reg.exec(content);
                        if (
                            match !== null &&
                            match[0].length <
                                (match[0].split("<b>Ки").length > 2 ? 85 : 40)
                        ) {
                            content = content.replace(match[0], "…");
                        }
                    }

                    el.html(content);
                }

                tempElement.remove();
            }
        });
    };

    var fullHeight = function() {
        $(".js-fullheight").css("height", $(window).height());
        $(window).resize(function() {
            $(".js-fullheight").css("height", $(window).height());
        });
    };
    fullHeight();
    // loader
    var loader = function() {
        setTimeout(function() {
            if ($("#ftco-loader").length > 0) {
                $("#ftco-loader").removeClass("show");
            }
        }, 1);
    };
    loader();

    // Burger Menu
    var burgerMenu = function() {
        $("body").on("click", ".js-fh5co-nav-toggle", function(event) {
            event.preventDefault();

            if ($("#ftco-nav").is(":visible")) {
                $(this).removeClass("active");
            } else {
                $(this).addClass("active");
            }
            $(".menu").addClass("show");
        });
    };
    burgerMenu();

    var onePageClick = function() {
        $(document).on("click", '#nav_box a[href^="#"]', function(event) {
            var href = $.attr(this, "href");

            $("html, body").animate(
                {
                    scrollTop: $($.attr(this, "href")).offset().top - 70,
                },
                500,
                function() {}
            );
        });

        $(document).on("click", '#appBarTabs a[href^="#"]', function(event) {
            var href = $.attr(this, "href");

            $("html, body").animate(
                {
                    scrollTop: $($.attr(this, "href")).offset().top - 70,
                },
                500,
                function() {}
            );
        });
    };
    onePageClick();

    $("nav .dropdown").hover(
        function() {
            var $this = $(this);

            $this.addClass("show");
            $this.find("> a").attr("aria-expanded", true);
            $this.find(".dropdown-menu").addClass("show");
        },
        function() {
            var $this = $(this);

            $this.removeClass("show");
            $this.find("> a").attr("aria-expanded", false);
            $this.find(".dropdown-menu").removeClass("show");
        }
    );

    var scrollWindow = function() {
        $(window).scroll(function() {
            var $w = $(this),
                st = $w.scrollTop(),
                navbar = $(".ftco_navbar"),
                sd = $(".js-scroll-wrap");

            if (st > 150) {
                if (!navbar.hasClass("scrolled")) {
                    navbar.addClass("scrolled");
                }
            }
            if (st < 150) {
                if (navbar.hasClass("scrolled")) {
                    navbar.removeClass("scrolled sleep");
                }
            }
            if (st > 100) {
                if (!navbar.hasClass("awake")) {
                    navbar.addClass("awake");
                }

                if (sd.length > 0) {
                    sd.addClass("sleep");
                }
            }
            if (st < 100) {
                if (navbar.hasClass("awake")) {
                    navbar.removeClass("awake");
                    navbar.addClass("sleep");
                }
                if (sd.length > 0) {
                    sd.removeClass("sleep");
                }
            }
        });
    };
    scrollWindow();

    var counter = function() {
        $("#section-counter, .hero-wrap, .ftco-counter").waypoint(
            function(direction) {
                if (
                    direction === "down" &&
                    !$(this.element).hasClass("ftco-animated")
                ) {
                    var comma_separator_number_step = $.animateNumber.numberStepFactories.separator(
                        ","
                    );
                    $(".number").each(function() {
                        var $this = $(this),
                            num = $this.data("number");
                        console.log(num);
                        $this.animateNumber(
                            {
                                number: num,
                                numberStep: comma_separator_number_step,
                            },
                            7000
                        );
                    });
                }
            },
            { offset: "95%" }
        );
    };
})(jQuery);
