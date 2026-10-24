var resizeCarouselOnFancybox, initCarouselOnFancybox, updateCarouselOnFancybox, 
	updateCarousel, initCarousel, resizeVideoFancybox, isIE7 = false;
var minDate = '2010.01.01.';
function isMobile() {
  var index = navigator.appVersion.indexOf("Mobile");
  return (index > -1);
}
$(window).load(function() {
	var isTouch	  = document.createTouch !== undefined;
	var fixFooter = function() {
		var bh = 0;
		if (window.innerHeight) {
		     bh = window.innerHeight;
		} else {
		     bh = Math.max(document.documentElement.clientHeight, document.body.clientHeight);
		}
		if ($(".footer-container").length == 0){
			return false;
		}
		if (bh > $(".footer-container").position().top + $(".footer-container").height() + 10) {
			$(".footer-container").addClass("bottom-fixed");
		} else {
			$(".footer-container").removeClass("bottom-fixed");
		}
	}(); 
	
	$(window).resize(fixFooter); 
}); 

$(document).ready(function(){
	$(".scroll-to-top").hide();
	
	// fade in .scroll-to-top
	$(window).scroll(function () {
	    if ($(this).scrollTop() > 90) {
	        $('.scroll-to-top').fadeIn();
	    } else {
	        $('.scroll-to-top').fadeOut();
	    }
	});
	
	// scroll body to 0px on click
	$('.scroll-to-top').click(function () {
	    $('body,html').animate({
	        scrollTop: 0
	    }, 500);
	    return false;
	});
	
	$("a.media_goback").click(function() {
		//window.history.back();
		var referrer;
		if (window.localStorage !== undefined) {
			referrer = window.localStorage.getItem("referrer"); 
		} else if (window.sessionStorage !== undefined) {
			referrer = window.sessionStorage.setItem("referrer"); 
		}
		// referrer = referrer.replace(/\/kp|\/en|\/cn|\/jp|\/es|\/ru/g, "/" + jsLangCode);
		if (referrer == "" || referrer == document.location.href) {
			document.location.href = document.location.protocol + "//" + document.location.host + document.location.pathname.substr(0,3);
		} else {
		   	document.location.href = referrer;
	    } 
	    return false;
	});
	
	$("a.goback").click(function() {
		var referrer;
		if (window.localStorage !== undefined) {
			referrer = window.localStorage.getItem("referrer"); 
		} else if (window.sessionStorage !== undefined) {
			referrer = window.sessionStorage.setItem("referrer"); 
		}
		// referrer = referrer.replace(/\/kp|\/en|\/cn|\/jp|\/es|\/ru/g, "/" + jsLangCode);
		if (referrer == "" || referrer == document.location.href) {
			document.location.href = document.location.protocol + "//" + document.location.host + document.location.pathname.substr(0,3);
		} else {
		   	document.location.href = referrer;
	    } 
	    return false;
    }); 
    $(".drop-list-category i").click(function() {
    	if ($(".mobile-bar .drop-list-category").hasClass("active")) {
    		$(".mobile-bar div").removeClass("active");
	    	$(".mobile-bar .drop-list-category .content").slideUp("2000", function() {
	    		$(".mobile-bar .drop-list-category .content").css("display", "none");
	    	});
	    	return;
    	}
    	$(".mobile-bar .content").css("display", "none");
    	$(".mobile-bar div").removeClass("active");
    	$(".mobile-bar .drop-list-category .content").slideDown("2000", function() {
    		$(".mobile-bar .drop-list-category .content").css("display", "block");
    	});
    	$(".mobile-bar .drop-list-category").addClass("active");
    });
    $(".drop-list-lang i").click(function() {
    	if ($(".mobile-bar .drop-list-lang").hasClass("active")) {
    		$(".mobile-bar div").removeClass("active");
	    	$(".mobile-bar .drop-list-lang .content").slideUp("2000", function() {
	    		$(".mobile-bar .drop-list-lang .content").css("display", "none");
	    	});
	    	return;
    	}
    	$(".mobile-bar .content").css("display", "none");
    	$(".mobile-bar div").removeClass("active");
    	$(".mobile-bar .drop-list-lang .content").slideDown("2000", function() {
    		$(".mobile-bar .drop-list-lang .content").css("display", "block");
    	});
	    $(".mobile-bar .drop-list-lang").addClass("active");
    });
    
    $("input.search-text").focus(function() {
    	$(this).select(); 
    }); 
    $("input.cquery").focus(function() {
    	$(this).select(); 
	});
	
	resizeCarouselOnFancybox = function() {
		// Fit the carousel into the screen
		var innerWidth;
		var innerHeight;
		if (window.innerHeight){
		     innerHeight = window.innerHeight;
		}else{
		     innerHeight = Math.max(document.documentElement.clientHeight, document.body.clientHeight);
		}
		if (window.innerWidth){
		     innerWidth = window.innerWidth;
		}else{
		     innerWidth = Math.max(document.documentElement.clientWidth, document.body.clientWidth);
		}
		var carouselInnerWidth = Math.min(innerWidth - 87 - 2*$('.carousel-control').width() - 6, fancyboxPhotoWidth); 
		var carouselMaxInnerHeight = innerHeight - 70 - 31 - 30 - 37 - 10 - 6; 
		// 6: border size
		// 10: content padding
		// (87,70): fancybox outer border
		// 31: title height
		// 30: carousel caption height 
		// 37: carousel indicators height
		
		if (carouselMaxInnerHeight/carouselInnerWidth  > 450/675) { // Fit the caourel horizentally
			$('.fancybox-container .carousel-inner').width(carouselInnerWidth); 
			$('.fancybox-container .carousel-inner').height(carouselInnerWidth * 450/675);
		} else { // Fit the carousel vertically
			$('.fancybox-container .carousel-inner').height(carouselMaxInnerHeight);
			$('.fancybox-container .carousel-inner').width(carouselMaxInnerHeight * 675/450);
		}
		
		carouselInnerWidth = $('.fancybox-container .carousel-inner').width(); 
		var padding = (carouselInnerWidth*450/675 - 56)/2;
		
		$('.fancybox-container .carousel-control').css({"padding-top": padding, "padding-bottom": padding})
			.innerWidth($('.fancybox-container .carousel-control').width() + carouselInnerWidth/2);  
		$('.fancybox-container .left.carousel-control').css({"padding-right": carouselInnerWidth/2}); 
		$('.fancybox-container .right.carousel-control').css({"padding-left": carouselInnerWidth/2}); 
		// vertical-align the fancybox
		// $('.fancybox-wrap').css({"top": ($('.fancybox-overlay').height() - $('.fancybox-wrap').height())/2});
	}; 
	
    resizeVideoFancybox = function() {
    	if (navigator.userAgent.indexOf("MSIE") > 0 ){
    		return false;
    	}
    	var innerWidth;
		var innerHeight;
		if (window.innerHeight){
		     innerHeight = window.innerHeight;
		}else{
		     innerHeight = Math.max(document.documentElement.clientHeight, document.body.clientHeight);
		}
		if (window.innerWidth){
		     innerWidth = window.innerWidth;
		}else{
		     innerWidth = Math.max(document.documentElement.clientWidth, document.body.clientWidth);
		}
		var videoInnerWidth = Math.min(innerWidth - 87, fancyboxVideoWidth); 
		var videoMaxInnerHeight = innerHeight - 70 - 31 - 41; 
		// (87,70): fancybox outer border
		// 31: title's height
		// 41: desc-wrapper's height
		
		if (videoMaxInnerHeight/videoInnerWidth  > 36/64) { // Fit the video horizentally
			$('.fancybox-container #flashcontent').width(videoInnerWidth); 
			$('.fancybox-container #flashcontent').height(videoInnerWidth * 36/64);
		} else { // Fit the video vertically
			$('.fancybox-container #flashcontent').height(videoMaxInnerHeight);
			$('.fancybox-container #flashcontent').width(videoMaxInnerHeight * 64/36);
		} 
		// vertical-align the fancybox
		// $('.fancybox-wrap').css({"top": ($('.fancybox-overlay').height() - $('.fancybox-wrap').height())/2});
    }
	
	initCarouselOnFancybox = function() {
		resizeCarouselOnFancybox(); 
		
		$('.carousel-inner .item').each(function(index, item) {
			var img = $('<img/>').load(function() {
        		updateCarouselOnFancybox(this, item);
        		$(item).append($(this)); 
			}).error(function() {
			}).attr("src", $(item).attr("data-src")).attr("alt", $(item).attr("data-alt")); 
		}); 
	}; 
	
	// Update carousel when resizing the screen Or changing the orientation on the mobile.
	updateCarouselOnFancybox = function(_img, _item) {
		var padding = 0, carouselInnerWidth = $('.carousel-inner').width(); 		
		var imgWidth, imgHeight; 
		var minSize = 1;
		if (_img != undefined) {
			imgWidth = _img.width; 
    		imgHeight = _img.height; 
    		if (imgWidth == 0 && $(_img).attr("width") != 0) imgWidth = $(_img).attr("width"); 
    		if (imgHeight == 0 && $(_img).attr("height") != 0) imgHeight = $(_img).attr("height"); 
			if (imgHeight*675 < imgWidth*450) { // Wide
    			padding = (carouselInnerWidth*450/675-imgHeight/imgWidth*carouselInnerWidth)/2; 
    			$(_item).css({"padding-top": padding, "padding-bottom": padding});
    			$(_img).width(Math.max(minSize, carouselInnerWidth)); 
    			if (isIE7)  $(_img).height(Math.max(minSize, imgHeight/imgWidth*carouselInnerWidth)); 
    		} else  { 
    			$(_img).width(Math.max(minSize, imgWidth/imgHeight*carouselInnerWidth*450/675)); 
    			if (isIE7) $(_img).height(Math.max(minSize, carouselInnerWidth*450/675)); 
    		}
		} else {
			$('.fancybox-container .carousel-inner .item img').each(function(index, item) {
				imgWidth = this.width; 
	    		imgHeight = this.height; 
	    		if (imgWidth == 0 && $(this).attr("width") != 0) imgWidth = $(this).attr("width"); 
	    		if (imgHeight == 0 && $(this).attr("height") != 0) imgHeight = $(this).attr("height"); 
				if (imgHeight*675 < imgWidth*450) { // Wide
	    			padding = (carouselInnerWidth*450/675-imgHeight/imgWidth*carouselInnerWidth)/2; 
	    			$(item).parent().css({"padding-top": padding, "padding-bottom": padding});
	    			$(this).width(Math.max(minSize, carouselInnerWidth)); 
	    			if (isIE7)  $(this).height(Math.max(minSize, imgHeight/imgWidth*carouselInnerWidth)); 
	    		} else  { 
	    			$(this).width(Math.max(minSize, imgWidth/imgHeight*carouselInnerWidth*450/675)); 
	    			if (isIE7) $(this).height(Math.max(minSize, carouselInnerWidth*450/675)); 
	    		}
			}); 
		}
	}; 
	
	initCarousel = function() {
		$('.focus-gallery-wrapper .carousel').carousel();
		var carouselInnerWidth = isIE7 ? 295 : $('.focus-gallery-wrapper .carousel-inner-wrapper').width(); 
		$('.focus-gallery-wrapper .carousel-inner').height(carouselInnerWidth * 450/675);
		
		$('.focus-gallery-wrapper .carousel-inner .item').each(function(index, item) {
			var img = $('<img/>').load(function() {
        		updateCarousel(this, item);
        		$(item).append($(this)); 
			}).error(function() {
			}).attr("src", $(item).attr("data-src")).attr("alt", $(item).attr("data-alt")); 
		}); 
	}; 
	
	updateCarousel = function(_img, _item) {
		var padding = 0, carouselInnerWidth = isIE7 ? 295 : $('.focus-gallery-wrapper .carousel-inner-wrapper').width(); 
		var imgWidth, imgHeight; 
		if (_img != undefined) {
			imgWidth = _img.width; 
			imgHeight = _img.height; 
			if (imgWidth == 0 && $(_img).attr("width") != 0) imgWidth = $(_img).attr("width"); 
			if (imgHeight == 0 && $(_img).attr("height") != 0) imgHeight = $(_img).attr("height"); 
			if (imgWidth != 0 && imgHeight != 0) {
				if (imgHeight*675 < imgWidth*450) { // Wide
	    			padding = (carouselInnerWidth*450/675-imgHeight/imgWidth*carouselInnerWidth)/2; 
	    			$(_item).css({"padding-top": padding, "padding-bottom": padding});
	    			$(_img).width(carouselInnerWidth); 
	    			if (isIE7)  $(_img).height(imgHeight/imgWidth*carouselInnerWidth); 
	    		} else  { 
	    			padding = (carouselInnerWidth-imgWidth/imgHeight*carouselInnerWidth*450/675)/2; 
	    			$(_item).css({"padding-right": padding, "padding-left": padding});
	    			$(_img).width(imgWidth/imgHeight*carouselInnerWidth*450/675); 
	    			if (isIE7) $(_img).height(carouselInnerWidth*450/675); 
	    		} 
			}
		} else {
			$('.focus-gallery-wrapper .carousel-inner').height(carouselInnerWidth * 450/675);
			$('.focus-gallery-wrapper .carousel-inner .item img').each(function(index, item) {
				imgWidth = this.width; 
	    		imgHeight = this.height; 
	    		if (imgWidth == 0 && $(this).attr("width") != 0) imgWidth = $(this).attr("width"); 
	    		if (imgHeight == 0 && $(this).attr("height") != 0) imgHeight = $(this).attr("height"); 
				if (imgWidth != 0 && imgHeight != 0) {
					if (imgHeight*675 < imgWidth*450) { // Wide
		    			padding = (carouselInnerWidth*450/675-imgHeight/imgWidth*carouselInnerWidth)/2; 
		    			$(item).parent().css({"padding-top": padding, "padding-bottom": padding});
		    			$(this).width(carouselInnerWidth); 
		    			if (isIE7) $(this).height(imgHeight/imgWidth*carouselInnerWidth); 
		    		} else  { 
		    			padding = (carouselInnerWidth-imgWidth/imgHeight*carouselInnerWidth*450/675)/2; 
		    			$(item).parent().css({"padding-right": padding, "padding-left": padding});
		    			$(this).width(imgWidth/imgHeight*carouselInnerWidth*450/675); 
		    			if (isIE7) $(this).height(carouselInnerWidth*450/675); 
		    		} 
				}
			}); 
		}
	}
	
	$(window).resize(function() { 
		if ($('.fancybox-container #flashcontent').length > 0) {
			resizeVideoFancybox(); 
		} else if ($('.fancybox-container .carousel-inner .item').length > 0) {
			resizeCarouselOnFancybox();
			updateCarouselOnFancybox();
		}
	}); 
});