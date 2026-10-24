
function setLanguage(lang) {
  $('#language').attr('value', lang);
  $('#lang').submit(); 
}

function setPage(page) {
  $('#page').attr('value', page);
  //$('#lang').submit();
}

function viewArticle(id, tab) {
  url = $("#article_url").val() + "?id=" + id;
  var centerX,centerY;
  centerX=(screen.width-640)/2+"px";
  centerY=(screen.height-600)/2+"px";
  if (tab == 1) { 
    window.open(url,"_blank"); 
  } else { 
    window.open(url,"pop","left="+centerX+", top="+centerY+", width=640px,height=600px,status=0,toolbar=0,scrollbars=1,menubar=0,location=0"); 
  }
}

function viewNews(id, table) {
  url = $("#article_url").val() + "?id=" + id + "&table=" + table;
  var centerX,centerY;
  centerX=(screen.width-640)/2+"px";
  centerY=(screen.height-600)/2+"px";

  window.open(url,"pop","left="+centerX+", top="+centerY+", width=640px,height=600px,status=0,toolbar=0,scrollbars=1,menubar=0,location=0"); 
}

function viewFacility(id, tab) {
  url = $("#facility_url").val() + "?id=" + id;
  var centerX,centerY;
  centerX=(screen.width-1050)/2+"px";
  centerY=(screen.height-600)/2+"px";
  if (tab == 1) { 
    window.open(url,"_blank"); 
  } else { 
    window.open(url,"pop","left="+centerX+", top="+centerY+", width=768px,height=600px,status=0,toolbar=0,scrollbars=1,menubar=0,location=0"); 
  }
}

function viewAttachment(file) {
  url = $("#attachment_url").val() + file;
  window.open(url,"_blank"); 
}

function search() {
  location = $("#search_url").val() + "search=" + $("#search").val();
}

$("#search").on('keydown', function (e){
  if (e.keyCode == 13) {
    search();
  }
});

function search_footer() {
  location = $("#search_url").val() + "search=" + $("#search_footer").val();
}

$("#search_footer").on('keydown', function (e){
  if (e.keyCode == 13) {
    search_footer();
  }
});

function viewVideo() {
  $('#video').removeAttr('hidden');
  $('#view_video').attr('hidden', 'hidden');
  $('#image').attr('hidden', 'hidden');
  $('#view_image').removeAttr('hidden');
  var myVideo = document.getElementById("video_obj"); 
  myVideo.play(); 
}

function viewImage() {
  $('#image').removeAttr('hidden');
  $('#view_image').attr('hidden', 'hidden');
  $('#video').attr('hidden', 'hidden');
  $('#view_video').removeAttr('hidden');
  var myVideo = document.getElementById("video_obj");
  myVideo.pause();
}
