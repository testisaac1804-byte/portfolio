var img_num;

function scaleSlider() {
	
	// adjust width & height, position of container
	

	var win_width = $(window).width();
	var win_height = $(window).height();
	var default_width = (win_width/(2.8)).toFixed(1);
	var default_height = 340;

	var container_width = $('#revodaily_slider_container').width();
	var container_height = $('#revodaily_slider_container').height();
	var navigator_height = 10; //$('#revodaily_slider_navigator').height();

	if (win_width >= default_width) {
		$('#revodaily_slider_container').width(default_width);
		$('#revodaily_slider_navigator').width(default_width);
	} else {
		$('#revodaily_slider_container').css('max-width',win_width);
		$('#revodaily_slider_navigator').css('max-width',win_width);
	}

	var con_nav_height = default_height + 10 + navigator_height;	// 30 = 20(container margin-top,bottom) + 10(navigator margin-top,bottom)	
	$('#revodaily_slider_container').css('margin', '10px auto');
	$('#revodaily_slider_navigator').css('margin', '5px auto');

	if (win_height >= con_nav_height) {
		$('#revodaily_slider_container').height(default_height);
		
		$('#revodaily_slider_container').css('margin', 0);
		$('#revodaily_slider_navigator').css('margin-bottom', 0);
	} else {
		$('#revodaily_slider_container').height(win_height - navigator_height - 25);
		$('#revodaily_slider_navigator').css('margin-bottom', '0px');
	}

	container_width = $('#revodaily_slider_container').width();
	container_height = $('#revodaily_slider_container').height();

	// scale images
	var scale_w, scale_h, org_width, org_height;
//	$('.img-slide').css('display', 'block');
	$('.img-slide').each( function( ndx ) {

		// adjust image size
		org_width = $(this).width(); 
		org_height = $(this).height();
		scale_w = org_width / container_width;
		scale_h = org_height / container_height;

		if (org_width > container_width) {
			if (org_height > container_height) {
				if (scale_w > scale_h) {
					$(this).css('max-width', '100%');
					$(this).css('height', 'auto');
				} else {
					$(this).css('width', 'auto');
					$(this).css('max-height', '100%');
				}
			} else {
				$(this).css('max-width', '100%');
				$(this).css('height', 'auto');
			}
		} else {
			if (org_height > container_height) {
				$(this).css('width', 'auto');
				$(this).css('max-height', '100%');
			} else {
				if (scale_w > scale_h) {
					$(this).css('max-width', '100%');
					$(this).css('height', 'auto');
				} else {
					$(this).css('width', 'auto');
					$(this).css('max-height', '100%');
				}
			}
		}
		
	//	org_width = $(this).width();
	//	org_height = $(this).height();

		// adjust image position
		$(this).css('margin-left', '');
		$(this).css('margin-top', '');
		if ( org_width < container_width ) {
		//	$(this).css('margin-left', (container_width - org_width) /6);
		}
		if ( org_height < container_height ) {
			$(this).css('margin-top', (container_height - org_height) / 2);
		}
	});
	
//	$('.img-slide').css('display', 'none');
	$('.img-slide').eq(img_num-1).css('display', 'block');
}

$(document).ready(function() {

scaleSlider();

	var total_cnt = $('#imageCnt').val();
	
	img_num = 1;
	$('.img-slide').eq(img_num-1).css('display', 'block');
	$('#imagePaging').html(img_num + '&nbsp;/&nbsp;' + total_cnt);
	
    $(window).bind('load', scaleSlider);
    $(window).bind('resize', scaleSlider);
    $(window).bind('orientationchange', scaleSlider);
	
	$('#farrowright').on('click', function() {
		if(img_num == total_cnt)
			img_num = 1;
		else
			img_num++;

		$('.img-slide').css('display', 'none');
		$('.img-slide').eq(img_num-1).css('display', 'block');
		$('#imagePaging').html(img_num + '&nbsp;/&nbsp;' + total_cnt);
	});
	
	$('#farrowleft').on('click', function() {
		if(img_num == 1)
			img_num = total_cnt;
		else
			img_num--;

		$('.img-slide').css('display', 'none');
		$('.img-slide').eq(img_num-1).css('display', 'block');
		$('#imagePaging').html(img_num + '&nbsp;/&nbsp;' + total_cnt);
	});
	
	$('#closePhoto').on('click', function() {
		history.go(-1);	
	});
});