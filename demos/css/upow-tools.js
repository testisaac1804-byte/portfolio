var _hmt = _hmt || [];
function initBaiduHmt(baiduHmt){
	if(baiduHmt){
		var ssrc = $("script")[0].src;
		var tssrc = ssrc.substring(0,ssrc.indexOf("resources"));
		
	}
}
initBaiduHmt((typeof baiduHmt=="undefined")?true:baiduHmt);
// 获取IE版本
$.ieVersion = function() {
    // 取得浏览器的userAgent字符串
    var userAgent = navigator.userAgent;
    // 判断是否为小于IE11的浏览器
    var isLessIE11 = userAgent.indexOf('compatible') > -1 && userAgent.indexOf('MSIE') > -1;
    // 判断是否为IE的Edge浏览器
    var isEdge = userAgent.indexOf('Edge') > -1 && !isLessIE11;
    // 判断是否为IE11浏览器
    var isIE11 = userAgent.indexOf('Trident') > -1 && userAgent.indexOf('rv:11.0') > -1;
    if (isLessIE11) {
        var IEReg = new RegExp('MSIE (\\d+\\.\\d+);');
        // 正则表达式匹配浏览器的userAgent字符串中MSIE后的数字部分，，这一步不可省略！！！
        IEReg.test(userAgent);
        // 取正则表达式中第一个小括号里匹配到的值
        var IEVersionNum = parseFloat(RegExp['$1']);
        if (IEVersionNum === 7) {
            // IE7
            return 7;
        } else if (IEVersionNum === 8) {
            // IE8
            return 8;
        } else if (IEVersionNum === 9) {
            // IE9
            return 9;
        } else if (IEVersionNum === 10) {
            // IE10
            return 10;
        } else {
            // IE版本<7
            return 6;
        }
    } else if (isEdge) {
        // edge
        return 11;
    } else if (isIE11) {
        // IE11
        return 11;
    } else {
        // 不是ie浏览器
        return -1;
    }
}
// Figure out what browser is being used
$.browser = {
    msie: (/msie/.test(navigator.userAgent.toLowerCase())||/trident/.test(navigator.userAgent.toLowerCase()) )&& !/opera/.test(navigator.userAgent.toLowerCase())
};
//初始化省略号
$.initEll = function() {
    if($.browser.msie){
        $(".ell-two").each(function () {
            var val_line_height = parseInt($(this).css("line-height").substring(-1,2));
            var val_height = $(this).height();
            if(val_height>val_line_height*2){
                $(this).height(val_line_height*2);
                $(this).addClass("ell-after");
            }
        })
        $(".ell-three").each(function () {
            var val_line_height = parseInt($(this).css("line-height").substring(-1,2));
            var val_height = $(this).height();
            if(val_height>val_line_height*3){
                $(this).height(val_line_height*3);
                $(this).addClass("ell-after");
            }
        })
    }
}

//加载组件
$.loadComponents = function (name,url) {
    $.ajax({
        type:"get",
        url:webRoot+"/resources/components/"+name+".ftl",
        async:true,
        success:function (data) {
            var reg = new RegExp("\\$\\{rc\\.contextPath\\}","g");
            data = data.replace(reg,webRoot);
            if(url!=undefined){
                reg = new RegExp("\\$\\{right\\-2\\-url\\}","g");
                data = data.replace(reg,url);
            }
            $("#Components-"+name).after(data);
        },
        error:function (data) {
            console.log("组件"+name+"加载失败，原因"+data);
        }
    })
}

