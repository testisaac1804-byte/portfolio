var JH3DCarousel = function () {
	var body_el = null;
	var playlist1_el = null;
	var myDiv_el = null;

	var mainWidth = 1170;
	var carouselHeight = 500;
	var gridWidth = 1170;
	var windowW = 0;
	var windowH = 0;

	var sValues = [650, 42, 12, 21, .3, 1, true, 10, "yes"];

	var resizeHandlerId_to;
	var scrollEndId_to;

	var buyButton;

	//##################################//
	/* Remove playlists for better performance */
	//##################################//
	function removePlayLists() {
		try {
			body_el.removeChild(playlist1_el);
		} catch (e) { }
	};

	//##################################//
	/* Full screen change handler */
	//##################################//
	function onFullScreenChange(e) {
		var isFullScreen = document.fullScreen || !document.mozFullScreen;
		if (isFullScreen) {
			clearTimeout(resizeHandlerId_to);
			resizeHandlerId_to = setTimeout(positionStuff, 90);
		}
	}

	//#####################################//
	/* resize handler */
	//#####################################//
	function onResizeHandler() {
		if (JH3DCUtils.isMobile) {
			clearTimeout(resizeHandlerId_to);
			resizeHandlerId_to = setTimeout(positionStuff, 90);
		} else {
			positionStuff();
			if (JH3DCUtils.isIE) {
				clearTimeout(resizeHandlerId_to);
				resizeHandlerId_to = setTimeout(positionStuff, 90);
			}
		}
	}

	//#####################################//
	/* position stuff */
	//#####################################//
	function positionStuff() {
		var viewportSize = JH3DCUtils.getViewportSize();
		windowW = window.offsetWidth;
		windowH = viewportSize.h;
	}

	function setupCarousel(configs) {
		// jQuery.assign()
		carousel = new JHUltimate3DCarousel(jQuery.extend({}, {

			//required settings
			//carouselHolderDivId: "home-banner",
			//carouselDataListDivId: "carousel-data",
			displayType: "responsive",
			autoScale: "yes",
			carouselWidth: 1170,
			carouselHeight: 530,
			mainFolderPath: "load",
			skinPath: "minimal_classic_skin",

			//main settings
			thumbnailsBackgroundImagePath: "",
			scrollbarBackgroundImagePath: "",
			backgroundRepeat: "repeat-x",
			carouselStartPosition: "center",
			carouselTopology: "ring",
			carouselXRadius: sValues[0],
			carouselYRadius: sValues[1],
			carouselXRotation: sValues[2],
			carouselYOffset: sValues[3],
			showCenterImage: sValues[8],
			centerImagePath: "load/media/logo.png",
			centerImageYOffset: 0,
			showDisplay2DAlways: "no",
			slideshowDelay: 5000,
			autoplay: "yes",
			showPrevButton: "yes",
			showNextButton: "yes",
			showSlideshowButton: "yes",
			disableNextAndPrevButtonsOnMobile: "no",
			showLargeNextAndPrevButtons: "no",
			largeNextAndPrevButtonsOffest: 15,
			controlsMaxWidth: 1170,
			controlsHeight: 31,
			controlsPosition: "bottom",
			slideshowTimerColor: "#777777",
			rightClickContextMenu: "default",
			addKeyboardSupport: "yes",
			useDragAndSwipe: "yes",

			//thumbnail settings
			thumbnailWidth: 380,
			thumbnailHeight: 285,
			thumbnailBorderSize: 3,
			thumbnailMinimumAlpha: .3,
			thumbnailBackgroundColor: "#FFFFFF",
			thumbnailBorderColor1: "#FFFFFF",
			thumbnailBorderColor2: "#FFFFFF",
			transparentImages: "no",
			maxNumberOfThumbnailsOnMobile: 13,
			showThumbnailsGradient: "yes",
			showThumbnailsHtmlContent: "no",
			textBackgroundColor: "#FFFFFF",
			textBackgroundOpacity: .9,
			showText: "yes",
			showTextBackgroundImage: "no",
			showFullTextWithoutHover: "yes",
			showThumbnailBoxShadow: "",
			thumbnailBoxShadowCss: "",
			showReflection: "yes",
			reflectionHeight: 60,
			reflectionDistance: sValues[7],
			reflectionOpacity: .4,

			//scrollbar settings
			showScrollbar: "yes",
			disableScrollbarOnMobile: "yes",
			enableMouseWheelScroll: "no",
			scrollbarHandlerWidth: 300,
			scrollbarTextColorNormal: "#000000",
			scrollbarTextColorSelected: "#FFFFFF",

			//combobox settings
			showComboBox: "no",
			startAtCategory: 1
		}, configs));
	}

	return {
		init: function (configs) {
			body_el = document.getElementsByTagName('body')[0];
			playlist1_el = document.getElementById(configs.carouselDataListDivId);
			myDiv_el = document.getElementById(configs.carouselHolderDivId);

			positionStuff(configs);

			if (window.addEventListener) {
				window.addEventListener("resize", onResizeHandler);
				if (JH3DCUtils.isFirefox) {
					document.addEventListener("mozfullscreenchange", onFullScreenChange);
					document.removeEventListener("fullscreenchange", onFullScreenChange);
				}
			} else if (window.attachEvent) {
				window.attachEvent("onresize", onResizeHandler);
			}

			setupCarousel(configs);

			setTimeout(function () {
				positionStuff();
				removePlayLists();
			}, 100);
		}
	}
}();