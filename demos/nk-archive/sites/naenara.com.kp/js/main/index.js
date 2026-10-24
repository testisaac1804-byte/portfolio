
jQuery(document).ready(function () {
	var sp = $('.first-activity label').attr('artdate').split('-');
	var path = 'periodic#news_daily#' + sp[0] + '#' +
		sp[1] + '#' + sp[2] + '#' + $('.first-activity label').attr('fname') + '.htm';
	$.get('/index.php/Main/showArticle/' + encodeURIComponent(path) + '/6/1', {}, function (pres) {
		$('.modal').css('background-color', 'rgb(121, 2, 2)');
		$('.news_contents').html(pres);
		if($('.news_contents img').length>0){
			var sp = $('.news_contents img').eq(0).attr('src').split('/');
			var sum_sp = '/'+sp[1]+'/'+sp[2]+'/'+sp[3]+'/'+sp[4]+'/'+sp[5]+'/'+sp[6]+'/' ;
			if(sp[7].split('.').length>1)
				sum_sp +=  sp[7];
			else
				sum_sp +=  sp[7]+'.jpg';
			$('.news_contents img').eq(0).attr('src',sum_sp);
		}
		$('.news_contents img').addClass('activity_img');
		$('.news_contents img').attr('alt','naenara-image');
		$('.news_contents p:last-child').append($('.first-activity label'));
		// $('.news_contents p').eq(0).remove();
		// $('.act_theme').html($('.first-activity label').attr('value') + "&nbsp;");
		// $('.news_contents p').eq(0).append("<span class='datec'>[" + $('.first-activity label').attr('artdate') + "]</span>");
		$('.news_contents').attr('data-toggle', 'modal');
		$('.news_contents').attr('data-target', '#modal_view');
		$('.news_contents').attr('value', $('.first-activity label').attr('value'));
		$('.news_contents').attr('artdate', $('.first-activity label').attr('artdate'));
		$('.news_contents').attr('fname', $('.first-activity label').attr('fname'));
	});

	var cnt = 0;
	for (var i = 0; i < $('.recent_list li').length; i++) {
		var sp = $('.recent_list li').eq(i).attr('artdate').split('-');
		var path = 'periodic#news_daily#' + sp[0] + '#' +
			sp[1] + '#' + sp[2] + '#' + $('.recent_list li').eq(i).attr('fname') + '.htm';

		$.get('/index.php/Main/getImgJS/' + encodeURIComponent(path) + '/' + i, {}, function (pres) {
			pres = pres.split('#');
			if (pres[1] == 'img') {
				$('.recent_list li span').eq(pres[0]).after("<i class='fa fa-camera'></i> ");
			}
			if (pres[1] == 'video')
				$('.recent_list li span').eq(pres[0]).after("<i class='fa fa-video-camera'></i> ");
		});
	}

	for (var i = 0; i < $('.activity_list p').length; i++) {
		var sp = $('.activity_list p').eq(i).attr('artdate').split('-');
		var path = 'periodic#news_daily#' + sp[0] + '#' +
			sp[1] + '#' + sp[2] + '#' + $('.activity_list p').eq(i).attr('fname') + '.htm';

		$.get('/index.php/Main/getImgJS/' + encodeURIComponent(path) + '/' + i, {}, function (pres) {
			pres = pres.split('#');
			if (pres[1] == 'img')
				$('.activity_list p span').eq(pres[0]).after("<i class='fa fa-camera'></i> ");
			if (pres[1] == 'video')
				$('.activity_list p span').eq(pres[0]).after("<i class='fa fa-video-camera'></i> ");
		});
	}
});
$('aside img').mouseover(function () {
	var src = $(this).attr('src').split('.');
	$(this).attr('src',src[0]+'-'+'.png');
});
$('aside img').mouseout(function () {
	var src = $(this).attr('src').split('-');
	$(this).attr('src',src[0]+'.png');
});
$('#contents_photo a').click(function () {
	var photourl = $(this).attr('photourl');
	window.open(photourl, '_blank');
	$.ajax({
		url: '/index.php/Main/photovisitcout/' + encodeURIComponent($(this).attr('photoname')) + '/' + encodeURIComponent($(this).attr('phototitle')) + '/' + encodeURIComponent($(this).attr('photodate')),
		success: function (result) {
		}
	});
});

function video_player(obj) {
	$('.v_modal').attr('style', 'display:block');
	var path = '#images#video#mp4#' + obj.attr('fname');
	var title = $(obj).attr('value');
	console.log(title);
	$.get('/index.php/Main/video_play/' + encodeURIComponent(path), function (data) {
		$('.v_modal-content').html(data);
		$('.v_video_title').html(title);
	});
	var modal = $('.v_modal');
	window.onclick = function (event) {
		if (event.target.className == modal.attr('class') || event.target.className == "shadow") {
			modal.attr('style', 'display:none;');
			$('.v_modal-content').html('');
			$('.v_video_title').html('');
		}
	}
}

$('.contents .vid_play').click(function () {
	video_player($(this));
});

$('.newsArticle').click(function () {
	$('.modal').css('background-color', 'rgb(121, 2, 2)');
});


$('.viewArticle').click(function () {
	$('.modal').css('background-color', 'rgb(0, 102,171)');
});

function topFunction1() {
	$('#modal_view').animate({scrollTop:'50px'});
    // document.getElementById("html, body").scrollTop = document.getElementById("html, body").scrollHeight;
}
function specialArticle(fname,fdate) {
	topFunction1();
	xtitle = [];
 	currentIdx = 0;
 	//$('.modal-title').html($(this).attr('value'));
	var date = fdate;
 	var sp = fdate.split('-');
	var path = 'periodic#news_daily#'+sp[0]+'#'+
				sp[1]+'#'+sp[2]+'#'+fname+'.htm';
	// if($(this).hasClass('polity')){
		$('.modal').css('background-color','rgb(121, 2, 2)');
	// }
	// else
		// $('.modal').css('background-color','rgb(0, 102,171)');
	$.get('/index.php/Main/genArticle/'+encodeURIComponent(path)+'/0/1',function(data){
		$('.modal-body').html(data);
		$('.modal-body').append('<div style="text-align:right; margin-right:40px; color:#ff7e00;">'+date+'</div>');
		if ($('.modal-body .img-thumbnail').length > 0)
		{
			$('.modal-body p').eq(0).after("<div class='mGallery' style=' display: inline-block; position:relative;'></div>");
			//<a href='javascript:zoomPhoto();' class='pp_expand'></a>
			$('.mGallery').append( $('.modal-body .img-thumbnail') );
		}

		if ($('.modal-body .img-thumbnail').length == 1){
			var sp = $('.modal-body .img-thumbnail').eq(0).attr('src').split('/');
			var sum_sp = sp[4]+'#'+sp[5]+'#'+sp[6]+'#'+sp[7];
			var sum_sp_a = ["2021#01#14#aaa21011401.jpg","2021#01#13#011.jpg","2021#01#15#aaa21011501.jpg","2021#01#15#aaa21011502.jpg","2021#01#17#aaa1-17-2.jpg","2021#01#17#aaa1-17-1.jpg","2021#01#17#aaa1-17-3.jpg", "2021#01#19#aaa2111901.jpg", "2021#01#19#aaa2111902.jpg", "2021#01#19#aaa2111903.jpg"];
			if ( sum_sp_a.indexOf(sum_sp) > -1 ){
				$('#modal_view').css('background-color', 'rgb(121, 2, 2)');
			}
			$.getJSON('/index.php/Main/isFolder/'+encodeURIComponent(sum_sp), {}, function(data){
				if(data!='no'){
					$('.modal-body .img-thumbnail').eq(0).remove();
					$('.modal-body p').eq(0).after(data);
					for (var i = 0; i < $('.modal-body .img-thumbnail').length; i ++)
					{
						$('.modal-body .img-thumbnail').eq(i)[0].removeAttribute('align');
						$('.modal-body .img-thumbnail').eq(i)[0].removeAttribute('onclick');
						$('.modal-body table').css('width','100%');
						var tmp = $('.modal-body .img-thumbnail').eq(i)[0].src;
						if (tmp.search('-0.jpg') == -1){
							var ipath = tmp;
							for (var j= 0; j < 11; j ++)
								 ipath = ipath.replace('/','#');
							$.getJSON('/index.php/Main/isExtension/'+encodeURIComponent(ipath)+'/'+i,{},function(pres){
									$('.modal-body .img-thumbnail').eq(pres[0])[0].src = pres[1];
							});
						}
						$('.modal-body .img-thumbnail').eq(i).click(function(){
							imgNext();
						});
					}
					if ($('.modal-body .img-thumbnail').length > 1)
					{
						for (var i = 1; i < $('.modal-body .img-thumbnail').length; i ++)
							$('.modal-body .img-thumbnail').eq(i).hide();
			
							html = "<div class='activities' style='margin:10px 0;'>";
							html += "<img style = 'cursor:pointer;' src='/assets/img/img_first.png' onclick='imgFirst()'/>";
							html += "<img style = 'cursor:pointer;margin-left:2px;' src='/assets/img/img_prev.png' onclick='imgPreve()'/>";
							html += "<aaa style = 'margin-left:7px;'>"+(currentIdx+1)+'/'+$('.modal-body .img-thumbnail').length+"</aaa>";
							html += "<img style = 'cursor:pointer;margin-left:7px;' src='/assets/img/img_next.png' onclick='imgNext()'/>";
							html += "<img style = 'cursor:pointer;margin-left:2px;' src='/assets/img/img_last.png' onclick='imgLast()'/>";
							html += "</div>";
							$('.modal-body p').eq(1).before(html);
					}
				}
				// $('#modal_view').modal();
			});
		}



		for (var i = 0; i < $('.modal-body .img-thumbnail').length; i ++)
		{
			$('.modal-body .img-thumbnail').eq(i)[0].removeAttribute('align');
			$('.modal-body .img-thumbnail').eq(i)[0].removeAttribute('onclick');
			$('.modal-body table').css('width','100%');
			var tmp = $('.modal-body .img-thumbnail').eq(i)[0].src;
			if (tmp.search('-0.jpg') == -1){
				var ipath = tmp;
				for (var j= 0; j < 11; j ++)
					 ipath = ipath.replace('/','#');
				$.getJSON('/index.php/Main/isExtension/'+encodeURIComponent(ipath)+'/'+i,{},function(pres){
						$('.modal-body .img-thumbnail').eq(pres[0])[0].src = pres[1];
						xtitle[pres[0]] = pres[2];
						$('.ftitle').html(xtitle[0] == undefined ? "" : xtitle[currentIdx]);
				});
			}
			$('.modal-body .img-thumbnail').eq(i).click(function(){
				imgNext();
			});
		}
		
		if ($('.modal-body .img-thumbnail').length > 1)
		{
			for (var i = 1; i < $('.modal-body .img-thumbnail').length; i ++)
				$('.modal-body .img-thumbnail').eq(i).hide();
			html = "<p class='ftitle' style='text-align:center!important;'></p><div class='activities' style='margin:10px 0;'>";
			html += "<img style = 'cursor:pointer;' src='/assets/img/img_first.png' onc`lick='imgFirst()'/>";
			html += "<img style = 'cursor:pointer;margin-left:2px;' src='/assets/img/img_prev.png' onclick='imgPreve()'/>";
			html += "<aaa style = 'margin-left:7px;'>"+(currentIdx+1)+'/'+$('.modal-body .img-thumbnail').length+"</aaa>";
			html += "<img style = 'cursor:pointer;margin-left:7px;' src='/assets/img/img_next.png' onclick='imgNext()'/>";
			html += "<img style = 'cursor:pointer;margin-left:2px;' src='/assets/img/img_last.png' onclick='imgLast()'/>";
			html += "</div>";
			$('.modal-body p').eq(1).before(html);
		}
		if ( $('.modal-body .img-thumbnail').length == 1)
		{
			$('.modal-body p').eq(1).before("<p class='ftitle'></p>");
		}
	});
}
