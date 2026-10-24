$(document).ready(function() {

	PageNumsShow();
	$(".jp-other").click(function() {
		$("#cup").val($(this).attr("pageNum"));
//		window.localStorage['cup'] = $("#cup").val();
		requestList();
	});

});



function requestList() {
	$("#paging_form").submit();
};

function resetPage() {
	$("#cup").val("0");
//	var listNumPerOnePage = parseInt($("#listNumPerOnePage").val());
//	$("#listNumPerOnePage").val(listNumPerOnePage);
	requestList();
};

function PageNumsShow() {

	// do stuff here
	var tlcnt = $("#tlcnt").val();
	var rcnt = $("#rcnt").val();
	var cup = $("#cup").val();
//	var listNumPerOnePage = parseInt($("#listNumPerOnePage").val());
	var listNumPerOnePage = 10;
	var totalPageCnt;
	var showPageCnt = 5;
	var startPage;
	var endPage;
	var start_rec;
	var end_rec;


	totalPageCnt = Math.ceil(tlcnt / listNumPerOnePage);

	start_rec = cup * listNumPerOnePage + 1;
	end_rec = parseInt(cup * listNumPerOnePage) + parseInt(rcnt);

	if (totalPageCnt <= showPageCnt) {
		startPage = 1;
		endPage = totalPageCnt;
	} else {
		if (parseInt(cup) <= (showPageCnt - 1) / 2) {
			startPage = 1;
			endPage = parseInt(startPage) + showPageCnt - 1;
		} else if (cup >= parseInt(totalPageCnt) - (showPageCnt - 1)
				/ 2) {
			endPage = totalPageCnt;
			startPage = parseInt(endPage) - showPageCnt + 1;
		} else {
			startPage = parseInt(cup) - (showPageCnt - 1) / 2 + 1;
			endPage = parseInt(cup) + (showPageCnt - 1) / 2 + 1;
		}
	}

	var navhtml;
	var i;
	var pageNum;
	var prevPage = parseInt(cup) - 1;
	var nextPage = parseInt(cup) + 1;

	pageNum = "0";
	navhtml = "<nobr>";

	if (cup == 0) {
		navhtml += "<a class='jp-disabled jp-arrow' style='cursor:not-allowed' ><i class='fa fa-angle-double-left'></i></a>";
		navhtml += "<a class='jp-disabled jp-arrow' style='cursor:not-allowed' ><i class='fa fa-angle-left'></i></a>";
	} else {
		navhtml += "<a  class='jp-other jp-arrow' pageNum = '0'><i class='fa fa-angle-double-left'></i></a>";
		navhtml += "<a class='jp-other jp-arrow' pageNum = '" + prevPage
				+ "'><i class='fa fa-angle-left'></i></a>";
	}

	if (startPage > 1) {
		navhtml += "<a><i class='fa fa-ellipsis-h'></i></a>";
	}

	for (i = startPage; i <= endPage; i++) {
		pageNum = i - 1;

		if (pageNum == cup) {
			navhtml += "<a class='jp-current' >" + i + "</a>";
		} else {
			navhtml += "<a  class='jp-other' pageNum = '" + pageNum + "'>" + i
					+ "</a>";
		}
	}

	if (endPage < totalPageCnt) {
		navhtml += "<a><i class='fa fa-ellipsis-h'></i></a>";
	}

	if (cup == totalPageCnt - 1) {
		navhtml += "<a class='jp-disabled jp-arrow' style='cursor:not-allowed'><i class='fa fa-angle-right'></i></a>";
		navhtml += "<a class='jp-disabled jp-arrow'  style='cursor:not-allowed' ><i class='fa fa-angle-double-right'></i></a>";
	} else {
		navhtml += "<a  class='jp-other jp-arrow' pageNum = '" + nextPage
				+ "'><i class='fa fa-angle-right'></i></a>";
		navhtml += "<a  class='jp-other jp-arrow' pageNum = '" + (totalPageCnt - 1)
				+ "'><i class='fa fa-angle-double-right'></i></a>";
	}

	navhtml += "</nobr>"; 
	$("#pagePanel").html(navhtml);

	
}