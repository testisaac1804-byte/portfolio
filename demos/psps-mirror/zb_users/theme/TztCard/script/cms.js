/* 原创QQ：726662013，请勿删除 */

function tzt_dialog(id) {
	let $dialog = $("#"+id);
	$dialog.addClass('show');
	$('.mask').show();
	$('.dialogclose,.mask').on('click', function() {
		$dialog.removeClass('show');
		$('.mask').hide();
	});
}

function comment_reply(id,name) {
	let $id = id;
	let $frm = $('#divCommentPost');
	let $val =  $("#txaArticle");
	$("#inpRevID").val($id);
	$("#DialogComment").addClass('show');
	$('#comment-box').before($frm);
	$("#cancel-reply,.mask").show();
	if(name){
		$val.focus().val("@"+name);
	}
	$('#cancel-reply,.mask,.submit').click(function() {
	  $("#inpRevID").val(0);
	  $("#DialogComment").removeClass('show');
	  $('#comment-post').before($frm);
	  $('#cancel-reply,.mask').hide();
	  $("#cmt"+$id).css("background-color","#fef5e1");
	  $val.val("");
	});
}

$(function(){

	$('.qrcode').qrcode({render: 'image', size: 240, text: location.href});

	$(".tzt-nav-menu li a").each(function() {
		if(this.href==document.location.toString().split("#")[0]){$(this).parent("li").addClass("active");return false;}
	});

	$scrollTopLink = $("a.backtop");
	$(window).scroll(function() {
		500 < $(this).scrollTop() ? $scrollTopLink.css("display", "") : $scrollTopLink.css("display", "none");
	});
	$scrollTopLink.on("click", function() {
		$("html, body").animate({
			scrollTop: 0
		}, 400);
		return true;
	});
});

