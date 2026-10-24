/********************************************
* File Name: first.js
* Author:
* Created Date:
* Version: 1.0.0
* Description: Custom Javascript for the Home Page
********************************************/

(function($) {
  function resizeCarousel() {
    //$width = $('body').width();
    //$height = $('body').height();
    //$margintop = ($height - $('#home-banner-fluidwidth').height()) / 2;
    //if ($margintop < 50) $margintop = 50;
    //$('#home-banner-fluidwidth').css('margin-top', $margintop + 'px');

      var $img_height = $("#back_img").height()-3;
      $("#part_1").css('height', $img_height + 'px');
  }

    JH3DCUtils.onReady(function() {
        var $sw = $('body').width();
        var $sh = $('body').height();

        var $base_url = $("#base_url").val();
        var $carouselWidth = 1170;
        var $carouselHeight = 500;
        var $carouselXRadius = 380;
        var $carouselYRadius = 0;
        var $carouselXRotation = 12;
        var $carouselYOffset = 10;
        var $centerImageYOffset = 0;
        var $thumbnailWidth = 340;
        var $thumbnailHeight = 200;
        var $thumbnailRate = 1;
        var $centerImage = "slide-center.png";

        if ($sw > 1800) {
            $carouselWidth = 1170;
            $carouselHeight = 550;
            $carouselXRadius = 380;
            $carouselYRadius = 0;
            $carouselXRotation = 12;
            $carouselYOffset = 60;
            $centerImageYOffset = -200;
            $thumbnailRate = 1.1;
            $centerImage = "slide-center-1800.png"
        } else if ($sw > 1600) {
            $carouselWidth = 1170;
            $carouselHeight = 550;
            $carouselXRadius = 380;
            $carouselYRadius = 0;
            $carouselXRotation = 12;
            $carouselYOffset = 55;
            $centerImageYOffset = -200;
            $thumbnailRate = 1;
            $centerImage = "slide-center-1600.png"
        } else if ($sw > 1400) {
            $carouselWidth = 1170;
            $carouselHeight = 550;
            $carouselXRadius = 380;
            $carouselYRadius = 0;
            $carouselXRotation = 12;
            $carouselYOffset = 55;
            $centerImageYOffset = -200;
            $thumbnailRate = 1;
            $centerImage = "slide-center-1400.png"
        } else if ($sw > 1300) {
            $carouselWidth = 1170;
            $carouselHeight = 500;
            $carouselXRadius = 380;
            $carouselYRadius = 0;
            $carouselXRotation = 12;
            $carouselYOffset = 55;
            $centerImageYOffset = -220;
            $thumbnailRate = 1;
            $centerImage = "slide-center-1400.png"
        } else if ($sw > 1200) {
            $carouselWidth = 1170;
            $carouselHeight = 500;
            $carouselXRadius = 380;
            $carouselYRadius = 0;
            $carouselXRotation = 12;
            $carouselYOffset = 55;
            $centerImageYOffset = -220;
            $thumbnailRate = 1;
            $centerImage = "slide-center-1400.png"
        } else if ($sw > 1000) {
            $carouselWidth = 1170;
            $carouselHeight = 500;
            $carouselXRadius = 380;
            $carouselYRadius = 0;
            $carouselXRotation = 12;
            $carouselYOffset = 55;
            $centerImageYOffset = 0;
            $thumbnailRate = 1;
            $centerImage = "slide-center-1400.png"
        } else if ($sw > 800) {
            $carouselWidth = 1170;
            $carouselHeight = 500;
            $carouselXRadius = 380;
            $carouselYRadius = 0;
            $carouselXRotation = 12;
            $carouselYOffset = 55;
            $centerImageYOffset = 0;
            $thumbnailRate = 1;
            $centerImage = "slide-center-1400.png"
        } else if ($sw > 600) {
            $carouselWidth = 1170;
            $carouselHeight = 550;
            $carouselXRadius = 380;
            $carouselYRadius = 0;
            $carouselXRotation = 12;
            $carouselYOffset = 0;
            $centerImageYOffset = 0;
            $thumbnailRate = 1;
            $centerImage = "slide-center-1400.png"
        } else if ($sw > 400) {
            $carouselWidth = 1170;
            $carouselHeight = 550;
            $carouselXRadius = 380;
            $carouselYRadius = 0;
            $carouselXRotation = 12;
            $carouselYOffset = 0;
            $centerImageYOffset = 0;
            $thumbnailRate = 1;
            $centerImage = "slide-center-1400.png"
        }

        $thumbnailWidth = parseInt($thumbnailWidth * $thumbnailRate);
        $thumbnailHeight = parseInt($thumbnailHeight * $thumbnailRate);

        if ($sw > 600) {
            var carousel3d = JH3DCarousel.init({
                carouselHolderDivId: "home-banner",
                carouselDataListDivId: "carousel-data",
                mainFolderPath: $base_url + "assets/plugins/3d-carousel",
                skinPath: "skins/classic_skin",
                showScrollbar: "no",
                showPrevButton: "no",
                showNextButton: "no",
                showSlideshowButton: "no",
                addKeyboardSupport: "yes",
                autoplay: "yes",
                useDragAndSwipe: "yes",
                carouselWidth: $carouselWidth,
                carouselHeight: $carouselHeight,
                carouselXRadius: $carouselXRadius,
                carouselYRadius: $carouselYRadius,
                carouselXRotation: $carouselXRotation,
                carouselYOffset: $carouselYOffset,
                showCenterImage: 'no',
                //centerImagePath: $base_url + "assets/images/first/" + $centerImage,
                centerImageYOffset: $centerImageYOffset,
                reflectionDistance: 10,
                showText: "no",
                textBackgroundColor: "#000000",
                textBackgroundOpacity: 0.8,
                thumbnailWidth: $thumbnailWidth,
                thumbnailHeight: $thumbnailHeight,
                enableMouseWheelScroll: "yes"
            });
        }
    });

    $(window).resize(function() {
      resizeCarousel();
   });

   $(document).ready(function() {
      //$width = $('body').width();
      //$height = $('body').height();
      //$margintop = ($height - $('#home-banner-fluidwidth').height()) / 2;
      //if ($margintop < 50) $margintop = 50;
      //$('#home-banner-fluidwidth').css('margin-top', $margintop + 'px');

       resizeCarousel();
   });

})(jQuery);
