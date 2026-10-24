$(document).ready(function() {
	//Yes 혁명활동소식상세보기 새자료
	jQuery(".pulsate-regular").pulsate({
		color: "#bf1c56",
		repeat: true
	});
});
var page = 1;
function go_page(p) {
	page = p;
	theory_search();
}
function theory_search_key_up(event, obj) {
	const query = $(obj).val();
	page = 1;
	$("input[name=txt]").val(query);
	if (event.keyCode == 13) {
		theory_search(1);
	}
}

function theory_search() {
	var url;
	url = site_url("index.php/leader/theory");
	url += "?kind=2";
	url += "&p=" + page;
	url += "&txt=" + encodeURIComponent($("input[name=txt]").val());
	url += "&language=" + language;
	location.href = url;
}
