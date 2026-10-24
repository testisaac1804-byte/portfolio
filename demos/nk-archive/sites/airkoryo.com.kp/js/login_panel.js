var _login_panel_clicked = false;
(function($){
    $(document).ready(function(){
        $('#login_panel').click(function(){
            _login_panel_clicked = true;
        });
        $('body').click(function(){
            $('#lang_list').hide();
            if (_login_panel_clicked == true) {
                _login_panel_clicked = false;
                return;
            }
            $('#login_panel').slideUp(400);
        });
    });
})(jQuery);
