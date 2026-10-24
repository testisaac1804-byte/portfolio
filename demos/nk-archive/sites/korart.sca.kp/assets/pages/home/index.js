$(document).ready(function() {
    setTimeout(function(){
      $(".h-rotate").each(function() {
        if('nowrap' != $(this).find('> p').css('white-space')) $(this).find('> p').css('white-space','nowrap');
        $(this).attr('attr-tmp',$(this).html());
        $(this).html('');
      });
    },10);

    setTimeout(function(){
      $(".h-rotate").each(function() {
        var ow = $(this).parent().outerWidth();
        var iw = $(this).parent().width();
        $(this).attr('attr-width', ow);
        $(this).attr('attr-wp', ow-iw);
      });
    },10);
    
    setTimeout(function(){
      $(".h-rotate").each(function(){
        var pw = parseInt($(this).attr('attr-width'));
        var obj = $(this);
        $(this).html("<div class='marquee'>"+$(this).attr('attr-tmp')+"</div>");
        $(this).attr('attr-tmp','');
        var span = $(this).find('.marquee > p > span');
        var speed = 70; //40px per seconds//obj.width()/8;
        var tm = Math.ceil((pw + span.width())/speed);
        span.css('animation-duration',tm+'s');
        $(this).find('.marquee').css('left',-1*span.width());
        $(this).find('.marquee').css('width',pw+span.width());
		  });

      setTimeout(function(){
        $(".h-rotate").each(function() {  
          var pw = parseInt($(this).attr('attr-width'));
          var pdw = parseInt($(this).attr('attr-wp'));
          var mw = $($(this).find('.marquee > p > span')).innerWidth();
          if (mw > (pw - pdw)) {
            if($(this).hasClass('content-center'))
              $(this).removeClass('content-center');
          } else {
            $(this).removeClass('h-rotate');
            $(this).html($(this).find('> .marquee').html());
            if(!$(this).hasClass('content-center'))
              $(this).addClass('content-center');
          }
          var mb = $(this).attr('attr-pb');
          var pb = $(this).find('> .marquee > p').height();
          if('undefined' == typeof mb) mb = 0; 
          $(this).css('margin-bottom',pb+parseInt(mb)+"px");
        });
      },10);
    },10);

  var regulate_layout = function() {
    if(($(window).outerWidth() + (window.scrollbars.visible?20:0)) >= 992) {
      var height = $('.main').height();
      $(".rev-card,.song-card").height(height);
      $(".rev-card > .card-body").height(height - $(".rev-card > .card-header-short").outerHeight() - 10);
      $(".song-card > .card-body").height(height - $(".song-card > .card-header-short").outerHeight() - 10);
    } else {
      $(".song-card").css('height','auto');
      $(".song-card > .card-body").css('height','auto');
    }
  };
  setTimeout(regulate_layout,500);
  $(window).resize(regulate_layout);

  // $('[data-toggle="tooltip"]').tooltip();
  jQuery(".pulsate-regular").pulsate({
    color: "#bf1c56",
    repeat: true
  });
  var id = $(".news-item:first").attr("value");
  var start = $(".news-item:first").attr("start");
  var end = $(".news-item:first").attr("end");
  var current = $(".news-item:first").attr("current");
  start = new Date(start).getTime();
  end = new Date(end).getTime() + 24 * 60 * 60 * 1000;
  var current = new Date(current).getTime();
  // console.log("000");
  // console.log("000", id);
  // console.log("start", start);
  // console.log("current", current);
  // console.log("end", end);
  // console.log("newsFlag_ko", newsFlag_ko);
  if (language == "korean") {
    if (newsFlag_ko == true) {
      if (id > 0 && start < current && end > current) news_show(id);
    }
  } else if (language == "english") {
    if (newsFlag_en == true) {
      if (id > 0 && start < current && end > current) news_show(id);
    }
  } else if (language == "chinese") {
    if (newsFlag_ch == true) {
      if (id > 0 && start < current && end > current) news_show(id);
    }
  } else if (language == "russian") {
    if (newsFlag_ru == true) {
      if (id > 0 && start < current && end > current) news_show(id);
    }
  }

  // if (id > 0 && start < current && end > current) news_show(id);

  id = $(".news-item-mobile:first").attr("value");
  start = $(".news-item-mobile:first").attr("start");
  end = $(".news-item-mobile:first").attr("end");
  start = new Date(start).getTime();
  end = new Date(end).getTime() + 24 * 60 * 60 * 1000;
  current = new Date().getTime();

  if (language == "korean") {
    if (newsFlag_ko == true) {
      if (id > 0 && start < current && end > current) mobile_news_show(id);
    }
  } else if (language == "english") {
    if (newsFlag_en == true) {
      if (id > 0 && start < current && end > current) mobile_news_show(id);
    }
  } else if (language == "chinese") {
    if (newsFlag_ch == true) {
      if (id > 0 && start < current && end > current) mobile_news_show(id);
    }
  } else if (language == "russian") {
    if (newsFlag_ru == true) {
      if (id > 0 && start < current && end > current) mobile_news_show(id);
    }
  }
});
//Yes 하루동안현시하지 않기
function on_news_modal_close() {
  var flag = $("#news_modal_check:checked").val();
  if (!flag) flag = 0;
  if (flag) {
    // console.log("flag", flag);
    $.ajax({
      type: "GET",
      url:
        site_url_other + "index.php/home/no_display_news?language=" + language,
      data: {
        flag: flag
      },
      dataType: "json",
      success: function(data) {
        //
      },
      error: function(msg) {}
    });
  }
}

//Yes 하루동안현시하지 않기: mobile
function on_news_mobile_modal_close() {
  var flag = $("#news_mobile_modal_check:checked").val();
  if (!flag) flag = 0;
  if (flag) {
    // console.log("flag", flag);
    $.ajax({
      type: "GET",
      url:
        site_url_other + "index.php/home/no_display_news?language=" + language,
      data: {
        flag: flag
      },
      dataType: "json",
      success: function(data) {
        //
      },
      error: function(msg) {}
    });
  }
}

function hls_video_close() {
  $("#hls_video_modal").modal("hide");
  $("#videoFrame").remove();
}
function text_show(id) {
  $.ajax({
    type: "GET",
    url: site_url_other + "index.php/home/select_article?language=" + language,
    data: {
      article_id: id
    },
    dataType: "json",
    success: function(data) {
      $("#text_modal_title").html(data[0]["article_title"]);
      $("#modal_intro").html(data[0]["article_short"]);
      $("#modal_intro").html("");
      $("#modal_content").html(data[0]["article_cont"]);

      if (data[0]["linkUrl"] && data[0]["linkUrl"].length > 0) {
        $("#modal_link").removeClass("hidden");
        $("#modal_link").attr("href", data[0]["linkUrl"]);
      } else {
        $("#modal_link").addClass("hidden");
      }

      $("#text_modal")
        .modal()
        .show();
    },
    error: function(msg) {}
  });
}
function mobile_news_show(id) {
  $.ajax({
    type: "GET",
    url: site_url_other + "index.php/home/select_article?language=" + language,
    data: {
      article_id: id
    },
    dataType: "json",
    success: function(data) {
      $("#mobile_text_modal_title").html(data[0]["article_title"]);
      $("#mobile_modal_intro").html(data[0]["article_short"]);
      $("#mobile_modal_intro").html("");
      $("#mobile_modal_content").html(data[0]["article_cont"]);

      if (data[0]["linkUrl"] && data[0]["linkUrl"].length > 0) {
        $("#mobile_modal_link").removeClass("hidden");
        $("#mobile_modal_link").attr("href", "../../" + data[0]["linkUrl"]);
      } else {
        $("#mobile_modal_link").addClass("hidden");
      }

      $("#news_modal_mobile")
        .modal()
        .show();
    },
    error: function(msg) {}
  });
}
function news_show(id) {
  // console.log("ok");
  $.ajax({
    type: "GET",
    url: site_url_other + "index.php/home/select_article?language=" + language,
    data: {
      article_id: id
    },
    dataType: "json",
    success: function(data) {
      $("#news_modal_title").html(data[0]["article_title"]);
      $("#news_modal_content").html(data[0]["article_cont"]);

      // 련결주소가 있을 때
      if (data[0]["linkUrl"] && data[0]["linkUrl"].length > 0) {
        $("#news_link").removeClass("hidden");
        $("#news_link").attr("href", data[0]["linkUrl"]);
        if (language == "russian") {
          $("#news_link").parent()[0].style.paddingRight = "180px";
        } else {
          $("#news_link").parent()[0].style.paddingRight = "210px";
        }
      } else {
        $("#news_link").addClass("hidden");
        $("#news_link").parent()[0].style.paddingRight = "250px";
      }

      // 그림이 있을 때
      if (data[0]["imgKind"] * 1 === 1) {
        $("#news_modal_content")[0].style.width = "550px";
        $("#news_modal_image").removeClass("hidden");
      } else {
        $("#news_modal_content")[0].style.width = "750px";
        $("#news_modal_image").addClass("hidden");
      }

      $("#news_modal")
        .modal()
        .show();
    },
    error: function(msg) {}
  });
}
//Yes 불멸의 령도 사진 보기
function leader_image_show(id) {
  var url = "";
  url = site_url("index.php/leader/image_show?id=" + id);
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
//Yes 문예기사 상세보기에서 동영상열람
function home_video_open(filename, title, download) {
  // console.log("home_video_open: ", download);
  $(".video-modal-title").html(title);
  $("#videoFrame").remove();
  $("#videoFrameWrapper").append(
    '<iframe id="videoFrame" style="width: 100%; height: 100%"></iframe>'
  );
  $("#videoFrame").attr(
    "src",
    "/hls/player.php?id=" + filename + "&autoplay=1"
  );
  $("#hls_video_modal")
    .modal()
    .show()
    .on('hide.bs.modal', function(){
    $("#videoFrame").remove();
  });
}

var page = 1;
function select_revolution_song(music_id) {
  $.ajax({
    type: "GET",
    url:
      site_url_other +
      "index.php/home/get_revolution_song?language=" +
      language,
    data: {
      music_id: music_id
    },
    dataType: "json",
    success: function(data) {
      // console.log(data);
      var b_mp4 = false;
      var id_mp4 = -1;
      if (data["result"]) {
        for (var i = 0; i < data["result"].length; i++) {
          if (data["result"][i]["file_type"] == "2") {
            b_mp4 = true;
            id_mp4 = i;
          }
        }
      }

      if (!b_mp4) {
        $("#music-modal-title").html(
          data["result_article"][0]["article_title"]
        );
        if (data["result"]) {
          for (var i = 0; i < data["result"].length; i++) {
            if (
              data["result"][i]["file_type"] == "1" &&
              data["result"][i]["main_page"] == 0 &&
              data["result"][i]["img_type"] == 1
            ) {
              var img_url = data["result"][i]["file_path"];
            }
            if (data["result"][i]["file_type"] == "4") {
              var stream_url =
                "index.php/home/audio_stream/news_files/" +
                data["result"][i]["article_id"];
              var music_url = stream_url;
            }
          }
        }
        $("#music_image").attr("src", site_url_other + img_url);
        $("#audioPlayer").attr("src", site_url_other + music_url);
        $("#music_modal")
          .modal()
          .show();
        var ending_audio = $("#audioPlayer")[0];
        ending_audio.currentTime = 0;
        ending_audio.play();
      } else {
        // var path = data["result"][id_mp4]["file_name"];
        // var fileName = path.split(".");
        // select_video_2(fileName[0], data["result_article"][0]["article_title"]);
        // return;
        // var video_url = data["result"][id_mp4]["file_path"];
        // $(".modal_subtitle").html(data["result_article"][0]["subtitle"]);
        // $("#video_modal_title").html(
        // 	data["result_article"][0]["article_title"]
        // );
        // $("#modal_intro").html("");
        // $("#modal_content").html("");
        // $("#videoPlayer").attr("src", site_url_other + video_url);
        // $("#video_modal")
        // 	.modal()
        // 	.show();
        // var ending_audio = $("#videoPlayer")[0];
        // ending_audio.currentTime = 0;
        // ending_audio.play();
      }
    },
    error: function(msg) {}
  });
}

function music_modal_close() {
  var ending_audio = $("#audioPlayer")[0];
  ending_audio.pause();
  ending_audio.currentTime = 0;
  $("#audioPlayer").attr('src','');
  $("#music_modal").modal("hide");

  // ending_audio.play();
}

function totalSearch(event, obj) {
  const query = $(obj).val();
  // console.log("query: ", query);
  $("input[name=totalSearch]").val(query);

  if (event.keyCode == 13) {
    Total_Search(1);
  }
}

function move_page(p) {
  page = p;
  Total_Search();
}

function Total_Search() {
  var url;

  // if ($("input[name=totalSearch]").val() == "") return;

  url = site_url("index.php/home/total_search");
  url += "?p=" + page;
  url += "&language=" + language;
  // url += "&filter=" + $("input[name=totalSearch]").val();
  url += "&filter=" + encodeURIComponent($("input[name=totalSearch]").val());

  location.href = url;
}

function select_stage_video(filename, title, id) {
  if (id) {
    $(".download-link").removeClass("hidden");
    var url = site_url("index.php/home/download/april_files/" + id);
    $(".download-link").attr("href", url);
  } else $(".download-link").addClass("hidden");
  if('undefined' != typeof _filter && _filter != "") {
    if(title.indexOf('keyword-3') == -1) {
      title = title.replace(/'keyword'/gi,"'keyword-3'");
    }
  }
  $(".video-modal-title").html(title);
  $("#videoFrame").remove();
  $("#videoFrameWrapper").append(
    '<iframe id="videoFrame" style="width: 100%; height: 100%"></iframe>'
  );
  $("#videoFrame").attr(
    "src",
    "/hls/player.php?id=" + filename + "&autoplay=1"
  );
  $("#hls_video_modal")
    .modal()
    .show()
    .on('hide.bs.modal', function(){
    $("#videoFrame").remove();
  });
}

function my_round(number, precision) {
  var factor = Math.pow(10, precision);
  var tempNumber = number * factor;
  var roundedTempNumber = Math.round(tempNumber);
  return roundedTempNumber / factor;
}
function text_april_show(id) {
  $.ajax({
    type: "GET",
    url: site_url_other + "index.php/april/getModal",
    data: {
      article_id: id,
      filter: ('undefined' != typeof _filter && _filter != "") ? _filter : "",
    },
    dataType: "json",
    success: function(data) {
      $("#text_modal_title").html(data[0]["article_title"]);
      $("#modal_intro").html(data[0]["article_short"]);
      $("#modal_intro").html("");
      if (data[0].files.length > 0) {
        var content = '<div class="row"><div class="col-md-4">';
        data[0].files.forEach(function(d, idx) {
          content +=
            '<img src="' +
            site_url(data[0].files[idx]["file_path"]) +
            '" style="margin-bottom: 15px" />';
        });
        content +=
          '</div><div class="col-md-8">' +
          data[0]["article_cont"] +
          "</div></div>";
        $("#modal_content").html(content);
      } else $("#modal_content").html(data[0]["article_cont"]);

      $("#text_modal")
        .modal()
        .show();
    },
    error: function(msg) {}
  });
}
function total_text_image_show(id, type) {
  if (type == "bright") {
    var data_url = "index.php/bright_festival/get_response_modal";
  } else if (type == "musical") {
    var data_url = "index.php/musical_contest/get_response_modal";
  }

  $.ajax({
    type: "GET",
    url: site_url_other + data_url,
    data: {
      article_id: id,
      filter: ('undefined' != typeof _filter && _filter != "") ? _filter : ''
    },
    dataType: "json",
    success: function(data) {
      $("#text_modal_title").html(data[0]["article_title"]);
      $("#modal_intro").html(data[0]["article_short"]);
      $("#modal_intro").html("");
      if (data[0].files.length > 0) {
        var content = '<div class="row"><div class="col-md-3">';
        data[0].files.forEach(function(d, idx) {
          content +=
            '<img src="' +
            site_url(data[0].files[idx]["file_path"]) +
            '" style="margin-bottom: 15px" />';
        });
        content +=
          '</div><div class="col-md-9">' +
          data[0]["article_cont"] +
          "</div></div>";
        $("#modal_content").html(content);
      } else $("#modal_content").html(data[0]["article_cont"]);

      $("#text_modal")
        .modal()
        .show();
    },
    error: function(msg) {}
  });
}
function goPreviousPage(a,ff)
{
  var url = $(a).attr('data-url');
  if('undefined' != typeof ff) url += ff;
  location.assign(url);
}
