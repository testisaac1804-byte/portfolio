// var first_page_kind;
// // 작품소개에서 동영상보여주는 함수
// function sel_kind(kind) {
//   first_page_kind = kind;
// }
var overSearchLanguage = false;
$(document).ready(function() {
	// Initiate superfish on nav menu
	$(".nav-menu").superfish({
		animation: { opacity: "show" },
		speed: 400
	});

	// Mobile Navigation
	if ($("#nav-menu-container").length) {
		var $mobile_nav = $("#nav-menu-container")
			.clone()
			.prop({ id: "mobile-nav" });
		$mobile_nav.find("> ul").attr({ class: "", id: "" });
		$("body").append($mobile_nav);
		$("body").prepend(
			'<button type="button" id="mobile-nav-toggle"><i class="fa fa-bars"></i></button>'
		);
		$("body").append('<div id="mobile-body-overly"></div>');
		$("#mobile-nav")
			.find(".menu-has-children")
			.prepend('<i class="fa fa-chevron-down"></i>');

		$(document).on("click", ".menu-has-children i", function(e) {
			$(this)
				.next()
				.toggleClass("menu-item-active");
			$(this)
				.nextAll("ul")
				.eq(0)
				.slideToggle();
			$(this).toggleClass("fa-chevron-up fa-chevron-down");
		});

		$(document).on("click", "#mobile-nav-toggle", function(e) {
			$("body").toggleClass("mobile-nav-active");
			$("#mobile-nav-toggle i").toggleClass("fa-times fa-bars");
			$("#mobile-body-overly").toggle();
		});

		$(document).click(function(e) {
			var container = $("#mobile-nav, #mobile-nav-toggle");
			if (!container.is(e.target) && container.has(e.target).length === 0) {
				if ($("body").hasClass("mobile-nav-active")) {
					$("body").removeClass("mobile-nav-active");
					$("#mobile-nav-toggle i").toggleClass("fa-times fa-bars");
					$("#mobile-body-overly").fadeOut();
				}
			}
		});
	} else if ($("#mobile-nav, #mobile-nav-toggle").length) {
		$("#mobile-nav, #mobile-nav-toggle").hide();
	}

	// Stick the header at top on scroll
	$(".my_header").sticky({ topSpacing: 0, zIndex: "50" });

	var bOver = false;
	$(".search-language-control").on("mouseover", function() {
		$(".search-language").addClass("show");

		setTimeout(function() {
			if (!bOver) {
				$(".search-language").removeClass("show");
			}
		}, 3000);
	});

	$(".search-language").on("mouseover", function(e) {
		bOver = true;
	});

	$(".search-language").on("mouseleave", function(e) {
		bOver = false;
		$(".search-language").removeClass("show");
	});
});
