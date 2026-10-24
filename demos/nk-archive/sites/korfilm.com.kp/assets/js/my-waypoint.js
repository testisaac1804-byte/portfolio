;(function () {
	
	// Image Animations
	var contentWayPoint = function() {
		var i = 0;
		$('.animate-box').waypoint( function( direction ) {

			if( direction === 'down' && !$(this.element).hasClass('animated') ) {
				
				i++;

                var $el_img = $(this.element).find(".block-img").find("img");

                $(this.element).addClass('item-animate');

                if ($el_img.data("src") != '' && $el_img.data("src") != '/')
                    $el_img.prop("src", $el_img.data("src"));

				setTimeout(function(){
					$('body .animate-box.item-animate').each(function(k){
						var el = $(this);
						setTimeout( function () {
							var effect = el.data('animate-effect');

                            el.parents(".loading").removeClass("loading");

                            if ( effect == '') {
                                el.addClass('fadeInUp animated');
							} else {
                                el.addClass(effect + ' animated');
							}

							el.removeClass('item-animate');
						},  k * 100, 'easeInOutExpo' );
					});
					
				}, 100);
				
			}

		} , { offset: '80%' } );
	};

	// Document on load.
	$(function(){
		contentWayPoint();
	});

}());