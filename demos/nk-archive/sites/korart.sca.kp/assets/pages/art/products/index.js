var type = 1;

$(document).ready(function() {});

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

function onKind() {
  page = 1;
  onSearch();
}
function onSearch() {
  var url;
  url = site_url("index.php/art/productions");
  url += "?p=" + page;

  if ($("#classId").val() != 0) {
    url += "&class=" + $("#classId").val();
  }
  if ($("#filter").val() != "") {
    // url += "&f=" + $("#filter").val();
    url += "&f=" + encodeURIComponent($("#filter").val());
  }
  url += "&language=" + language;
  location.href = url;
}
