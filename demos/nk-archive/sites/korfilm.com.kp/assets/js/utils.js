$(function() {
    toastr.options = {
        "closeButton": true,
        "debug": false,
        "positionClass": "toast-top-right",
        "onclick": null,
        "showDuration": "500",
        "hideDuration": "500",
        "timeOut": "2000",
        "extendedTimeOut": "1000",
        "showEasing": "swing",
        "hideEasing": "linear",
        "showMethod": "fadeIn",
        "hideMethod": "fadeOut"
    }
});

$(document).ready(function(){

    //////////////////////////////////////////////////////////////
    // Scroll처리
    //////////////////////////////////////////////////////////////
    $(window).scroll(function () {
        var $top = $(window).scrollTop(); // current vertical position

        var $height = $("#left-menu-container .left-menu").height();
        var $containerHeight = $("#intro-container").height();

        if (($top + $height) < $containerHeight)
            $("#left-menu-container .left-menu").css("top", $top + 'px');
    });

});
