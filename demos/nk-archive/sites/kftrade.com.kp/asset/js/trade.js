
var searchFrm = $("#trade-search-form")[0];

$('.pagination').pagination({
    total_page_count: $("#totalPage").val(),
    start: searchFrm.page.value,
    length: Math.min($("#totalPage").val(), 5)
});
if(searchFrm.sdir.value == "incr"){
    $('#sortASC').removeClass("hide");
    $('#sortDESC').addClass("hide");
}else if(searchFrm.sdir.value == "decr"){
    $('#sortASC').addClass("hide");
    $('#sortDESC').removeClass("hide");
}
$('#sortASC').click(function(){
    searchFrm.sdir.value = "decr";
    searchFrm.page.value = 1;
    searchFrm.submit();
});
$('#sortDESC').click(function(){
    searchFrm.sdir.value = "incr";
    searchFrm.page.value = 1;
    searchFrm.submit();
});
$(searchFrm).find("[name='stype']").change(function(){
    searchFrm.page.value = 1;
    searchFrm.submit();
});
$(searchFrm).find("[name='keyword']").keypress(function(e){
    if (e.which == 13) {
        e.preventDefault();
        searchFrm.page.value = 1;
        searchFrm.submit();
    }
});
$('#submit-btn').click(function(){
    searchFrm.submit();
});

$(".org-filter .cate").click(function(e){
    var checkedItems = $(this).parents(".categories").find("input:checked");
    var arrVal = new Array();
    for (var i = 0; i < checkedItems.length; i++) {
        arrVal[i] = $(checkedItems[i]).val();
    }
    searchFrm.bcate.value = $(this).parents(".categories").attr("bcate");
    searchFrm.cate.value = arrVal.toString();
    searchFrm.page.value = 1;
    searchFrm.sdir.value = "";
    searchFrm.submit();
});
$(".org-filter .sub-panel .title").click(function(e){
    searchFrm.bcate.value = $(this).siblings(".categories").attr("bcate");
    searchFrm.cate.value = $(this).attr("param");
    searchFrm.page.value = 1;
    searchFrm.sdir.value = "";
    searchFrm.keyword.value = "";
    searchFrm.submit();
});


var curViewMode = document.cookie.replace(/(?:(?:^|.*;\s*)INVViewMode\s*\=\s*([^;]*).*$)|^.*$/, "$1");

function initMode( mode ){
    $('#gridMode').removeClass("active");
    $('#listMode').removeClass("active");
    if(mode == "list" || mode == ""){
        $('#listMode').addClass("active");
        $(".goods-list > div.goods-col").removeClass("col-sm-4 gridmode");
        $(".goods-list > div.goods-col").addClass("col-sm-12 listmode");
        $(".goods-list > div .goods-item").removeClass("row");
        $(".goods-list > div .goods-item .thumbnail").removeClass("col-sm-3");
        $(".goods-list > div .goods-item .description").removeClass("col-sm-9");
        $(".goods-list > div .goods-item").addClass("row");
        $(".goods-list > div .goods-item .thumbnail").addClass("col-sm-3");
        $(".goods-list > div .goods-item .description").addClass("col-sm-9");
        $(".goods-list > div .goods-item .description .address").show();
        $(".goods-list > div .goods-item .description .intro").show();
        $(".goods-list > div .goods-item .description .name").removeClass('text-center');
    }
    else if(mode == "grid"){
        $('#gridMode').addClass("active");
        $(".goods-list > div.goods-col").removeClass("col-sm-12 listmode");
        $(".goods-list > div.goods-col").addClass("col-sm-4 gridmode");
        $(".goods-list > div .goods-item").removeClass("row");
        $(".goods-list > div .goods-item .thumbnail").removeClass("col-sm-3");
        $(".goods-list > div .goods-item .description").removeClass("col-sm-9");
        $(".goods-list > div .goods-item .description .name").removeClass('text-center');
        $(".goods-list > div .goods-item .description .name").addClass('text-center');
        $(".goods-list > div .goods-item .description .address").hide();
        $(".goods-list > div .goods-item .description .intro").hide();
    }
}
initMode(curViewMode);

$('#listMode').click(function(){
    initMode("list");
    document.cookie = "INVViewMode=list";
});
$('#gridMode').click(function(){
    initMode("grid");
    document.cookie = "INVViewMode=grid";
});


function initVSlider(){
    var w = $('#image_vslider').width();
    var h = w * 3 / 4;
    var ws = $('.right-bar').width();
    var hs = ws * 12 / 4 + 30;
    $('#image_vslider').height(h);
    $('#vCarousel').width(w);
    $('#vCarousel').height(hs);
    var options = {
        $AutoPlay: true,
        $AutoPlayInterval: 2000,
        $PauseOnHover: 1,
        $PlayOrientation: 2,

        $DragOrientation: 2,
        $ArrowKeyNavigation: true,
        $SlideDuration: 800,
        $FillMode: 1,
        $DisplayPieces: 5,
        $SlideHeight: h + 10,

        $ArrowNavigatorOptions: {
            $Class: $JssorArrowNavigator$,
            $ChanceToShow: 1
        },
        $ThumbnailNavigatorOptions: {
            $Class: $JssorThumbnailNavigator$,
            $ChanceToShow: 2,

            $ActionMode: 1,
            $SpacingX: 3,
            $DisplayPieces: 10,
            $ParkingPosition: 300
        }
    };
    var jssor_slider1 = new $JssorSlider$("image_vslider", options);
}

initVSlider();
