/*! counter.js : 홈페지호출분석을 위한 말단측 모듈
 * version: 4.0.3.0
 * 2022.7.6. kanegin.
 */
(function(win, doc, $) {
    "use strict";

    let swapp = "/";
    let shost = "";
    let wauri = "";
    let pfname = "";
    let pparams = "";
    let slang = "";
    let caption = "";

    win.analyzeHref = function() {
        shost = location.host;
        wauri = swapp;
        pfname = CURRENT_URL;
        pparams = "";
        let pos = location.href.indexOf("?");
        if (pos > -1) {
            let _end = location.href.indexOf("#", pos + 1);
            if (_end < 0)
                _end = location.href.length;
            pparams = location.href.substring(pos + 1, _end);
            pparams = pparams.replace(/&/ig, ",");
        }
        slang = $("meta[name='lang']").attr("content");
        if (null == slang || slang === "") { slang = "ko"; }
        if ($("h1").length)
            caption = $("h1")[0].innerText;
        else if ($("h2").length)
            caption = $("h2")[0].innerText;
        else if ($("h3").length)
            caption = $("h3")[0].innerText;
        else if ($("span.value.title").length)
            caption = $("span.value.title")[0].innerText.replace(/[()<>]/ig, "_");
        else if ($("span.title").length)
            caption = $("span.title")[0].innerText.replace(/[()<>]/ig, "_");
        else if ($("span#lblTitle").length)
            caption = $("span#lblTitle")[0].innerText.replace(/[()<>]/ig, "_");
        else if ($("p.leader_activity_title").length)
            caption = $("p.leader_activity_title")[0].innerText;
        //else if ($("title").length)
        //	caption = $("title")[0].innerText;
    }

    win.counter = function(tgt, title, params) {
        analyzeHref();
        let senddata = "shost=" + shost + "&wauri=" + wauri +
            "&pfname=" + (tgt == null ? pfname : tgt) +
            "&pparams=" + (params == null ? pparams : params) +
            "&title=" + (title == null ? caption : title) + "&slang=" + slang;
        $.ajax({
            type: "POST",
            url: SITE_URL + "counter",
            data: senddata,
            dataType: "xml",
            async: true,
            success: function(data) {
                //alert("return result:\n" + data.toString()) ;
            }
        });
    }

    $(doc).ready(function() {
        counter();
    });

})(window, document, jQuery);