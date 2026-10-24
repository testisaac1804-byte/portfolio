(function($) {
  ("use strict");

  $(".fancybox").fancybox({
    helpers: {
      title: null,
      overlay: {
        css: {
          background: "rgba(0,0,0,0.5)"
        }
      }
    }
  });

  // ______________ Modal
  $("#myModal").modal("show");

  /*---Owl-carousel----*/

  // ______________Owl-carousel-icons
  var owl = $(".owl-carousel-icons");
  owl.owlCarousel({
    margin: 25,
    loop: true,
    nav: true,
    autoplay: true,
    autoplayTimeout: 3000,
    dots: false,
    responsive: {
      0: {
        items: 1
      },
      600: {
        items: 2
      },
      1300: {
        items: 3
      }
    }
  });

  // ______________Owl-carousel-icons2
  var owl = $(".owl-carousel-icons2");
  var item_count = $("#carousel2_item_count").val();
  owl.owlCarousel({
    rewind: false,
    margin: 25,
    animateIn: "fadeInDowm",
    animateOut: "fadeOutDown",
    autoplay: true,
    autoplayTimeout: 5000, // set value to change speed
    autoplayHoverPause: true,
    dots: false,
    nav: true,
    responsiveClass: true,
    responsive: {
      0: {
        items: 1,
        nav: true,
        loop: item_count <= 1 ? false : true
      },
      600: {
        items: 2,
        nav: true,
        loop: item_count <= 2 ? false : true
      },
      1300: {
        items: 4,
        nav: true,
        loop: item_count <= 4 ? false : true
      }
      // 1900: {
      //     items: 8,
      //     nav: true
      // }
    }
  });

  // ______________Owl-carousel-icons21
  var owl = $(".owl-carousel-icons21");
  var item_count = $("#carousel21_item_count").val();
  owl.owlCarousel({
    rewind: false,
    margin: 25,
    animateIn: "fadeInDowm",
    animateOut: "fadeOutDown",
    autoplay: true,
    autoplayTimeout: 5000, // set value to change speed
    autoplayHoverPause: true,
    dots: false,
    nav: true,
    responsiveClass: true,
    responsive: {
      0: {
        items: 1,
        nav: true,
        loop: item_count <= 1 ? false : true
      },
      600: {
        items: 2,
        nav: true,
        loop: item_count <= 2 ? false : true
      },
      1300: {
        items: 4,
        nav: true,
        loop: item_count <= 4 ? false : true
      }
      // 1900: {
      //     items: 8,
      //     nav: true
      // }
    }
  });

  // ______________Owl-carousel-icons22
  var owl = $(".owl-carousel-icons22");
  var item_count = $("#carousel22_item_count").val();
  owl.owlCarousel({
    rewind: false,
    margin: 25,
    animateIn: "fadeInDowm",
    animateOut: "fadeOutDown",
    autoplay: true,
    autoplayTimeout: 5000, // set value to change speed
    autoplayHoverPause: true,
    dots: false,
    nav: true,
    responsiveClass: true,
    responsive: {
      0: {
        items: 1,
        nav: true,
        loop: item_count <= 1 ? false : true
      },
      600: {
        items: 2,
        nav: true,
        loop: item_count <= 2 ? false : true
      },
      1300: {
        items: 4,
        nav: true,
        loop: item_count <= 4 ? false : true
      }
      // 1900: {
      //     items: 8,
      //     nav: true
      // }
    }
  });

  // ______________Owl-carousel-icons23
  var owl = $(".owl-carousel-icons23");
  var item_count = $("#carousel23_item_count").val();
  owl.owlCarousel({
    rewind: false,
    margin: 25,
    animateIn: "fadeInDowm",
    animateOut: "fadeOutDown",
    autoplay: true,
    autoplayTimeout: 5000, // set value to change speed
    autoplayHoverPause: true,
    dots: false,
    nav: true,
    responsiveClass: true,
    responsive: {
      0: {
        items: 1,
        nav: true,
        loop: item_count <= 1 ? false : true
      },
      600: {
        items: 2,
        nav: true,
        loop: item_count <= 2 ? false : true
      },
      1300: {
        items: 4,
        nav: true,
        loop: item_count <= 4 ? false : true
      }
      // 1900: {
      //     items: 8,
      //     nav: true
      // }
    }
  });

  // ______________Owl-carousel-icons22
  var owl = $(".owl-carousel-icons24");
  var item_count = $("#carousel24_item_count").val();
  owl.owlCarousel({
    rewind: false,
    margin: 100,
    animateIn: "fadeInDowm",
    animateOut: "fadeOutDown",
    autoplay: false,
    dots: false,
    nav: true,
    responsiveClass: true,
    responsive: {
      0: {
        items: 1,
        nav: true,
        loop: true
      },
      600: {
        items: 1,
        nav: true,
        loop: true
      },
      1300: {
        items: 1,
        nav: true,
        loop: true
      }
      // 1900: {
      //     items: 8,
      //     nav: true
      // }
    }
  });
  // ______________Owl-carousel-icons26
  var owl = $(".owl-carousel-icons26");
  var item_count = $("#carousel24_item_count").val();
  owl.owlCarousel({
    rewind: false,
    margin: 10,
    animateIn: "fadeInDowm",
    animateOut: "fadeOutDown",
    autoplay: true,
    autoplayTimeout: 5000, // set value to change speed
    dots: false,
    nav: true,
    responsiveClass: true,
    responsive: {
      0: {
        items: 1,
        nav: true,
        loop: true
      },
      600: {
        items: 2,
        nav: true,
        loop: true
      },
      1300: {
        items: 2,
        nav: true,
        loop: true
      }
      // 1900: {
      //     items: 3,
      //     nav: true
      // }
    }
  });
  // ______________Owl-carousel-icons3
  var owl = $(".owl-carousel-icons3");
  owl.owlCarousel({
    margin: 25,
    loop: true,
    nav: false,
    dots: false,
    autoplay: true,
    responsive: {
      0: {
        items: 1
      },
      600: {
        items: 2
      },
      1000: {
        items: 2
      }
    }
  });

  // ______________Owl-carousel-icons4
  var owl = $(".owl-carousel-icons4");
  owl.owlCarousel({
    margin: 15,
    loop: true,
    nav: false,
    dots: false,
    autoplay: true,
    responsive: {
      0: {
        items: 1
      },
      600: {
        items: 3
      },
      1000: {
        items: 6
      }
    }
  });

  // ______________Owl-carousel-icons5
  var owl = $(".owl-carousel-icons5");
  owl.owlCarousel({
    loop: true,
    rewind: false,
    margin: 25,
    animateIn: "fadeInDowm",
    animateOut: "fadeOutDown",
    autoplay: false,
    autoplayTimeout: 5000, // set value to change speed
    autoplayHoverPause: true,
    dots: true,
    nav: false,
    autoplay: true,
    responsiveClass: true,
    responsive: {
      0: {
        items: 1,
        nav: true
      },
      600: {
        items: 2,
        nav: true
      },
      1300: {
        items: 4,
        nav: true
      },
      1900: {
        items: 8,
        nav: true
      },
      2600: {
        items: 16,
        nav: true
      }
    }
  });

  // ______________Owl-carousel-icons6
  var owl = $(".owl-carousel-icons6");
  var carousel6_item_count = $("#carousel6_item_count").val();
  owl.owlCarousel({
    margin: 25,
    nav: false,
    dots: false,
    autoplay: true,
    responsive: {
      0: {
        items: 1,
        loop: carousel6_item_count <= 1 ? false : true
      },
      200: {
        items: 2,
        loop: carousel6_item_count <= 2 ? false : true
      },
      400: {
        items: 3,
        loop: carousel6_item_count <= 3 ? false : true
      },
      600: {
        items: 4,
        loop: carousel6_item_count <= 4 ? false : true
      },
      800: {
        items: 5,
        loop: carousel6_item_count <= 5 ? false : true
      },
      1000: {
        items: 6,
        loop: carousel6_item_count <= 6 ? false : true
      }
    }
  });

  // ______________Testimonial-owl-carousel2
  var owl = $(".testimonial-owl-carousel2");
  owl.owlCarousel({
    margin: 25,
    loop: true,
    nav: false,
    autoplay: true,
    dots: false,
    animateOut: "fadeOut",
    smartSpeed: 450,
    responsive: {
      0: {
        items: 1
      }
    }
  });

  // ______________Testimonial-owl-carousel3
  var owl = $(".testimonial-owl-carousel3");
  owl.owlCarousel({
    margin: 25,
    loop: true,
    nav: false,
    autoplay: true,
    dots: true,
    responsive: {
      0: {
        items: 1
      }
    }
  });

  // ______________Testimonial-owl-carousel4
  var owl = $(".testimonial-owl-carousel4");
  owl.owlCarousel({
    margin: 25,
    loop: true,
    nav: false,
    autoplay: true,
    dots: true,
    responsive: {
      0: {
        items: 1
      }
    }
  });

  // ______________Testimonial-owl-carousel
  var owl = $(".testimonial-owl-carousel");
  owl.owlCarousel({
    loop: true,
    rewind: false,
    margin: 25,
    autoplay: true,
    animateIn: "fadeInDowm",
    animateOut: "fadeOutDown",
    autoplay: false,
    autoplayTimeout: 5000, // set value to change speed
    autoplayHoverPause: true,
    dots: false,
    nav: true,
    responsiveClass: true,
    responsive: {
      0: {
        items: 1,
        nav: true
      }
    }
  });

  // ______________Owl-carousel-icons_8
  var owl = $(".owl-carousel-icons_8");
  var carousel8_item_count = owl.attr('data-items');
  owl.owlCarousel({
    margin: 5,
    nav: false,
    dots: false,
    autoplay: true,
    autoplayTimeout: 3000,
    autoplayHoverPause: true,
    responsive: {
      0: {
        items: 1,
        loop: carousel8_item_count <= 1 ? false : true
      },
      200: {
        items: 2,
        loop: carousel8_item_count <= 2 ? false : true
      },
      600: {
        items: 4,
        loop: carousel8_item_count <= 4 ? false : true
      },
      800: {
        items: 5,
        loop: carousel8_item_count <= 5 ? false : true
      },
      1000: {
        items: 6,
        loop: carousel8_item_count <= 6 ? false : true
      },
      1300: {
        items: 8,
        loop: carousel8_item_count <= 8 ? false : true
      }
    }
  });
  if(carousel8_item_count<=8) owl.find('button').remove();

  // ______________Owl-carousel-icons2_8
  var owl = $(".owl-carousel-icons2_8");
  var carousel8_item_count = owl.attr('data-items');
  owl.owlCarousel({
    margin: 5,
    nav: false,
    dots: false,
    autoplay: true,
    autoplayTimeout: 3500,
    autoplayHoverPause: true,
    responsive: {
      0: {
        items: 1,
        loop: carousel8_item_count <= 1 ? false : true
      },
      200: {
        items: 2,
        loop: carousel8_item_count <= 2 ? false : true
      },
      600: {
        items: 4,
        loop: carousel8_item_count <= 4 ? false : true
      },
      800: {
        items: 5,
        loop: carousel8_item_count <= 5 ? false : true
      },
      1000: {
        items: 6,
        loop: carousel8_item_count <= 6 ? false : true
      },
      1300: {
        items: 8,
        loop: carousel8_item_count <= 8 ? false : true
      }
    }
  });
  if(carousel8_item_count<=8) owl.find('button').remove();

	var owl = $(".owl-carousel-icons3_6");
  var carousel6_item_count = $("#carousel6_item_count").val();
  owl.owlCarousel({
    margin: 5,
    nav: false,
    dots: false,
    autoplay: true,
    autoplayTimeout: 3500,
    autoplayHoverPause:true,
    responsive: {
      0: {
        items: 1,
        loop: carousel6_item_count <= 1 ? false : true
      },
      200: {
        items: 2,
        loop: carousel6_item_count <= 2 ? false : true
      },
      600: {
        items: 3,
        loop: carousel6_item_count <= 3 ? false : true
      },
      800: {
        items: 4,
        loop: carousel6_item_count <= 4 ? false : true
      },
      1000: {
        items: 5,
        loop: carousel6_item_count <= 5 ? false : true
      },
      1300: {
        items: 6,
        loop: carousel6_item_count <= 6 ? false : true
      }
    }
  });
	var owl = $(".owl-carousel-icons4_6");
  var carousel6_item_count = $("#carousel6_item_count").val();
  owl.owlCarousel({
    margin: 5,
    nav: false,
    dots: false,
    autoplay: true,
    autoplayTimeout: 2800,
    autoplayHoverPause:true,
    responsive: {
      0: {
        items: 1,
        loop: carousel6_item_count <= 1 ? false : true
      },
      200: {
        items: 2,
        loop: carousel6_item_count <= 2 ? false : true
      },
      600: {
        items: 3,
        loop: carousel6_item_count <= 3 ? false : true
      },
      800: {
        items: 4,
        loop: carousel6_item_count <= 4 ? false : true
      },
      1000: {
        items: 5,
        loop: carousel6_item_count <= 5 ? false : true
      },
      1300: {
        items: 6,
        loop: carousel6_item_count <= 6 ? false : true
      }
    }
  });
  var owl = $(".owl-carousel-icons2_6");
  var carousel6_item_count = $("#carousel6_item_count").val();
  owl.owlCarousel({
    margin: 5,
    nav: false,
    dots: false,
    autoplay: true,
    autoplayTimeout: 3000,
    responsive: {
      0: {
        items: 1,
        loop: carousel6_item_count <= 1 ? false : true
      },
      200: {
        items: 2,
        loop: carousel6_item_count <= 2 ? false : true
      },
      600: {
        items: 3,
        loop: carousel6_item_count <= 3 ? false : true
      },
      800: {
        items: 4,
        loop: carousel6_item_count <= 4 ? false : true
      },
      1000: {
        items: 5,
        loop: carousel6_item_count <= 5 ? false : true
      },
      1300: {
        items: 6,
        loop: carousel6_item_count <= 6 ? false : true
      }
    }
  });



  /*---End Owl-carousel----*/

  // ______________Cover Image
  $(".cover-image").each(function() {
    var attr = $(this).attr("data-image-src");
    if (typeof attr !== typeof undefined && attr !== false) {
      $(this).css("background", "url(" + attr + ") center center");
    }
  });

  // ______________Loader
  $(window).on("load", function(e) {
    $("#loading").fadeOut("slow");
  });

  // ______________Active Class
  $(document).ready(function() {
    $(".horizontalMenu-list li a").each(function() {
      var pageUrl = window.location.href.split(/[?#]/)[0];
      if (this.href == pageUrl) {
        $(this).addClass("active");
        $(this)
          .parent()
          .addClass("active"); // add active to li of the current link
        $(this)
          .parent()
          .parent()
          .prev()
          .addClass("active"); // add active class to an anchor
        $(this)
          .parent()
          .parent()
          .prev()
          .click(); // click the item to make it drop
      }
    });
  });

  // ______________ Back to Top
  $(window).on("scroll", function(e) {
    if ($(this).scrollTop() > 0) {
      $("#back-to-top").fadeIn("slow");
    } else {
      $("#back-to-top").fadeOut("slow");
    }
  });
  $("#back-to-top").on("click", function(e) {
    $("html, body").animate(
      {
        scrollTop: 0
      },
      600
    );
    return false;
  });

  // ______________Rating Stars
  var ratingOptions = {
    selectors: {
      starsSelector: ".rating-stars",
      starSelector: ".rating-star",
      starActiveClass: "is--active",
      starHoverClass: "is--hover",
      starNoHoverClass: "is--no-hover",
      targetFormElementSelector: ".rating-value"
    }
  };
  $(".rating-stars").ratingStars(ratingOptions);

  // ______________Quantity-right-plus
  var quantitiy = 0;
  $(".quantity-right-plus").on("click", function(e) {
    e.preventDefault();
    var quantity = parseInt($("#quantity").val());
    $("#quantity").val(quantity + 1);
  });
  $(".quantity-left-minus").on("click", function(e) {
    e.preventDefault();
    var quantity = parseInt($("#quantity").val());
    if (quantity > 0) {
      $("#quantity").val(quantity - 1);
    }
  });

  // ______________mCustomScrollbar
  $(".vscroll").mCustomScrollbar();
  $(".nav-sidebar").mCustomScrollbar({
    theme: "minimal",
    autoHideScrollbar: true,
    scrollbarPosition: "outside"
  });

  // ______________Chart-circle
  if ($(".chart-circle").length) {
    $(".chart-circle").each(function() {
      $this = $(this);
      $this.circleProgress({
        fill: {
          color: $this.attr("data-color")
        },
        size: $this.height(),
        startAngle: (-Math.PI / 4) * 2,
        emptyFill: "#f9faff",
        lineCap: ""
      });
    });
  }
  const DIV_CARD = "div.card";
  // ______________Tooltip
  $('[data-toggle="tooltip"]').tooltip();

  // ______________Popover
  $('[data-toggle="popover"]').popover({
    html: true
  });

  // ______________Card Remove
  $('[data-toggle="card-remove"]').on("click", function(e) {
    $card = $(this).closest(DIV_CARD);
    $card.remove();
    e.preventDefault();
    return false;
  });

  // ______________Card Collapse
  $('[data-toggle="card-collapse"]').on("click", function(e) {
    $card = $(this).closest(DIV_CARD);
    $card.toggleClass("card-collapsed");
    e.preventDefault();
    return false;
  });

  // ______________Card Full Screen
  $('[data-toggle="card-fullscreen"]').on("click", function(e) {
    $card = $(this).closest(DIV_CARD);
    $card.toggleClass("card-fullscreen").removeClass("card-collapsed");
    e.preventDefault();
    return false;
  });
})(jQuery);

function setLanguage(kind) {
  var language = "korean";
  switch (kind) {
    case 1:
      language = "korean";
      break;
    case 2:
      language = "english";
      break;
    case 3:
      language = "chinese";
      break;
    case 4:
      language = "russian";
      break;
    default:
      language = "korean";
      break;
  }
  var url = $("#url").val();
  url = site_url("index.php/home/setLanguage?language=") + language;
  location.href = url;
}

function setLanguage_url(kind, cur_url) {
  var language = "korean";
  switch (kind) {
    case 1:
      language = "korean";
      break;
    case 2:
      language = "english";
      break;
    case 3:
      language = "chinese";
      break;
    case 4:
      language = "russian";
      break;
    default:
      language = "korean";
      break;
  }
  var url = $("#url").val();
  url = site_url(
    "index.php/home/setLanguage_url?language=" +
      language +
      "&cur_url=" +
      cur_url
  );
  location.href = url;
}

// function my_round(number, precision) {
// 	var factor = Math.pow(10, precision);
// 	var tempNumber = number * factor;
// 	var roundedTempNumber = Math.round(tempNumber);
// 	return roundedTempNumber / factor;
//   }
