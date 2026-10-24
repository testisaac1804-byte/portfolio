var langTimeId;

(function($){
    $(document).ready(function(){
        $('.lang-panel').click(function(){
            clearTimeout(langTimeId);
            if ($('#lang_list').css("top") != "30px") {
                $('#lang_list').hide();
                $('#lang_list').css("top", "30px");
            }
            $('#lang_list').slideDown(250);
        }).mouseenter(function(){
            clearTimeout(langTimeId);
            if ($('#lang_list').css("top") != "30px") {
                $('#lang_list').hide();
                $('#lang_list').css("top", "30px");
            }
        }).mouseleave(function(){
            langTimeId = setTimeout(function(){
                //console.log('hide');
                $('#lang_list').hide();
            }, 300);
        });
        /*$('#lang_list a').click(function(){
            $('#lang').val( $(this).attr('rel') );
            $('#lang_form').submit();
        });*/
    });
})(jQuery);
