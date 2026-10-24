function displayLoading(){
	$('.loading-wrapp').addClass('visible');
}

$(document).ready(function(){
	$('.loading').click(function(e){
		if ((e.ctrlKey === false && e.shiftKey === false) && $(this).attr("target") !== '_blank' && e.button != 1) {
			$('.loading-wrapp').addClass('visible');
		}
	})
	$('.special-good-list').slick({
		slidesToShow: 4,
		slidesToScroll: 1,
		infinite: true,
		autoplay: true,
		dots: true,
		prevArrow: '<span class="special-arrow prev"><i></i></span>',
		nextArrow: '<span class="special-arrow next"><i></i></span>',
		lazyLoad: 'ondemand', // ondemand progressive anticipated
		autoplayspeed : 1000,
		responsive:[{
			breakpoint: 1100,
			settings:{
				slidesToShow: 3
			}
		},
		{
			breakpoint: 769,
			settings:{
				slidesToShow: 3
			}
		},
		{
			breakpoint: 641,
			settings:{
				slidesToShow: 2
			}
		},
		{
			breakpoint: 321,
			settings:{
				slidesToShow: 1
			}
		}]
	});
	$('.category-slider').slick({
		slidesToShow: 8,
		slidesToScroll: 1,
		infinite: false,
		prevArrow: '<span class="category-arrow prev"><i class="fa fa-chevron-left"></i></span>',
		nextArrow: '<span class="category-arrow next"><i class="fa fa-chevron-right"></i></span>',
		responsive:[
		{
			breakpoint: 1320,
			settings:{
				slidesToShow: 6
			}
		},		
		{
			breakpoint: 1025,
			settings:{
				slidesToShow: 6
			}
		},
		{
			breakpoint: 1000,
			settings:{
				slidesToShow: 4
			}
		},
		{
			breakpoint: 759,
			settings:{
				slidesToShow: 4
			}
		},
		{
			breakpoint: 601,
			settings:{
				slidesToShow: 3
			}
		},
		{
			breakpoint: 451,
			settings:{
				slidesToShow: 2
			}			
		},
		{
			breakpoint: 331,
			settings:{
				slidesToShow: 1
			}			
		}]
	});
	$('.basic-images').slick({
		slidesToShow: 5,
		slidesToScroll: 1,
		infinite: false,
		autoplay: true,
		prevArrow: '<span class="submenu-arrow prev"><i class="icon-arrow-prev"></i></span>',
		nextArrow: '<span class="submenu-arrow next"><i class="icon-arrow-next"></i></span>',
		responsive:[{
			breakpoint: 991,
			settings:{
				slidesToShow: 4
			},
		},		
		{
			breakpoint: 681,
			settings:{
				slidesToShow: 3
			}
		},		
		{
			breakpoint: 561,
			settings:{
				slidesToShow: 2
			}			
		},
		{
			breakpoint: 351,
			settings:{
				slidesToShow: 1
			}			
		}]
	});
	$('.photo_right').slick({
		autoplay: true,
		slidesToShow: 4,
		slidesToScroll: 1,
		infinite: false,
		prevArrow: '<span class="submenu-arrow prev"><i class="icon-arrow-prev"></i></span>',
		nextArrow: '<span class="submenu-arrow next"><i class="icon-arrow-next"></i></span>',
		infinite: true,
		responsive:[{
			breakpoint: 1281,
			settings:{
				slidesToShow: 3
			}		
		},
		{
			breakpoint: 1025,
			settings:{
				slidesToShow: 2
			}
		},
		{
			breakpoint: 991,
			settings:{
				slidesToShow: 1
			}
		}]
	});  
	$('.f-product-slider').slick({
		slidesToShow: 5,
		slidesToScroll: 1,
		infinite: false,
		prevArrow: '<span class="submenu-arrow prev"><i class="fa fa-chevron-left"></i></span>',
		nextArrow: '<span class="submenu-arrow next"><i class="fa fa-chevron-right"></i></span>',
		responsive:[{
			breakpoint: 1201,
			settings:{
				slidesToShow: 4
			}
		},
		{
			breakpoint: 992,
			settings:{
				slidesToShow: 3
			}
		},
		{
			breakpoint: 768,
			settings:{
				slidesToShow: 2
			}
		},
		{
			breakpoint: 401,
			settings:{
				slidesToShow: 1
			}
		}]
	});
	$('.slider-image').slick({
		infinite: true,
		autoplay: true,
		dots: true,
		prevArrow: '<span class="special-arrow prev"><i></i></span>',
		nextArrow: '<span class="special-arrow next"><i></i></span>',
		lazyLoad: 'ondemand', // ondemand progressive anticipated
		fade : true,
		variableWidth: false,
		autoplayspeed : 1000
	});

	$('.pro-image').slick({
		infinite: true,
		autoplay: true,
		dots: false,
		prevArrow: '<span class="special-arrow prev"><i></i></span>',
		nextArrow: '<span class="special-arrow next"><i></i></span>',
		lazyLoad: 'ondemand', // ondemand progressive anticipated
		fade : true,
		variableWidth: false,
		autoplayspeed : 1000
	});
	// $('#medical_product').slick({
	// 	infinite: true,
	// 	autoplay: true,
	// 	dots: true,
	// 	prevArrow: '<span class="special-arrow prev"><i></i></span>',
	// 	nextArrow: '<span class="special-arrow next"><i></i></span>',
	// 	lazyLoad: 'ondemand', // ondemand progressive anticipated
	// 	fade : true,
	// 	variableWidth: false,
	// 	autoplayspeed : 1000
	// });
	$('.slick').slick({
		slidesToShow: 3,
		slidesToScroll: 5,
		infinite: false,
		prevArrow: '<span class="submenu-arrow prev"></span>',
		nextArrow: '<span class="submenu-arrow next"></span>',
		infinite: true
	});
	$('.index-images').slick({
		slidesToShow: 5,
		slidesToScroll:3,
		infinite: true,
		prevArrow: '<span class="submenu-arrow pre"><i class="icon-arrow-prev"></i></span>',
		nextArrow: '<span class="submenu-arrow nex"><i class="icon-arrow-next"></i></span>',
		autoplay: true,
		autoplayspeed : 100,
		
	});
	$('.index').slick({
		slidesToShow: 1,
		slidesToScroll:1,
		infinite: true,
		prevArrow: '<span class="submenu-arrow pre"><i class="icon-arrow-prev"></i></span>',
		nextArrow: '<span class="submenu-arrow nex"><i class="icon-arrow-next"></i></span>',
		autoplay: true,
		autoplayspeed : 100,	
	});
	$('.photos ul').slick({
		slidesToShow: 2,
		slidesToScroll:1,
		infinite: true,
		prevArrow: '<span class="submenu-arrow up"><i class="icon-arrow-prev"></i></span>',
		nextArrow: '<span class="submenu-arrow down"><i class="icon-arrow-next"></i></span>',
		autoplay: true,
		autoplayspeed : 100,
		vertical: true,
		verticalSwiping: true    	
	});
	$('.p-image').slick({
		slidesToShow: 1,
		slidesToScroll:1,
		infinite: true,
		prevArrow: '<span class="submenu-arrow pre"><i class="icon-arrow-prev"></i></span>',
		nextArrow: '<span class="submenu-arrow nex"><i class="icon-arrow-next"></i></span>',
		autoplay: true,
		autoplayspeed : 100
	});
	$('.product-slick').slick({
		slidesToShow: 1,
		slidesToScroll:1,
		infinite: true,
		prevArrow: '<span class="submenu-arrow pre"><i class="icon-arrow-prev"></i></span>',
		nextArrow: '<span class="submenu-arrow nex"><i class="icon-arrow-next"></i></span>',
		autoplay: true,
		autoplayspeed : 1000
	});
	$('.service-image').slick({
		slidesToShow: 1,
		slidesToScroll:1,
		infinite: true,
		prevArrow: '<span class="submenu-arrow pre"><i class="icon-arrow-prev"></i></span>',
		nextArrow: '<span class="submenu-arrow nex"><i class="icon-arrow-next"></i></span>',
		autoplay: true,
		autoplayspeed : 100	
	});
	$('.s-photos').slick({
		slidesToShow: 4,
		slidesToScroll:1,
		infinite: true,
		prevArrow: '<span class="submenu-arrow pre"><i class="icon-arrow-prev"></i></span>',
		nextArrow: '<span class="submenu-arrow nex"><i class="icon-arrow-next"></i></span>',
		autoplay: true,
		autoplayspeed : 100	
	});
	$('.partner-image').slick({
		slidesToShow: 1,
		slidesToScroll:1,
		infinite: true,
		prevArrow: '<span class="submenu-arrow pre"><i class="icon-arrow-prev"></i></span>',
		nextArrow: '<span class="submenu-arrow nex"><i class="icon-arrow-next"></i></span>',
		autoplay: true,
		autoplayspeed : 100	
	});
	$('.connection-image').slick({
		slidesToShow: 1,
		slidesToScroll:1,
		infinite: true,
		prevArrow: '<span class="submenu-arrow pre"><i class="icon-arrow-prev"></i></span>',
		nextArrow: '<span class="submenu-arrow nex"><i class="icon-arrow-next"></i></span>',
		autoplay: true,
		autoplayspeed : 100	
	});
	$('.connection-info').slick({
		slidesToShow: 3,
		slidesToScroll:1,
		infinite: true,
		prevArrow: '<span class="submenu-arrow pre"><i class="icon-arrow-prev"></i></span>',
		nextArrow: '<span class="submenu-arrow nex"><i class="icon-arrow-next"></i></span>',
		autoplay: true,
		autoplayspeed : 100	
	});


})
$(function() {
  	var pull = $('#ipull');
  	var menu = $('.top-menu .clearfix ul');
        
  	$(pull).on('click', function(e) {
        e.preventDefault();
        menu.slideToggle();
    });
    
});

$(function() {
  	var enterprise_pull = $('#enterprise-ipull');
  	var enterprise_menu = $('.e-tab > nav');
        
  	$(enterprise_pull).on('click', function(e) {
        e.preventDefault();
        enterprise_menu.slideToggle();        
    });   

    $('.dropdown1 > i').on('click',function(e) {
    	e.stopPropagation();
    	e.preventDefault();
    	$('.dropdown1 > ul').slideToggle();
    });

    $('.dropdown-menu1 > .dropdown-submenu > i').on('click',function(e) {
    	e.stopPropagation();
    	e.preventDefault();
    	_dis_val = $(this).next().css('display');
    	$('.dropdown-submenu > .dropdown-menu1').css('display', 'none');
    	$(this).next().css('display', _dis_val);
    	$(this).next().slideToggle();
    });
    
    
});

function revol_move_page(page_num, total_count, lang_type){
	if(page_num > total_count) return;

	var ajaxurl = '/index.php/' + 'news_list';
	var next_page = (page_num == total_count ? total_count : page_num + 1);
	var prev_page = (page_num == 1 ? 1 : page_num - 1);
	
	
	var data = {
		type : 0,	// revolution news
		page : page_num,
		lang : lang_type
	}

	$("#revol_" + page_num).addClass("active");
	$("#revol_" + page_num).siblings().removeClass("active");
	$('.wait').removeClass('invisible');

	$.post(ajaxurl, data, function(response){
		$('#revol_list').html(response);
		$('.wait').addClass('invisible');
		$('#revol_next').attr('onclick', 'revol_move_page(' + next_page + ',' + total_count + ',"' + lang_type + '")');
		$('#revol_prev').attr('onclick', 'revol_move_page(' + prev_page + ',' + total_count + ',"' + lang_type + '")');
	})
	
}

function news_move_page(page_num, total_count, lang_type){
	if(page_num > total_count) return;

	var ajaxurl = 'http://localhost/outside/index.php/' + 'news_list';
	var next_page = (page_num == total_count ? total_count : page_num + 1);
	var prev_page = (page_num == 1 ? 1 : page_num - 1);		
	
	var data = {
		type : 1,	// news
		page : page_num,
		lang : lang_type
	}

	$("#news_" + page_num).addClass("active");
	$("#news_" + page_num).siblings().removeClass("active");
	$('.wait').removeClass('invisible');

	$.post(ajaxurl, data, function(response){
		$('#news_list').html(response);
		$('.wait').addClass('invisible');
		$('#news_next').attr('onclick', 'news_move_page(' + next_page + ',' + total_count + ',"' + lang_type + '")');
		$('#news_prev').attr('onclick', 'news_move_page(' + prev_page + ',' + total_count + ',"' + lang_type + '")');
	})
	
}


