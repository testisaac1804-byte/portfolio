$(function(){
	// $('.revs .list-tr').click(function(){location.href='/index.php/revs/'+$(this).attr('lng')+'/view/'+$(this).attr('idx')+'/'+$(this).attr('page');});
	// $('.elibs .list-tr').click(function(){location.href='/index.php/'+$(this).attr('lng')+'/elibs/view/'+$(this).attr('idx')+'/'+$(this).attr('page');});
	// $('.articles .list-tr').click(function(){location.href='/index.php/'+$(this).attr('lng')+'/articles/view/'+$(this).attr('idx')+'/'+$(this).attr('page');});
	// $('.photo .list-tr').click(function(){location.href='/index.php/'+$(this).attr('lng')+'/media/view/'+$(this).attr('idx')+'/'+$(this).attr('page');});
	// $('.video .list-tr').click(function(){location.href='/index.php/'+$(this).attr('lng')+'/media/view/'+$(this).attr('idx')+'/'+$(this).attr('page');});
	// $('.elibs_right_banner .list-tr').click(function(){location.href='/index.php/'+$(this).attr('lng')+'/elibs/view/'+$(this).attr('idx');});
	// $('.articles_right_banner .list-tr').click(function(){location.href='/index.php/'+$(this).attr('lng')+'/articles/view/'+$(this).attr('idx');});
	// // $('ul.userdata.page-table .page-td-info').click(function(){location.href='/index.php/ud/view/'+$(this).attr('idx');});
	// // $('ul.userdata.page-table .page-td-info-full').click(function(){location.href='/index.php/ud/view/'+$(this).attr('idx');});
	// $('.userdata .list-tr').click(function(){location.href='/index.php/'+$(this).attr('lng')+'/ud/view/'+$(this).attr('idx')+'/'+$(this).attr('page');});
	// $('ul.users.page-table .page-tr').click(function(){location.href='/index.php/users/view/'+$(this).attr('idx');});
	// $('ul.pices.page-table .page-tr').click(function(){location.href='/index.php/pices/view/'+$(this).attr('idx');});
	// $('#revs-home h3, #revs-home-copy h3').click(function(){location.href='/index.php/'+$(this).attr('lng')+'/revs/';});
	// $('#articles-home h3').click(function(){location.href='/index.php/'+$(this).attr('lng')+'/articles/';});
	// $('#elibs-home h3').click(function(){location.href='/index.php/elibs/';});
	$('#menu-home-revs').click(function(){$top=$('#page-head').position().top;$('html, body').animate({'scrollTop':$top-200},'slow');});
	$('#menu-home-elibs').click(function(){$top=$('#elibs-home').position().top;$('html, body').animate({'scrollTop':$top-150},'slow');});
	$('#menu-home-articles').click(function(){$top=$('#articles-home').position().top;$('html, body').animate({'scrollTop':$top-150},'slow');});
	$('#menu-home-photo').click(function(){$top=$('#photos-home').position().top;$('html, body').animate({'scrollTop':$top-150},'slow');});
	$('#menu-home-video').click(function(){$top=$('#videos-home').position().top;$('html, body').animate({'scrollTop':$top-150},'slow');});
	procView();$(window).resize(resize_proc);$(window).load(onload_proc);
	if($('#news-bar').flexslider != undefined)$('#news-bar').flexslider({animation:"slide",slideshowSpeed:3000,direction:"vertical",controlNav:false,directionNav:false,});
	if($('#org-banner').flexslider != undefined)$('#org-banner').flexslider({animation:"fade",slideshowSpeed:4000,controlNav:false,directionNav:false,});
	if($('#main-board').flexslider != undefined)$('#main-board').flexslider({animation:"fade",slideshowSpeed:5000,controlNav:false,directionNav:false,});
	if($('.art-pts').flexslider != undefined)$('.art-pts').flexslider({animation:"fade",slideshowSpeed:5000,controlNav:false,directionNav:false,});
	// if($('.page-logo').flexslider != undefined)$('.page-logo').flexslider({animation:"fade",slideshowSpeed:5000,controlNav:false,directionNav:false,});
	if($('.page-logo-toggler').flexslider != undefined)$('.page-logo-toggler').flexslider({animation:"fade",slideshowSpeed:5000,controlNav:false,directionNav:false,});
	$('.detail-articles .detail-td-content img').click(function(){$title=$(this).parents('.detail-articles').find('.detail-td-title').html();viewPhoto($title,'',$(this).attr('src'),1,1);});

	oncontextmenu = function() {return false;}

});
function viewPhoto($cap,$subcap,$path,$ptn,$cur){$('#backboard').css({'position':'fixed','top':'0','left':'0','z-index':'10000','background':'black','opacity':'0.9'});$('#image-gallery').css({'position':'fixed','top':'0','left':'0',});$('#backboard, #image-gallery').fadeIn('slow');$pp=$path.split('.');$fname=$pp[0];$ext=$pp[1];var images=[];for($i=0;$i<$ptn;$i++){$image=[];$pp=$i==0?'.':'-'+$i+'.';$image['big']=$image['small']=$fname+$pp+$ext;images[$i]=$image;}$ss='all;'+$subcap;var $sub_title=$ss.split(';');var curImageIdx=$cur,total=images.length;var wrapper=$('#image-gallery'),curSpan=wrapper.find('.current'),sub_title=wrapper.find('.sub-title');var viewer=ImageViewer(wrapper.find('.image-container'));wrapper.find('.total').html(total);wrapper.find('.title').html($cap);function showImage(){var imgObj=images[curImageIdx-1];viewer.load(imgObj.small,imgObj.big);curSpan.html(curImageIdx);sub_title.html($sub_title[curImageIdx]);}wrapper.find('.next').click(function(){curImageIdx++;if(curImageIdx>total)curImageIdx=1;showImage();});wrapper.find('.prev').click(function(){curImageIdx--;if(curImageIdx<0)curImageIdx=total;showImage();});wrapper.find('.btn-close').click(function(){$('#backboard, #image-gallery').fadeOut();});showImage();}
function viewVideo($cap,$path,$ratio){$viewer=$('#video-pad');$bg=$('#backboard');$video=$('#video-tag');$viewer.find('source').attr('src',$path);$bg.css({'position':'fixed','top':'0','left':'0','z-index':'10000','background':'black','opacity':'0.9'});$bg.fadeIn('slow');$viewer.fadeIn('slow');$video[0].load();if($(window).height()<$video.height()+60){$video.height($(window).height());$hi=0;}else{$hi=($(window).height()-$video.height()-60)/2;}$viewer.css({'top': $hi+'px'});$viewer.find('.btn-close').click(function(){$video[0].pause();$('#backboard, #video-pad').fadeOut();});}
function SecureContext_encypher(anperm){var strEncyph='';var nCols=anperm.length;var nRows=this.strText.length/nCols;for(var i=0;i<nCols;i++){var k=anperm[i];for(var j=0;j<nRows;j++){strEncyph+=this.strText.charAt(k);k+=nCols;}}this.strText=strEncyph;}function SecureContext_sign(nCols){if(this.bESCApE){this.strText=this.escape(this.strText);this.strSIGNATURE=this.escape(this.strSIGNATURE);}var nTextLen=this.strText.length+this.strSIGNATURE.length;var nMissingCols=nCols-(nTextLen%nCols);var strpadding='';if(nMissingCols<nCols)for(var i=0;i<nMissingCols;i++)strpadding+=' ';var x=this.strText.length;this.strText+=strpadding+this.strSIGNATURE;}function SecureContext_secure(strpasswd){var passwd=new password(strpasswd);var anperm=passwd.getpermutation();this.sign(anperm.length);this.transliterate(true);this.encypher(anperm);}function SecureContext_transliterate(btransliterate){var strDest='';var nTextIter=0;var nTexttrail=0;while(nTextIter<this.strText.length){var strRun='';var cSkipped=0;while(cSkipped<7&&nTextIter<this.strText.length){var chT=this.strText.charAt(nTextIter++);if(-1==strRun.indexOf(chT)){strRun+=chT;cSkipped=0;}else cSkipped++;}while(nTexttrail<nTextIter){var nRunIdx=strRun.indexOf(this.strText.charAt(nTexttrail++));if(btransliterate){nRunIdx++;if(nRunIdx==strRun.length)nRunIdx=0;}else{nRunIdx--;if(nRunIdx==-1)nRunIdx+=strRun.length;}strDest+=strRun.charAt(nRunIdx);}}this.strText=strDest;}function permutationGenerator_fromCycle(anCycle){var anpermutation=new Array(this.nNumElements);for(var i=0;i<this.nNumElements;i++)anpermutation[i]=i;for(var i=0;i<anCycle.length;i++){var nT=this.antranspositions[anCycle[i]];var n1=nT&255;var n2=(nT>>8)&255;nT=anpermutation[n1];anpermutation[n1]=anpermutation[n2];anpermutation[n2]=nT;}return anpermutation;}function password_getHashValue(){var m=907633409;var a=65599;var h=0;for(var i=0;i<this.strpasswd.length;i++)h=(h%m)*a+this.strpasswd.charCodeAt(i);return h;}function permutationGenerator(nNumElements){this.nNumElements=nNumElements;this.antranspositions=new Array;var k=0;for(i=0;i<nNumElements-1;i++)for(j=i+1;j<nNumElements;j++)this.antranspositions[k++]=(i<<8)|j;this.nNumtranspositions=k;this.fromCycle=permutationGenerator_fromCycle;}function password_getpermutation(){var nNUMELEMENTS=13;var nCYCLELENGTH=21;pg=new permutationGenerator(nNUMELEMENTS);pgn=pg.nNumtranspositions;var anCycle=new Array(nCYCLELENGTH);var npred=this.getHashValue();for(var i=0;i<nCYCLELENGTH;i++){eb=npred%pgn;ec=907633409%pgn;npred=314159269*eb+ec;npred=anCycle[i]=npred%pgn;}return pg.fromCycle(anCycle);}function password(strpasswd){this.strpasswd=strpasswd;this.getHashValue=password_getHashValue;this.getpermutation=password_getpermutation;}function SecureContext(strText,strSignature,bEscape){this.strSIGNATURE=strSignature||'';this.bESCApE=bEscape||false;this.strText=strText;this.transliterate=SecureContext_transliterate;this.encypher=SecureContext_encypher;this.sign=SecureContext_sign;this.secure=SecureContext_secure;}function doSecure(){var sc=new SecureContext(document.getElementById('pswd').value,document.getElementById('msign').value);sc.secure(document.getElementById('mkey').value);return sc.strText;}
function str2hex($str){var len = $str.length;if(len==0)return '';var $hex='',s;for(i=0; i<len; i++){s=$str.charCodeAt(i);$hex+=s.toString(16);}return $hex;}

function login(){var elem=document.getElementById('p');var pswd=elem.value;var msign='{(abcdefghijklmnopqrstuvwxyz!@#$%^&0123456789)}';var sc=new SecureContext(pswd,msign);sc.secure(document.getElementById('mk').value);document.getElementById('hp').value=str2hex(sc.strText);document.getElementById('p').value='********';}
// function login_path(){document.getElementById('orgin_form').setAttribute('action','/index.php/ul/'+document.getElementById('mk').value+'/'+str2hex(document.getElementById('u').value)+'/'+str2hex(document.getElementById('p').value));document.getElementById('u').value='';document.getElementById('p').value='';}
// function login_path_enc(){var elem=document.getElementById('p');var pswd=elem.value;var msign='{(abcdefghijklmnopqrstuvwxyz!@#$%^&0123456789)}';var sc=new SecureContext(pswd,msign);sc.secure(document.getElementById('mk').value);document.getElementById('orgin_form').setAttribute('action','/index.php/ul/'+document.getElementById('mk').value+'/'+str2hex(document.getElementById('u').value)+'/'+str2hex('********')+'/'+str2hex(sc.strText));document.getElementById('u').value='';document.getElementById('p').value='';}
// function regist(){var elem=document.getElementById('p1');var pswd=elem.value;var msign='{(abcdefghijklmnopqrstuvwxyz!@#$%^&0123456789)}';var sc=new SecureContext(pswd,msign);sc.secure(document.getElementById('mk').value);document.getElementById('hp1').value=str2hex(sc.strText);document.getElementById('rp1').value='********';document.getElementById('p1').value='********';}
// function change_password(){var elem=document.getElementById('p');var pswd=elem.value;var msign='{(abcdefghijklmnopqrstuvwxyz!@#$%^&0123456789)}';var sc=new SecureContext(pswd,msign);sc.secure(document.getElementById('mk').value);document.getElementById('hp').value=str2hex(sc.strText);document.getElementById('p').value='********';elem=document.getElementById('op');pswd=elem.value;sc=new SecureContext(pswd,msign);sc.secure(document.getElementById('mk').value);document.getElementById('hop').value=str2hex(sc.strText);document.getElementById('op').value='********';document.getElementById('rp').value='********';}
// function add_score(){var elem=document.getElementById('p');var pswd=elem.value;var msign='{(abcdefghijklmnopqrstuvwxyz!@#$%^&0123456789)}';var sc=new SecureContext(pswd,msign);sc.secure(document.getElementById('mk').value);document.getElementById('hp').value=str2hex(sc.strText);document.getElementById('p').value='********';}

function onload_proc(){$('#news-bar .slides').show(); $('#org-banner .slides').show(); $('#spec_art').show();}
function resize_proc(){procView();}
function procView(){
	$wwd=$(window).width();$whi=$(window).height();
	$mwd=$('#menu-home').width();$left=($wwd-$mwd)/2;$('#menu-home').css('left',$left+'px');

	$(".cbp-caption-defaultWrap img").each(
		function(n){$(this).height($(this).width()*0.66);},
		$('.page-tile').css('display','inline-block'));

	$(".media-td-cover-cap-video").each(function(n){
		$(this).css('left',($(this).parent('div').width()-$(this).width())/2);
		$(this).css('top',($(this).parent('div').height()-$(this).height())/2);});

	$("#photos-home #main-board .photos-board-image").height($("#photos-home #main-board .photos-board-image").width());
	$("#photos-home #main-board .photos-board-image img").css('max-height',$("#photos-home #main-board .photos-board-image img").width());
	
	
	$vwd = $wwd;if($vwd>1024)$vwd=1024;if($vwd<320)$vwd=320;$lwd=($(window).width()-$vwd)/2;
	if($lwd<0)$lwd=0;$('#video-pad').css('left',$lwd);
	$('#video-pad').css('width',$vwd);
	$('#video-pad').css('height',$whi);

	$hi_header=$('div.page-header').height();
	$hi_breadcrumb=$('ul.page-breadcrumb').height();
	$hi_prefooter=$('div.page-prefooter').height()+60;
	$hi_footer=$('div.page-footer').height()+34;
	$('.no-detail-data').height($whi-$hi_header-$hi_breadcrumb-$hi_prefooter-$hi_footer-101);}

function downUserdata($id,$key,$rd,$token)
{
	var $price, $apprs;
	//사용자가 이미 구입한 자료인지 확인
	$.ajax({ type: 'GET', url: '/index.php/ajax/pur/'+$id, data: { token: $token },	success: function($result)
	{
		if($result=='**HACK**'){alert('Invalid action!!!');return;}

		if($result == 'TRUE')
		{ //이미 구입하였으면 내리적재
		 	location.href = "/index.php/ud/down/"+$id+"/"+$key+"/"+$rd+"/"+$token;
		}
		else
		{	
			//사용자 신용점수와 자료점수 비교
			$.ajax({ type: 'GET', url: '/index.php/ajax/apprs', data: { token: $token }, success: function($result)
			{
				if($result=='**HACK**'){alert('Invalid action!!!');return;}

				$apprs = parseInt($result);

				$.ajax({ type: 'GET', url: '/index.php/ajax/pri/'+$id, data: { token: $token },	success: function($result)
				{
					if($result=='**HACK**'){alert('Invalid action!!!');return;}

					$price = parseInt($result);

				 	if($apprs < $price)
				 	{
				 		if(confirm($app_lang['a_apprs_price']))
			 			{
			 				// 신용점수관련 사용설명서를 down
							location.href = "/index.php/download/"+$rd+"/"+$token;
			 			}
				 	} else if($price > 0){ //가격이 있으면 구입의지 확인
				 		if(confirm($app_lang['a_alert_price'] + $price))
			 			{
			 				//자료내리적재
						 	location.href = "/index.php/ud/down/"+$id+"/"+$key+"/"+$rd+"/"+$token;
			 			}
				 	} else { //무료면 자료내리적재
					 	location.href = "/index.php/ud/down/"+$id+"/"+$key+"/"+$rd+"/"+$token;
				 	}
				}});
			}});
		}
	}});
}
