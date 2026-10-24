/* ========================================================================
 * Bootstrap: carousel.js v3.3.5
 * http://getbootstrap.com/javascript/#carousel
 * ========================================================================
 * Copyright 2011-2015 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */

+(function($) {
	"use strict";

	// CAROUSEL CLASS DEFINITION
	// =========================

	var Carousel = function(element, options) {
		Carousel.prototype.$element = $(element);
		Carousel.prototype.$indicators = Carousel.prototype.$element.find(".carousel-indicators");
		Carousel.prototype.options = options;
		Carousel.prototype.paused = null;
		Carousel.prototype.sliding = null;
		Carousel.prototype.interval = null;
		Carousel.prototype.$active = null;
		Carousel.prototype.$items = null;

		Carousel.prototype.options.keyboard &&
			Carousel.prototype.$element.on("keydown.bs.carousel", $.proxy(Carousel.prototype.keydown, this));

		Carousel.prototype.options.pause == "hover" &&
			!("ontouchstart" in document.documentElement) &&
			Carousel.prototype.$element
				.on("mouseenter.bs.carousel", $.proxy(Carousel.prototype.pause, this))
				.on("mouseleave.bs.carousel", $.proxy(Carousel.prototype.cycle, this));
	};

	Carousel.VERSION = "3.3.5";

	Carousel.TRANSITION_DURATION = 600;

	Carousel.DEFAULTS = {
		interval: 5000,
		pause: "hover",
		wrap: true,
		keyboard: true
	};

	// Carousel.prototype.keydown = function(e) {

	document.addEventListener("keydown", function(e) {
		console.log(e.keyCode);
		// if (/input|textarea/i.test(e.target.tagName)) return;
		switch (e.which) {
			case 37:
				Carousel.prototype.prev();
				break;
			case 39:
				Carousel.prototype.next();
				break;
			default:
				return;
		}

		e.preventDefault();
	});

	Carousel.prototype.cycle = function(e) {
		e || (Carousel.prototype.paused = false);

		Carousel.prototype.interval && clearInterval(Carousel.prototype.interval);

		Carousel.prototype.options.interval &&
			!Carousel.prototype.paused &&
			(Carousel.prototype.interval = setInterval(
				$.proxy(Carousel.prototype.next, this),
				Carousel.prototype.options.interval
			));
		$(".curIdx").html($(".photo-item.active").attr("photoid"));
		return this;
	};

	Carousel.prototype.getItemIndex = function(item) {
		Carousel.prototype.$items = item.parent().children(".item");
		return Carousel.prototype.$items.index(item || Carousel.prototype.$active);
	};

	Carousel.prototype.getItemForDirection = function(direction, active) {
		var activeIndex = Carousel.prototype.getItemIndex(active);
		var willWrap =
			(direction == "prev" && activeIndex === 0) ||
			(direction == "next" && activeIndex == Carousel.prototype.$items.length - 1);
		if (willWrap && !Carousel.prototype.options.wrap) return active;
		var delta = direction == "prev" ? -1 : 1;
		var itemIndex = (activeIndex + delta) % Carousel.prototype.$items.length;

		$(".curIdx").html($(".photo-item.active").attr("photoid"));

		return Carousel.prototype.$items.eq(itemIndex);
	};

	Carousel.prototype.to = function(pos) {
		var that = this;
		var activeIndex = Carousel.prototype.getItemIndex(
			(Carousel.prototype.$active = Carousel.prototype.$element.find(".item.active"))
		);

		if (pos > Carousel.prototype.$items.length - 1 || pos < 0) return;

		if (Carousel.prototype.sliding)
			return Carousel.prototype.$element.one("slid.bs.carousel", function() {
				that.to(pos);
			}); // yes, "slid"
		if (activeIndex == pos) return Carousel.prototype.pause().cycle();

		return Carousel.prototype.slide(pos > activeIndex ? "next" : "prev", Carousel.prototype.$items.eq(pos));
	};

	Carousel.prototype.pause = function(e) {
		e || (Carousel.prototype.paused = true);

		if (Carousel.prototype.$element.find(".next, .prev").length && $.support.transition) {
			Carousel.prototype.$element.trigger($.support.transition.end);
			Carousel.prototype.cycle(true);
		}

		Carousel.prototype.interval = clearInterval(Carousel.prototype.interval);

		return this;
	};

	Carousel.prototype.next = function() {
		if (Carousel.prototype.sliding) return;
		return Carousel.prototype.slide("next");
	};

	Carousel.prototype.prev = function() {
		if (Carousel.prototype.sliding) return;
		return Carousel.prototype.slide("prev");
	};

	Carousel.prototype.slide = function(type, next) {
		var $active = Carousel.prototype.$element.find(".item.active");
		var $next = next || Carousel.prototype.getItemForDirection(type, $active);
		var isCycling = Carousel.prototype.interval;
		var direction = type == "next" ? "left" : "right";
		var that = this;

		if ($next.hasClass("active")) return (Carousel.prototype.sliding = false);

		var relatedTarget = $next[0];
		var slideEvent = $.Event("slide.bs.carousel", {
			relatedTarget: relatedTarget,
			direction: direction
		});
		Carousel.prototype.$element.trigger(slideEvent);
		if (slideEvent.isDefaultPrevented()) return;

		Carousel.prototype.sliding = true;

		isCycling && Carousel.prototype.pause();

		if (Carousel.prototype.$indicators.length) {
			Carousel.prototype.$indicators.find(".active").removeClass("active");
			var $nextIndicator = $(Carousel.prototype.$indicators.children()[Carousel.prototype.getItemIndex($next)]);
			$nextIndicator && $nextIndicator.addClass("active");
		}

		var slidEvent = $.Event("slid.bs.carousel", { relatedTarget: relatedTarget, direction: direction }); // yes, "slid"
		if ($.support.transition && Carousel.prototype.$element.hasClass("slide")) {
			$next.addClass(type);
			$next[0].offsetWidth; // force reflow
			$active.addClass(direction);
			$next.addClass(direction);
			$active
				.one("bsTransitionEnd", function() {
					$next.removeClass([type, direction].join(" ")).addClass("active");
					$active.removeClass(["active", direction].join(" "));
					that.sliding = false;
					setTimeout(function() {
						that.$element.trigger(slidEvent);
					}, 0);
				})
				.emulateTransitionEnd(Carousel.TRANSITION_DURATION);
		} else {
			$active.removeClass("active");
			$next.addClass("active");
			Carousel.prototype.sliding = false;
			Carousel.prototype.$element.trigger(slidEvent);
		}

		isCycling && Carousel.prototype.cycle();

		$(".curIdx").html($(".photo-item.active").attr("photoid"));

		return this;
	};

	// CAROUSEL PLUGIN DEFINITION
	// ==========================

	function Plugin(option) {
		return this.each(function() {
			var $this = $(this);
			var data = $this.data("bs.carousel");
			var options = $.extend({}, Carousel.DEFAULTS, $this.data(), typeof option == "object" && option);
			var action = typeof option == "string" ? option : options.slide;

			if (!data) $this.data("bs.carousel", (data = new Carousel(this, options)));
			if (typeof option == "number") data.to(option);
			else if (action) data[action]();
			else if (options.interval) data.pause().cycle();
		});
	}

	var old = $.fn.carousel;

	$.fn.carousel = Plugin;
	$.fn.carousel.Constructor = Carousel;

	// CAROUSEL NO CONFLICT
	// ====================

	$.fn.carousel.noConflict = function() {
		$.fn.carousel = old;
		return this;
	};

	// CAROUSEL DATA-API
	// =================

	var clickHandler = function(e) {
		var href;
		var $this = $(this);
		var $target = $(
			$this.attr("data-target") || ((href = $this.attr("href")) && href.replace(/.*(?=#[^\s]+$)/, ""))
		); // strip for ie7
		if (!$target.hasClass("carousel")) return;
		var options = $.extend({}, $target.data(), $this.data());
		var slideIndex = $this.attr("data-slide-to");
		if (slideIndex) options.interval = false;

		Plugin.call($target, options);

		if (slideIndex) {
			$target.data("bs.carousel").to(slideIndex);
		}

		$(".curIdx").html($(".photo-item.active").attr("photoid"));

		e.preventDefault();
	};

	$(document)
		.on("click.bs.carousel.data-api", "[data-slide]", clickHandler)
		.on("click.bs.carousel.data-api", "[data-slide-to]", clickHandler);

	$(window).on("load", function() {
		$('[data-ride="carousel"]').each(function() {
			var $carousel = $(this);
			Plugin.call($carousel, $carousel.data());
		});
	});
})(jQuery);
