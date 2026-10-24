
var searchFrm = $("#law-search-form")[0];

$('.pagination').pagination({
    total_page_count: $("#totalPage").val(),
    start: searchFrm.page.value,
    length: Math.min($("#totalPage").val(), 5)
});

$(searchFrm).find("[name='keyword']").keypress(function(e){
    if (e.which == 13) {
        e.preventDefault();
        searchFrm.page.value = 1;
        searchFrm.submit();
    }
});
$(searchFrm).find("[name='cate[]']").click(function(e){
    searchFrm.page.value = 1;
    searchFrm.submit();
});
$('#submit-btn').click(function(){
    searchFrm.submit();
});