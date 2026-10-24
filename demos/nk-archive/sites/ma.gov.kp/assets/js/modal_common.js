$(document).ready(function() {

    $("#modal-1").on('hide.bs.modal', function() {
        var svideo = document.getElementById("modal_video");
        if (svideo == undefined)
            return;
        else
            pauseVideo(svideo);
    });

});

function getBlog(url) {

    $.getJSON(url, function(data) {

        $('.modal-title').html(data.title);
        $('.modal-body').html(data.content);

        $('.modal-body').addClass('body-style');
        $('.modal-header').addClass('title-style');
        $('#modal-1').modal();
    });
}

function playVideo(url, title) {

    $('.modal-title').html(title);
    var video_body = '<video id="modal_video" width="100%" height="100%" controls autoplay>' +
        '<source src="' + url + '" type="video/mp4">' +
        'Your browser does not support the video tag.' +
        '</video>';
    $('.modal-body').addClass('body_video_style');
    $('.body_video_style').removeClass('.modal-body');
    $('.modal-body').html(video_body);
    $('.modal-header').addClass('title-style');
    $('#modal-1').modal();
}

function pauseVideo(video) {
    video.pause();
}