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
	story_search();
}
function story_search_key_up(event, obj) {
	const query = $(obj).val();
	page = 1;
	$("input[name=txt]").val(query);
	if (event.keyCode == 13) {
		story_search(1);
	}
}

function story_search() {
	var url;
	url = site_url("index.php/leader/story");
	url += "?kind=2";
	url += "&p=" + page;
	url += "&txt=" + encodeURIComponent($("input[name=txt]").val());
	url += "&language=" + language;
	location.href = url;
}
