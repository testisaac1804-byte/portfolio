$(document).ready(function(){
    
    // yamm menu
    $(document).on('click', '.yamm .dropdown-menu', function(e) {
        e.stopPropagation();
    })

    $("input").focusin(function(){
        $(this).addClass("input-focus");
        $(this).parent().siblings(".submits").find("button").addClass("input-focus");
    });
    $("input").focusout(function(){
        $(this).removeClass("input-focus");
        $(this).parent().siblings(".submits").find("button").removeClass("input-focus");
    });
    $('ul.dropdown-menu [data-toggle=dropdown]').on('click', function(event) {
        event.preventDefault(); 
        event.stopPropagation(); 
        $(this).parent().siblings().removeClass('open');
        $(this).parent().toggleClass('open');
    });
    
    //tootltip
    $('[data-toggle="tooltip"]').tooltip();
    
    //Popover
    $('[data-toggle="popover"]').popover();
    
    //back to top
    $('body').append('<a href="javascript:void(0);" id="back-to-top"><img src="'+getUrlAssets("/asset/img/up.png")+'" style="width:40px; height:40px"></a>');
    
    $(window).scroll(function() {
        if ($(this).scrollTop() >= 200) {
            $('#back-to-top').fadeIn(200);
        } else {
            $('#back-to-top').fadeOut(200);
        }
    });
    $('#back-to-top').click(function() {
        $('body,html').animate({
            scrollTop : 0
        }, 500);
    });

    $('#search-form, #search-form-mobile').submit(function(e){
        var s = $(this).find('input').val();
        $(this).find('input[name="keyword"]').val(s.replace(/[\@\%\_\=\:\;\/\'\"\~\!\&\[\]\{\}\(\)\*\+<>\?\.\,\\\^\$\|#《》]/g, ''));
        if($(this).find('input').val().trim() == "") {
            e.preventDefault();
        }
    });
    
});

function getUrl( uriStr ){
   return $("#host").val() + "/index.php" + uriStr + "?lang=" + $("#lang").val();
    // return $("#host").val() + "index.php/" + uriStr + "?lang=" + $("#lang").val(); // modi at 20231017
}
function getUrlAssets( uriStr ){
   return $("#host").val() + "/" + uriStr;
    // return $("#host").val() + uriStr; // modi at 20231017
}

function initSlimScroll(el){
    $(el).each(function () {
        if ($(this).attr("data-initialized")) {
            return; // exit
        }
        var height;
        if ($(this).attr("data-height")) {
            height = $(this).attr("data-height");
        } else {
            height = $(this).css('height');
        }

        $(this).slimScroll({
            allowPageScroll: true, // allow page scroll when the element scroll is ended
            size: '7px',
            color: ($(this).attr("data-handle-color")  ? $(this).attr("data-handle-color") : '#bbb'),
            wrapperClass: ($(this).attr("data-wrapper-class")  ? $(this).attr("data-wrapper-class") : 'slimScrollDiv'),
            railColor: ($(this).attr("data-rail-color")  ? $(this).attr("data-rail-color") : '#eaeaea'),
            position: false ? 'left' : 'right',
            height: height,
            alwaysVisible: ($(this).attr("data-always-visible") == "1" ? true : false),
            railVisible: ($(this).attr("data-rail-visible") == "1" ? true : false),
            disableFadeOut: true
        });
        $(this).attr("data-initialized", "1");
    });
}

var proStr = $(".goods-list").html();
$(".goods-list").html(protectHonoredText((proStr!=undefined)?proStr:""));

proStr = $(".goods-detail").html();
$(".goods-detail").html(protectHonoredText((proStr!=undefined)?proStr:""));

function alizerCount(hUrl, hTitle, hType) {
    $.ajax({
        type: 'GET',
        url: getUrl("/home/alizer_ajax"),
        data: {
            hUrl: hUrl,
            hTitle: hTitle,
            hType: hType
        },
        success: function(data) {
            
        }
    });
}