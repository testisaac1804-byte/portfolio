function init_gallery_flex() {
    $('.gallery-flex .img-responsive').css('max-height', $('.gallery-flex .owl-item').width() * 2 / 3 + 'px');
    $('.gallery-flex .thumbnail-img').css('height', $('.gallery-flex .img-responsive').css('max-height'));
}

function convert_datetime(old_datetime) {
    var dt_arr = old_datetime.split(" ");
    var tmp = dt_arr[0].replace(/-0/g, ".");
    return tmp.replace(/-/g, ".") + ". " + dt_arr[1];
}

function convert_date(old_datetime) {
    var dt_arr = old_datetime;
    var tmp = dt_arr.replace(/-0/g, ".");
    return tmp.replace(/-/g, ".") + ".";
}

function convert_number_format(number) {
    var sOutput = String(number);
    var sThousandsSeparator = ' ';
    var sDecimalSeparator = '.';
    nDotIndex = sOutput.lastIndexOf(sDecimalSeparator);
    nDotIndex = (nDotIndex > -1) ? nDotIndex : sOutput.length;
    var sNewOutput = sOutput.substring(nDotIndex);
    var nCount = -1,
        i;
    for (i = nDotIndex; i > 0; i--) {
        nCount++;
        if ((nCount % 3 === 0) && (i !== nDotIndex) && (i >= 1)) {
            sNewOutput = sThousandsSeparator + sNewOutput;
        }
        sNewOutput = sOutput.charAt(i - 1) + sNewOutput;
    }
    return sNewOutput;
}

function drawPagination(totalCount, nCount, curPage) {
    var numberOfPages = parseInt((totalCount - 1) / nCount) + 1;
    var html = '<li><a class="prev-page">«</a></li>';

    if (numberOfPages < curPage)
        curPage = 1;
    if (numberOfPages <= 6) {
        for (var i = 1; i <= numberOfPages; i++) {
            html += (curPage == i) ? '<li class="active"><a>' + i + '</a></li>' : '<li><a class="nav-page">' + i + '</a></li>';
        }
    } else {
        if (curPage <= 4) {
            for (var i = 1; i <= 4; i++) {
                html += (curPage == i) ? '<li class="active"><a>' + i + '</a></li>' : '<li><a class="nav-page">' + i + '</a></li>';
            }
            html += '<li><a class="nav-page">5</a></li>';
            html += '<li><a>...</a></li>';
            html += '<li><a class="nav-page">' + numberOfPages + '</a></li>';
        } else if (curPage > numberOfPages - 4) {
            html += '<li><a class="nav-page">1</a></li>';
            html += '<li><a>...</a></li>';
            html += '<li><a class="nav-page">' + (numberOfPages - 4) + '</a></li>';
            html += (curPage == numberOfPages - 3) ? '<li class="active"><a>' + (numberOfPages - 3) + '</a></li>' : '<li><a class="nav-page">' + (numberOfPages - 3) + '</a></li>';
            html += (curPage == numberOfPages - 2) ? '<li class="active"><a>' + (numberOfPages - 2) + '</a></li>' : '<li><a class="nav-page">' + (numberOfPages - 2) + '</a></li>';
            html += (curPage == numberOfPages - 1) ? '<li class="active"><a>' + (numberOfPages - 1) + '</a></li>' : '<li><a class="nav-page">' + (numberOfPages - 1) + '</a></li>';
            html += (curPage == numberOfPages) ? '<li class="active"><a>' + (numberOfPages - 0) + '</a></li>' : '<li><a class="nav-page">' + (numberOfPages - 0) + '</a></li>';
        } else {
            html += '<li><a class="nav-page">1</a></li>';
            html += '<li><a>...</a></li>';

            html += '<li><a class="nav-page">' + (curPage - 1) + '</a></li>';
            html += '<li class="active"><a>' + curPage + '</a></li>';
            html += '<li><a class="nav-page">' + (curPage + 1) + '</a></li>';
            html += '<li><a>...</a></li>';
            html += '<li><a class="nav-page">' + numberOfPages + '</a></li>';
        }
    }

    html += '<li><a class="next-page">»</a></li>';

    $('.pagination').html(html);
}

function set_screen(screen_type) {
    localStorage.setItem("screen_type", screen_type);
}

function set_datetime() {
    var day = new Date();
    var y = day.getFullYear();
    var m = day.getMonth() + 1;
    var d = day.getDate();
    switch (day.getDay()) {
        case 0:
            var w = '( 일요일 )';
            break;
        case 1:
            var w = '( 월요일 )';
            break;
        case 2:
            var w = '( 화요일 )';
            break;
        case 3:
            var w = '( 수요일 )';
            break;
        case 4:
            var w = '( 목요일 )';
            break;
        case 5:
            var w = '( 금요일 )';
            break;
        case 6:
            var w = '( 토요일 )';
            break;
        default:
            var w = '( x요일 )';
    }
    var hour = day.getHours();
    if (hour < 10) hour = "0" + hour;
    var minute = day.getMinutes();
    if (minute < 10) minute = "0" + minute;
    var second = day.getSeconds();
    if (second < 10) second = "0" + second;

    $("#date_time").html(+y + "년 " + m + "월 " + d + "일 " + w + "  " + hour + " : " + minute + " : " + second);
    setTimeout("set_datetime()", 1000);
}

$(window).on("load", function() {

    if (localStorage.getItem("screen_type") == 'wide') {
        $('body').removeClass('boxed-layout');
        $('.wide-layout-btn').addClass('active-switcher-btn');
    } else {
        $('body').addClass('boxed-layout');
        $('.boxed-layout-btn').addClass('active-switcher-btn');
    }

    $('body').on('click', '.nav-page', function() {
        cur_page = parseInt($(this).text());
        refreshList();
    });

    $('body').on('click', '.prev-page', function() {
        if (cur_page == 1)
            return;
        cur_page -= 1;
        refreshList();
    });

    $('body').on('click', '.next-page', function() {
        if (cur_page == parseInt((total - 1) / per_page) + 1)
            return;
        cur_page += 1;
        refreshList();
    });

    $('body').on('click', '#search-btn', function() {
        cur_page = 1;
        refreshList();
    });
    $('body').on('keypress', '#search_str', function(event) {
        if (event.which == 13) {
            cur_page = 1;
            refreshList();
        }
    });

    $('body').on('click', '#search_btn_top', function() {
        on_search_top();
    });
    $('body').on('keypress', '#search_str_top', function(event) {
        if (event.which == 13) {
            on_search_top();
        }
    });

});

function init_article_fancybox() {
    $(".article-fancybox").fancybox({
        fitToView: false,
        width: '80%',
        height: '90%',
        autoSize: false,
        closeClick: false,
        closeEffect: 'elastic',
        openEffect: 'elastic',
        groupAttr: 'data-rel',
        prevEffect: 'fade',
        nextEffect: 'fade',
        closeBtn: true,
        helpers: {
            title: {
                type: 'float'
            }
        }
    });
}

function init_gallery_fancybox() {
    $(".gallery-fancybox").fancybox({
        fitToView: false,
        width: '90%',
        height: '70%',
        autoSize: true,
        closeClick: false,
        closeEffect: 'fade',
        openEffect: 'fade',
        groupAttr: 'data-rel',
        prevEffect: 'fade',
        nextEffect: 'fade',
        closeBtn: true,
        helpers: {
            title: {
                type: 'inside'
            }
        }
    });
}

function init_video_fancybox() {
    $(".video-fancybox").fancybox({
        fitToView: false,
        width: '70%',
        height: '50%',
        autoSize: true,
        closeClick: false,
        closeEffect: 'elastic',
        openEffect: 'elastic',
        groupAttr: 'data-rel',
        prevEffect: 'fade',
        nextEffect: 'fade',
        closeBtn: true,
        helpers: {
            title: {
                type: 'inside'
            }
        }
    });
}

function on_search_top() {
    var search_str = $('#search_str_top').val();

    var unallowed = new RegExp('[#%&?@!$^*()=+|/<>,.~`\'\"]', 'g'); 
    if (search_str.match(unallowed))
        search_str = search_str.replace(unallowed, ""); // 어느위치든지 # % & ? ' " 가 있는 경우 지우기
    var backslash = /\\/g; 
    if (search_str.match(backslash))
        search_str = search_str.replace(backslash, ""); //backslashe는 따로 지우자

    $('#search_str_top').val(search_str) ;
    if (search_str != '') {
        location.href = site_url + '/search/index?keyword=' + search_str;
    }

}

var LOADING = function() {
    return {
        show: function(options) {
            options = $.extend(true, {}, options);
            options.message = '적재중...';
            options.boxed = true;
            var html = '';
            if (options.animate) {
                html = '<div class="loading-message ' + (options.boxed ? 'loading-message-boxed' : '') + '">' + '<div class="block-spinner-bar"><div class="bounce1"></div><div class="bounce2"></div><div class="bounce3"></div></div>' + '</div>';
            } else if (options.iconOnly) {
                html = '<div class="loading-message ' + (options.boxed ? 'loading-message-boxed' : '') + '"><img src="' + site_url + '/assets/img/loading-spinner-grey.gif" align=""></div>';
            } else if (options.textOnly) {
                html = '<div class="loading-message ' + (options.boxed ? 'loading-message-boxed' : '') + '"><span>&nbsp;&nbsp;' + (options.message ? options.message : '적재중...') + '</span></div>';
            } else {
                html = '<div class="loading-message ' + (options.boxed ? 'loading-message-boxed' : '') + '"><img src="' + site_url + '/assets/img/loading-spinner-grey.gif" align=""><span>&nbsp;&nbsp;' + (options.message ? options.message : '적재중...') + '</span></div>';
            }

            if (options.target) { // element blocking
                var el = $(options.target);
                if (el.height() <= ($(window).height())) {
                    options.cenrerY = true;
                }
                el.block({
                    message: html,
                    baseZ: options.zIndex ? options.zIndex : 1000,
                    centerY: options.cenrerY !== undefined ? options.cenrerY : false,
                    css: {
                        top: '10%',
                        border: '0',
                        padding: '0',
                        backgroundColor: 'none'
                    },
                    overlayCSS: {
                        backgroundColor: options.overlayColor ? options.overlayColor : '#555',
                        opacity: options.boxed ? 0.2 : 0.4,
                        cursor: 'wait'
                    }
                });
            } else { // page blocking
                $.blockUI({
                    message: html,
                    baseZ: options.zIndex ? options.zIndex : 1000,
                    css: {
                        border: '0',
                        padding: '0',
                        backgroundColor: 'none'
                    },
                    overlayCSS: {
                        backgroundColor: options.overlayColor ? options.overlayColor : '#555',
                        opacity: options.boxed ? 0.05 : 0.1,
                        cursor: 'wait'
                    }
                });
            }
        },
        hide: function(target) {
            if (target) {
                $(target).unblock({
                    onUnblock: function() {
                        $(target).css('position', '');
                        $(target).css('zoom', '');
                    }
                });
            } else {
                $.unblockUI();
            }
        }

    };
}();

var StyleSwitcher = function() {

    return {
        initStyleSwitcher: function() {
            var panel = jQuery('.style-switcher');

            jQuery('.style-switcher-btn').click(function() {
                jQuery('.style-switcher').show();
            });

            jQuery('.theme-close').click(function() {
                jQuery('.style-switcher').hide();
            });

            //Boxed Layout
            jQuery('.boxed-layout-btn').click(function() {
                jQuery(this).addClass("active-switcher-btn");
                jQuery(".wide-layout-btn").removeClass("active-switcher-btn");
                jQuery("body").addClass("boxed-layout container");
            });
            jQuery('.wide-layout-btn').click(function() {
                jQuery(this).addClass("active-switcher-btn");
                jQuery(".boxed-layout-btn").removeClass("active-switcher-btn");
                jQuery("body").removeClass("boxed-layout container");
            });
        }
    };
}();

jQuery(document).ready(function() {
});

onmousewheel = function(event) {
    if (event.ctrlKey) {
        return false;
    }
};

oncontextmenu = function() {
    return false;
}

