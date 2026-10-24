
$("#goods-tree").jstree({
    "core" : {
        "themes" : {
            "responsive": false,
            "icons": false
        },
        "check_callback" : true,
        'data' : {
            'url' : function (node) {
                return "../goods/category_full";
            },
            'data' : function (node) {
                return { 
                    'parent' : 'troot',
                    'lang'   : lang
                };
            }
        }
    },
    "types" : {
        "default" : {
            "icon" : null
        },
        "file" : {
            "icon" : null
        }
    },
    "state" : { },
    "plugins" : [ "state" ]
});
$('#goods-tree').on("click.jstree", ".jstree-anchor", $.proxy(function (e) {
    var link = $(e.currentTarget);
    document.cookie = "GoodsCateId="+link.parent().attr("id");
    if (link.attr("href") != "#" && link.attr("href") != "javascript:;" && link.attr("href") != "") {
        if (link.attr("target") == "_blank") {
            link.attr("href").target = "_blank";
        }
        document.location.href = link.attr("href");
        return false;
    }
}));

$('#goods-tree').on("load_node.jstree", $.proxy(function (e, data) {
    
}));

$(".category-panel.scroller").height(500);
initSlimScroll(".scroller");
$('.slider').owlCarousel({
    animateOut: 'lightSpeedOut',
    nav : true, // Show next and prev buttons
    navText: false,
    dots: false,
    items: 1,
    margin: 0,
    smartSpeed: 450,
    loop: true,
    fluidSpeed: 500,
    rewind: true,
});

var intId = window.setInterval(owlNext, 2500);
function owlNext() {
  $(".owl-next").click();
}

var searchFrm = $("#goods-search-form")[0];
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

var curViewMode = document.cookie.replace(/(?:(?:^|.*;\s*)GoodsViewMode\s*\=\s*([^;]*).*$)|^.*$/, "$1");

function initMode( mode ){
    $('#gridMode').removeClass("active");
    $('#listMode').removeClass("active");
    if(mode == "list"){
        $('#listMode').addClass("active");
        $(".goods-list > div.goods-col").removeClass("col-sm-4 gridmode");
        $(".goods-list > div.goods-col").addClass("col-sm-12 listmode");
        $(".goods-list > div .goods-item").removeClass("row");
        $(".goods-list > div .goods-item .thumbnail").removeClass("col-sm-3");
        $(".goods-list > div .goods-item .description").removeClass("col-sm-9");
        $(".goods-list > div .goods-item").addClass("row");
        $(".goods-list > div .goods-item .thumbnail").addClass("col-sm-3");
        $(".goods-list > div .goods-item .description").addClass("col-sm-9");
    }
    else if(mode == "grid" || mode == ""){
        $('#gridMode').addClass("active");
        $(".goods-list > div.goods-col").removeClass("col-sm-12 listmode");
        $(".goods-list > div.goods-col").addClass("col-sm-4 gridmode");
        $(".goods-list > div .goods-item").removeClass("row");
        $(".goods-list > div .goods-item .thumbnail").removeClass("col-sm-3");
        $(".goods-list > div .goods-item .description").removeClass("col-sm-9");
    }
}
initMode(curViewMode);

$('#listMode').click(function(){
    initMode("list");
    document.cookie = "GoodsViewMode=list";
});
$('#gridMode').click(function(){
    initMode("grid");
    document.cookie = "GoodsViewMode=grid";
});

function openSelected( goodsTree, e ){
    var cate = searchFrm.cate.value;
    if (cate == "")
        cate = "1-0-0-0";
    var cateArr = cate.split("-");
    tmpCate = cateArr[0]+"-0-0-0";
    goodsTree.open_node($("#"+tmpCate+" i.jstree-icon"),false, 0);
    tmpCate = cateArr[0]+"-"+cateArr[1]+"-0-0";
    goodsTree.open_node($("#"+tmpCate+" i.jstree-icon"),false, 0);
    tmpCate = cateArr[0]+"-"+cateArr[1]+"-"+cateArr[2]+"-0";
    goodsTree.open_node($("#"+tmpCate+" i.jstree-icon"),false, 0);
    tmpCate = cateArr[0]+"-"+cateArr[1]+"-"+cateArr[2]+"-"+cateArr[3];
    goodsTree.open_node($("#"+tmpCate+" i.jstree-icon"),false, 0);
    goodsTree.activate_node($("#"+cate+" a.jstree-anchor"), e);
}