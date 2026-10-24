var kind = 0;

function select_stage_music(music_id, kind) {
  if (kind !== "") {
    kind_id = kind;
  }
  var audio_url = $("#audio_" + music_id).val();
  $.ajax({
    type: "GET",
    url: site_url_other + "index.php/stage/select_music?language=" + language,
    data: {
      music_id: music_id,
      kind_id: kind_id,
      audio_url: audio_url,
      filter: ('undefined' != typeof _filter && _filter != "") ? _filter:''
    },
    dataType: "json",
    success: function(data) {
       var b_mp4 = false;
      var id_mp4 = -1;
      for (var i = 0; i < data["result"].length; i++) {
        if (data["result"][i]["file_type"] == "2") {
          b_mp4 = true;
          id_mp4 = i;
        }
      }
      if (!b_mp4) {
          $("#music-modal-title").html(
          data["result_article"][0]["article_title"]
        );
        // $(".writer_compose").html(
        // 	"작사 : " +
        // 		data["result_article"][0]["write_author"] +
        // 		" 작곡 : " +
        // 		data["result_article"][0]["compose_author"]
        // );
        // $(".pub_year").html(data["result_article"][0]["pub_year"]);
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
              "index.php/home/audio_stream/stage_files/" +
              data["result"][i]["article_id"];
            var music_url = stream_url;
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
        var path = data["result"][id_mp4]["file_name"];
        var fileName = path.split(".");
        select_stage_video(
          fileName[0],
          data["result_article"][0]["article_title"]
        );
        return;
        var video_url = data["result"][id_mp4]["file_path"];
        $(".modal_subtitle").html(data["result_article"][0]["subtitle"]);
        $("#video_modal_title").html(
          data["result_article"][0]["article_title"]
        );
        $("#modal_intro").html("");
        $("#modal_content").html("");
        //		    $('#videoPlayer').attr('src', site_url_other + 'index.php/home/stream/stage_files/' + video_url);
        $("#videoPlayer").attr("src", site_url_other + video_url);
        $("#video_modal")
          .modal()
          .show();
        var ending_audio = $("#videoPlayer")[0];
        ending_audio.currentTime = 0;
        ending_audio.play();
      }
    },
    error: function(msg) {}
  });
}

var type = 2;
var page;

function onFilter(event) {
  if (event.keyCode == 13) {
    page = 1;
    onSearch();
  }
}

function go_page(p) {
  page = p;
  onSearch();
}

function onSearch(id) {
  // if ($("#tab-11").hasClass("active")) type = 1;
  var url;
  url = site_url("index.php/stage/productions");
  url += "?p=" + page;
  // url += "&type=" + type;
  url += "&class=" + $("#classId").val();
  if ($("#filter").val() != "") {
    // url += "&f=" + $("#filter").val();
    url += "&f=" + encodeURIComponent($("#filter").val());
  }
  var classId = $("#classId").val();
  var famous = (classId!=1 && classId!=30 && classId!=33)?0:($("#famous input[type=checkbox]").prop('checked')==true?1:0);
  url += "&famous=" + famous;
  url += "&language=" + language;
  location.href = url;
}

$(document).ready(function(){
  $("#famous input[type=checkbox]").on('change',onSearch);
});