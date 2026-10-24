function go_forward(){
	var sVal = $('.flip').attr('srh_val');
	var chg_num = parseInt($('.chg_num').val())+1;
	if(chg_num<=parseInt($('.unchg_num').html())){
		$.ajax({
			url:'/index.php/Main/search_ajax/'+sVal+'/'+chg_num+'/'+$('#category').val(),
			//data:'sVal='+sVal+'&chg_num='+chg_num+'&sel_val='+$('#category').val(),
			success:function(data){
				$('.tb_content').html('');
				$('.tb_content').html(data);
				$('.chg_num').val(chg_num);
				$('#chg_num1').val(chg_num);
				append();
			}
		});
	}
}
function go_fastforward(){
	var sVal = $('.flip').attr('srh_val');
	var chg_num = parseInt($('.unchg_num').html());
	$.ajax({
		url:'/index.php/Main/search_ajax/'+sVal+'/'+chg_num+'/'+$('#category').val(),
		//data:'sVal='+sVal+'&chg_num='+chg_num+'&sel_val='+$('#category').val(),
		success:function(data){
			$('.tb_content').html('');
			$('.tb_content').html(data);
			$('.chg_num').val(chg_num);
			$('#chg_num1').val(chg_num);
			append();
		}
	});
}
function go_backward(){
	var sVal = $('.flip').attr('srh_val');
	var chg_num = parseInt($('.chg_num').val())-1;
	if(chg_num>=1){
		$.ajax({
			url:'/index.php/Main/search_ajax/'+sVal+'/'+chg_num+'/'+$('#category').val(),
			//data:'sVal='+sVal+'&chg_num='+chg_num+'&sel_val='+$('#category').val(),
			success:function(data){
				$('.tb_content').html('');
				$('.tb_content').html(data);
				$('.chg_num').val(chg_num);
				$('#chg_num1').val(chg_num);
				append();
			}
		});
	}
}
function go_fastbackward(){
	var sVal = $('.flip').attr('srh_val');
	var chg_num = 1;
	$.ajax({
		url:'/index.php/Main/search_ajax/'+sVal+'/'+chg_num+'/'+$('#category').val(),
		//data:'sVal='+sVal+'&chg_num='+chg_num+'&sel_val='+$('#category').val(),
		success:function(data){
			$('.tb_content').html('');
			$('.tb_content').html(data);
			$('.chg_num').val(chg_num);
			$('#chg_num1').val(chg_num);
			append();
		}
	});
}
function go_pg(e){
	if(e.keyCode==13){
		var sVal = $('.flip').attr('srh_val');
		var chg_num = parseInt($('.chg_num').val());
		if(chg_num>parseInt($('.unchg_num').html()))
			chg_num = parseInt($('.unchg_num').html());
		else if(chg_num<1)
			chg_num = 1;
		$.ajax({
			url:'/index.php/Main/search_ajax/'+sVal+'/'+chg_num+'/'+$('#category').val(),
			//data:'sVal='+sVal+'&chg_num='+chg_num+'&sel_val='+$('#category').val(),
			success:function(data){
				$('.tb_content').html('');
				$('.tb_content').html(data);
				$('.chg_num').val(chg_num);
				$('#chg_num1').val(chg_num);
				append();
			}
		});
	}
}
function go_pg1(e){
	if(e.keyCode==13){
		var sVal = $('.flip').attr('srh_val');
		var chg_num = parseInt($('#chg_num1').val());
		if(chg_num>parseInt($('.unchg_num').html()))
			chg_num = parseInt($('.unchg_num').html());
		else if(chg_num<1)
			chg_num = 1;
		$.ajax({
			url:'/index.php/Main/search_ajax/'+sVal+'/'+chg_num+'/'+$('#category').val(),
			//data:'sVal='+sVal+'&chg_num='+chg_num+'&sel_val='+$('#category').val(),
			success:function(data){
				$('.tb_content').html('');
				$('.tb_content').html(data);
				$('.chg_num').val(chg_num);
				$('#chg_num1').val(chg_num);
				append();
			}
		});
	}
}
$('#category').on('change', function(){
	try{
		var flip_scroll = $('.flip').attr('class');
	}catch(e){}
	if(flip_scroll!=null){
		$('.searchForm').submit();
	}	
});
$('.search_tr').click(function(){
	if($(this).attr('first_word')=='i'){
		window.open('/old/photo/?lang='+$(this).attr('language')+'&part='+$(this).attr('fname'),'_blank');
	}else if($(this).attr('first_word')=='v'){
		$(this).children(2).attr('data-target', '.m_modal');
		$('.m_modal').attr('style','display:block');
		var con = "";
		var path = $(this).attr('fname');
		$.get('/index.php/Main/video_play_search/'+encodeURIComponent(path),{},function(res){
			$('.m_modal-content').html(res);	
		});
		$('#m_caption').html($(this).attr('value'));
	
		var modal = $('.m_modal');
		$('.m_close').click(function(){
			modal.attr('style', 'display:none;');
		 	 $('.m_modal-content').html('');
		});
		/*window.onclick = function(event) {
			console.log(event);
		  if (event.srcElement.className == modal.attr('class') || event.srcElement.className == "m_close") {
			modal.attr('style', 'display:none;');
		  }
		  $('.m_modal-content').html('');
		}*/
	}else if($(this).attr('first_word')=='m'){
		$(this).children(2).attr('data-target', '.m_modal');
		$('.m_modal').attr('style','display:block');
		var con = "";
		var path = "#media#mp3#"+$(this).attr('fname');
		$.get('/index.php/Main/music_play/'+encodeURIComponent(path),{},function(res){
			$('.m_modal-content').html(res);	
		});
		$('#m_caption').html($(this).attr('value'));
	
		var modal = $('.m_modal');
		window.onclick = function(event) {
			console.log(event);
		  if (event.srcElement.className == modal.attr('class') || event.srcElement.className == "m_close") {
			modal.attr('style', 'display:none;');
		  }
		  $('.m_modal-content').html('');
		}
	}else if($(this).attr('first_word')=='a'){
		$(this).children(2).attr('data-target', '.m_modal');
		$('.m_modal').attr('style','display:block');
		var con = "";
		var path = $(this).attr('fname');
		$('.m_modal-content').html('<img src="/images/art/finearts/finearts/'+path+'.jpg" />');
		$('#m_caption').html($(this).attr('value'));
	
		var modal = $('.m_modal');
		window.onclick = function(event) {
			console.log(event);
		  if (event.srcElement.className == modal.attr('class') || event.srcElement.className == "m_close") {
			modal.attr('style', 'display:none;');
		  }
		}
	}else{
		currentIdx = 0;
		$('.modal-title').html('');
		$(this).children(2).attr('data-toggle', 'modal');
		$(this).children(2).attr('data-target', '#modal_view');
		var kind_article =   $(this).attr('table_name');
		var sp = $(this).attr('artdate').split('-');
		var path = 'periodic#news_daily#'+sp[0]+'#'+
					sp[1]+'#'+sp[2]+'#'+$(this).attr('fname')+'.htm';
		$.get('/index.php/Main/genArticle/'+encodeURIComponent(path)+'/0/1',function(data){
			$('.modal-body').html(data);
			$('.modal-body p').eq(0).after($('.modal-body .img-thumbnail'));
			if ($('.modal-body .img-thumbnail').length == 1){
				var sp = $('.modal-body .img-thumbnail').eq(0).attr('src').split('/');
				var sum_sp = sp[4]+'#'+sp[5]+'#'+sp[6]+'#'+sp[7];
				var page = "isFolder";
				if(kind_article=="News_LeaderAction_Article"){
					page = "isFolderActivity";
				}
				$.getJSON('/index.php/Main/'+page+'/'+encodeURIComponent(sum_sp), {}, function(data){
					if(data!='no'){
						$('.modal-body .img-thumbnail').eq(0).remove();
						$('.modal-body p').eq(0).after(data);
						if(kind_article=="News_LeaderAction_Article"){
							$('.modal-body .img-thumbnail').addClass('img-activity');
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
					else {
						if(kind_article=="News_LeaderAction_Article"){
							$('.modal-body .img-thumbnail').addClass('img-activity');
						}
					}
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
		});
	}
});
function PJHFunction(data,i) {
	// data = data.
	// data = data.replace(/<.*?>/g, "");
	$('.search_tr').eq(i).find('.tt').append(data);
	if($('.search_tr').attr('language')=='ar'){
		$('.tt img').css('float', 'right');
		$('.tt').css('padding-right', '8px');
	}
}
function append(){
	for(var i=0; i<15; i++){
		if($('.search_tr').eq(i).attr('first_word')!='i' && $('.search_tr').eq(i).attr('first_word')!='v' &&
			$('.search_tr').eq(i).attr('first_word')!='m' && $('.search_tr').eq(i).attr('first_word')!='a'){
			var sp = $('.search_tr').eq(i).attr('artdate').split('-');
				path = 'periodic#news_daily#'+sp[0]+'#'+
							sp[1]+'#'+sp[2]+'#'+$('.search_tr').eq(i).attr('fname')+'.htm';
			var srh = $(".flip").attr("srh_val");
				switch(i){
					case 0:
						$.ajax({
							url:'/index.php/Main/commongenArticle/'+encodeURIComponent(path)+'/3/1/'+encodeURIComponent(srh),
							success:function(data){
								PJHFunction(data,0);
							}
						});
						break;
					case 1:
						$.ajax({
							url:'/index.php/Main/commongenArticle/'+encodeURIComponent(path)+'/3/1/'+encodeURIComponent(srh),
							success:function(data){
								PJHFunction(data,1);
							}
						});
						break;
					case 2:
						$.ajax({
							url:'/index.php/Main/commongenArticle/'+encodeURIComponent(path)+'/3/1/'+encodeURIComponent(srh),
							success:function(data){
								PJHFunction(data,2);
							}
						});
						break;
					case 3:
						$.ajax({
							url:'/index.php/Main/commongenArticle/'+encodeURIComponent(path)+'/3/1/'+encodeURIComponent(srh),
							success:function(data){
								PJHFunction(data,3);
							}
						});
						break;
					case 4:
						$.ajax({
							url:'/index.php/Main/commongenArticle/'+encodeURIComponent(path)+'/3/1/'+encodeURIComponent(srh),
							success:function(data){
								PJHFunction(data,4);
							}
						});
						break;
					case 5:
						$.ajax({
							url:'/index.php/Main/commongenArticle/'+encodeURIComponent(path)+'/3/1/'+encodeURIComponent(srh),
							success:function(data){
								PJHFunction(data,5);
							}
						});
						break;
					case 6:
						$.ajax({
							url:'/index.php/Main/commongenArticle/'+encodeURIComponent(path)+'/3/1/'+encodeURIComponent(srh),
							success:function(data){
								PJHFunction(data,6);
							}
						});
						break;
					case 7:
						$.ajax({
							url:'/index.php/Main/commongenArticle/'+encodeURIComponent(path)+'/3/1/'+encodeURIComponent(srh),
							success:function(data){
								PJHFunction(data,7);
							}
						});
						break;
					case 8:
						$.ajax({
							url:'/index.php/Main/commongenArticle/'+encodeURIComponent(path)+'/3/1/'+encodeURIComponent(srh),
							success:function(data){
								PJHFunction(data,8);
							}
						});
						break;
					case 9:
						$.ajax({
							url:'/index.php/Main/commongenArticle/'+encodeURIComponent(path)+'/3/1/'+encodeURIComponent(srh),
							success:function(data){
								PJHFunction(data,9);
							}
						});
						break;
					case 10:
						$.ajax({
							url:'/index.php/Main/commongenArticle/'+encodeURIComponent(path)+'/3/1/'+encodeURIComponent(srh),
							success:function(data){
								PJHFunction(data,10);
							}
						});
						break;
					case 11:
						$.ajax({
							url:'/index.php/Main/commongenArticle/'+encodeURIComponent(path)+'/3/1/'+encodeURIComponent(srh),
							success:function(data){
								PJHFunction(data,11);
							}
						});
						break;
					case 12:
						$.ajax({
							url:'/index.php/Main/commongenArticle/'+encodeURIComponent(path)+'/3/1/'+encodeURIComponent(srh),
							success:function(data){
								PJHFunction(data,12);
							}
						});
						break;
					case 13:
						$.ajax({
							url:'/index.php/Main/commongenArticle/'+encodeURIComponent(path)+'/3/1/'+encodeURIComponent(srh),
							success:function(data){
								PJHFunction(data,13);
							}
						});
						break;
					case 14:
						$.ajax({
							url:'/index.php/Main/commongenArticle/'+encodeURIComponent(path)+'/3/1/'+encodeURIComponent(srh),
							success:function(data){
								PJHFunction(data,14);
							}
						});
						break;
				}
			
		}
	}
}

function imgNext()
{
	$('.modal-body .img-thumbnail').eq(currentIdx).hide();
	currentIdx ++;
	if ( currentIdx > $('.modal-body .img-thumbnail').length - 1)
		currentIdx = 0;
	$('.modal-body .img-thumbnail').eq(currentIdx).show();
	$('.modal-body aaa').html((currentIdx+1)+'/'+$('.modal-body .img-thumbnail').length);
}

function imgPreve()
{
	$('.modal-body .img-thumbnail').eq(currentIdx).hide();
	currentIdx --;
	if ( currentIdx < 0)
		currentIdx = $('.modal-body .img-thumbnail').length - 1;
	$('.modal-body .img-thumbnail').eq(currentIdx).show();
	$('.modal-body aaa').html((currentIdx+1)+'/'+$('.modal-body .img-thumbnail').length);
}

function imgFirst()
{
	$('.modal-body .img-thumbnail').eq(currentIdx).hide();
	currentIdx = 0;
	$('.modal-body .img-thumbnail').eq(currentIdx).show();
	$('.modal-body aaa').html((currentIdx+1)+'/'+$('.modal-body .img-thumbnail').length);
}

function imgLast()
{
	$('.modal-body .img-thumbnail').eq(currentIdx).hide();
	currentIdx = $('.modal-body .img-thumbnail').length - 1;
	$('.modal-body .img-thumbnail').eq(currentIdx).show();
	$('.modal-body aaa').html((currentIdx+1)+'/'+$('.modal-body .img-thumbnail').length);
}

// When the user clicks on the button, scroll to the top of the document
function topFunction() {
    if (this.hash !== "") {
      event.preventDefault();
      var hash = this.hash;
      $('html, body').animate({scrollTop: 0}, 1, function(){
			window.location.hash = hash;
      });
    }
}
window.onscroll = function() 
{
	scrollFunction()
};

function scrollFunction() {
    if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
        document.getElementById("toTop").style.display = "block";
    } else {
        document.getElementById("toTop").style.display = "none";
    }
}