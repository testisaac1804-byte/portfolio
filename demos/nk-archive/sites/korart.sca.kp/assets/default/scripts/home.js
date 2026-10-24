(function($) {
  // if (id > 0 && start < current && end > current) text_show(id);
})(jQuery);

function my_round(number, precision) {
  var factor = Math.pow(10, precision);
  var tempNumber = number * factor;
  var roundedTempNumber = Math.round(tempNumber);
  return roundedTempNumber / factor;
}

function video_show(id) {
  $.ajax({
    type: "GET",
    url: site_url_other + "index.php/home/select_video",
    data: {
      article_id: id
    },
    dataType: "json",
    success: function(data) {
      $(".modal_subtitle").html("");
      $("#video_modal_title").html(data[0]["article_title"]);
      $("#modal_intro").html(data[0]["article_short"]);
      $("#modal_content").html(data[0]["article_cont"]);
      $("#videoPlayer").attr(
        "src",
        site_url_other + "index.php/home/stream/news_files/" + id
      );
      $("#video_modal")
        .modal()
        .show();
      var ending_audio = $("#videoPlayer")[0];
      ending_audio.currentTime = 0;
      ending_audio.play();
    },
    error: function(msg) {}
  });
}

function book_show(id) {
  var url = "";
  url = site_url_other + "index.php/home/book_show?id=" + id;
  var outerWidth = window.outerWidth;
  var outerHeight = window.outerHeight;

  var width = my_round(outerWidth * 0.8, -1);
  var height = my_round(outerHeight * 0.8, -1);

  var left = (outerWidth - my_round(outerWidth * 0.8, -1)) / 2;
  var top = (outerHeight - my_round(outerHeight * 0.8, -1)) / 2;

  window.open(
    url,
    null,
    "resizable=yes,scrollbars=yes,top=" +
      top +
      ",left=" +
      left +
      ",height=" +
      height +
      ",width=" +
      width +
      ",toolbar=no,titlebar=no,menubar=no,location=no,address=no,addressbar=no;"
  );
}

function leader_book_show(id) {
  var url = "";
  url = site_url_other + "index.php/leader/book_show?id=" + id;
  var outerWidth = window.outerWidth;
  var outerHeight = window.outerHeight;

  var width = my_round(outerWidth * 0.8, -1);
  var height = my_round(outerHeight * 0.8, -1);

  var left = (outerWidth - my_round(outerWidth * 0.8, -1)) / 2;
  var top = (outerHeight - my_round(outerHeight * 0.8, -1)) / 2;
  window.open(
    url,
    null,
    "resizable=yes,scrollbars=yes,top=" +
      top +
      ",left=" +
      left +
      ",height=" +
      height +
      ",width=" +
      width +
      ",toolbar=no,titlebar=no,menubar=no,location=no,address=no,addressbar=no;"
  );
}

function on_adv_video_Close() {
  // var adv_video = $("#adv_video")[0];
  // adv_video.pause();
  // adv_video.currentTime = 0;
  $("#adv_video_frame").attr("src", $("#adv_video_frame").attr("src"));
}

$(document).ready(function(){
  var width = ($(window).width() - 118)/6;
  var height = (width * 9)/16;
  $('.contain-image').css('height', height);
});