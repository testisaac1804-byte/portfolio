$(function(){
    // $('#section-cooperation-box .box-pc-ul').bxSlider({
    //     auto: false,
    //     controls: true,
    //     autoHover: true
    // });
    // $(".index-page .section-cooperation .bx-controls .bx-controls-direction .bx-prev").text("")
    // $(".index-page .section-cooperation .bx-controls .bx-controls-direction .bx-next").text("")
    //组件初始化
    // $.loadComponents("right_fixed_list_1");
    $.loadComponents("right_fixed_list_8","https://uri.unionpay.com:10010/yunshanfu/uriweb/chat?entryId=222");


    // 新页面
    $('.index-page .index-tabList .selectTabItem ul li').on("click",function () {
        $(this).siblings().removeClass("active")
        $(this).addClass("active")
        $('.tabListBox ul li').removeClass("active")
        const n = $(this).index()
        $('.tabListBox ul li').eq(n).addClass("active")
    })
    //新闻
    $("#news-con-box").delegate("#news-con-list li","mouseover",function () {
        $(this).siblings().removeClass("active");
        $(this).addClass("active");
    })

    $(".index-page .index-news .news-nav #index-news-nav").delegate("li","click",function () {
        $(this).siblings().removeClass("active");
        $(this).addClass("active");
        var index = $(this).index();
        $(".index-page .index-news #news-con-box>li").removeClass("on");;
        $(".index-page .index-news #news-con-box>li").eq(index).addClass("on");
        // var target = $(this).attr("data-toggle");
        // if (target != "more"){
        //     return false;
        // }
    })

    $('.index-page .index-tabList .tabListBoxM .tabListBoxM-content ul').bxSlider({
        auto: true,
        pause: 5000,
        controls: true,
        autoHover: true
    });

    $('.index-page .index-tabList .selectTabItemM ul li').on("click",function () {
        $(this).siblings().removeClass("active")
        $(this).addClass("active")
        $('.index-page .index-tabList .tabListBoxM>ul>li').removeClass("active")
        const n = $(this).index()
        $('.index-page .index-tabList .tabListBoxM>ul>li').eq(n).addClass("active")
    })

});




var APP = window.APP = window.APP || {};
APP.index = function () {
    var version = $.ieVersion();

    //首页新闻版块初始化
    var indexNewsInit = function(jsUrl) {
        $.getScript(webRoot+jsUrl).done(function () {
            if (indexNewsList != null){
                var htmlStr = "";
                var data = {
                    "indexNewsList":indexNewsList
                }
                //新闻版块导航
                htmlStr = $("#tmpl-index-news-list-nav").tmpl(data);
                $("#index-news-nav").html(htmlStr);
                htmlStr = $("#tmpl-index-news-list-con").tmpl(data);
                $("#news-con-box").html(htmlStr);

                var options = {
                    auto:true,
                    pause:5000,
                    controls:true
                };
                for (var i = 1; i < indexNewsList.length+1; i++) {
                    var bxSliderTarget = "#news-con-silder-" +i;
                    $(bxSliderTarget).bxSlider(options);
                }
                $.initEll();
            }
        })
    }

     var el
    //首页轮播图初始化
    var bannerInit = function () {
    	el = $('.banner-list ul').bxSlider({
            auto: true,
            pause: 5000,
            controls: true,
            autoHover: true
        });
        $(".index-page .banner").css({opacity:1});
    }
    var bannerReload = function(){
    	el.reloadSlider();
    }

    var init = function (jsUrl) {
        if(version<10 && version >-1){
            indexNewsInit(jsUrl);
            bannerInit();
        } else{
            indexNewsInit(jsUrl);
            bannerInit();
        }
    }
    
    // var acb = function () {
    //     $('#section-cooperation-box .box-pc-ul').bxSlider({
    //         auto: false,
    //         controls: true,
    //         autoHover: true
    //     });
    //     $(".index-page .section-cooperation .bx-controls .bx-controls-direction .bx-prev").text("")
    //     $(".index-page .section-cooperation .bx-controls .bx-controls-direction .bx-next").text("")
    // }

    return {
        init:init,
        bannerInit:bannerInit,
        bannerReload:bannerReload,
        // acb: acb
    };
}();