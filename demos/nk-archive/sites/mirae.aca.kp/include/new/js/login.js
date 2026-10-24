/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

function show_result(id) {
    var t, l, w, h;
    w = 1100;
    h = 650;
    t = ($(window).height() - h) / 2;
    l = ($(window).width() - w) / 2;
    window.open(site_url + 'Re_mr_searchwork/sh_mr_owData/' + id, '상세자료', 'width=' + w + ',height=' + h + ',top=' + t + ',left=' + l + ',scrollbars=yes,menubar=no,directories=no,location=no,status=0,resizable=no');
//    $.ajax({
//        url: site_url + 'front/getOneData/' + id,
//        dataType: 'json'
//    }).done(function (data) {
//        $('#ntitle').html(data['title']);
//        if (Ext.isEmpty(data['txt'])) {
//            $('#nbody').html('<iframe src="' + site_url + 'front/downfile/' + id + '" style="width:100%;height:90%" ></iframe>');
//        }
//        else {
//            $('#nbody').html(data['txt']);
//        }
//        $('#notice_view').modal({width: 800, height: 300});
//    });
}
function show_rs_picture(id) {
    var t, l, w, h;
    w = 1100;
    h = 650;
    t = ($(window).height() - h) / 2;
    l = ($(window).width() - w) / 2;
    window.open(site_url + 'front/sh_mr_owPicture/' + id, '화상자료', 'width=' + w + ',height=' + h + ',top=' + t + ',left=' + l + ',scrollbars=yes,menubar=no,directories=no,location=no,status=0,resizable=no');
}
function show_rs_video(id) {
    var t, l, w, h;
    w = 1100;
    h = 650;
    t = ($(window).height() - h) / 2;
    l = ($(window).width() - w) / 2;
    window.open(site_url + 'front/sh_mr_owVideo/' + id, '동영상자료', 'width=' + w + ',height=' + h + ',top=' + t + ',left=' + l + ',scrollbars=yes,menubar=no,directories=no,location=no,status=0,resizable=no');
}
$(document).ready(function () {
    $(window).scroll(function () {
        if ($(window).scrollTop() > 60) {
            $(".header-menu").addClass("fixbar");
//            $("body").addClass("page-on-scroll");
        } else {
            $(".header-menu").removeClass("fixbar");
//            $("body").removeClass("page-on-scroll");
        }
    });
//    $('#jscroll').jcarousel({
//        vertical: true,       
//        size: 2,
//        auto: 1,
//        wrap: 'circular',
//        animation: 1000
//    });

});

