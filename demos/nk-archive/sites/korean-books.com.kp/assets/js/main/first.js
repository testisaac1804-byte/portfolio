var lang = "ko";
var page = 0;
var count = 1;
var title = new Array();
var mark1 = "";
var mark2 = "";
var flag = 0;
var dropdownFlag = 0;

$(document).ready(function () {
    title["en"] = new Array();
    title["en"]["leader1"] = "<nobr><strong STYLE='FONT-SIZE:14px;'>Kim Il Sung</strong></nobr>'s Works";
    title["en"]["leader2"] = "<nobr><strong STYLE='FONT-SIZE:14px;'>Kim Jong Il</strong></nobr>'s Works";
    title["en"]["leader3"] = "<nobr><strong STYLE='FONT-SIZE:14px;'>Kim Jong Un</strong></nobr>'s Works";
    title["en"]["trade"] = "Magazine";
    title["en"]["pictorial"] = "Pictorial";
    title["en"]["ordinary"] = "Other book";
    title["en"]["politics"] = "Book on Politics";
    title["en"]["picture"] = "Illustrated Book";
    title["en"]["common"] = "Book on Common Sense";
    title["en"]["history"] = "Book on History";
    title["en"]["album"] = "Picture Album";
    title["en"]["cahier"] = "Leaflet";
    title["ko"] = new Array();
    title["ko"]["leader1"] = "위대한 수령 <nobr><strong STYLE='FONT-SIZE:14px;'>김일성</strong></nobr>동지의 로작";
    title["ko"]["leader2"] = "위대한 령도자 <nobr><strong STYLE='FONT-SIZE:14px;'>김정일</strong></nobr>동지의 로작";
    title["ko"]["leader3"] = "경애하는 <nobr><strong STYLE='FONT-SIZE:14px;'>김정은</strong></nobr>동지의 로작";
    title["ko"]["mountain"] = "잡지";
    title["ko"]["pictorial"] = "화보";
    title["ko"]["ordinary"] = "Other book";
    title["ko"]["politics"] = "Book on Politics";
    title["ko"]["picture"] = "Illustrated Book";
    title["ko"]["common"] = "상식도서";
    title["ko"]["history"] = "Book on History";
    title["ko"]["album"] = "화첩";
    title["ko"]["cahier"] = "접지";
    title["ko"]["post"] = "엽서";
    title["fr"] = new Array();
    title["fr"]["leader1"] = "Ouvrage de <nobr><strong STYLE='FONT-SIZE:14px;'>Kim Il Sung</strong></nobr>";
    title["fr"]["leader2"] = "Ouvrage de <nobr><strong STYLE='FONT-SIZE:14px;'>Kim Jong Il</strong></nobr>";
    title["fr"]["leader3"] = "Ouvrage de <nobr><strong STYLE='FONT-SIZE:14px;'>Kim Jong Un</strong></nobr>";
    title["fr"]["trade"] = "Revue";
    title["fr"]["pictorial"] = "Revue illustrée";
    title["fr"]["ordinary"] = "Autre livre";
    title["fr"]["politics"] = "Livre politique";
    title["fr"]["picture"] = "Illustrated Book";
    title["fr"]["common"] = "Livre de connaissances générales";
    title["fr"]["history"] = "Livre historique";
    title["fr"]["album"] = "Albums";
    title["fr"]["cahier"] = "Leaflet";
    title["sp"] = new Array();
    title["sp"]["leader1"] = "Obra de <nobr><strong STYLE='FONT-SIZE:14px;'>Kim Il Sung</strong></nobr>";
    title["sp"]["leader2"] = "Obra de <nobr><strong STYLE='FONT-SIZE:14px;'>Kim Jong Il</strong></nobr>";
    title["sp"]["leader3"] = "Obra de <nobr><strong STYLE='FONT-SIZE:14px;'>Kim Jong Un</strong></nobr>";
    title["sp"]["trade"] = "Revista";
    title["sp"]["pictorial"] = "Revista ilustrada";
    title["sp"]["ordinary"] = "Otro";
    title["sp"]["politics"] = "Política";
    title["sp"]["picture"] = "Otro";
    title["sp"]["common"] = "Otro";
    title["sp"]["history"] = "Otro";
    title["sp"]["album"] = "Álbum";
    title["sp"]["cahier"] = "Leaflet";
    title["de"] = new Array();
    title["de"]["leader1"] = "<nobr><strong STYLE='FONT-SIZE:14px;'>Kim Il Sung</strong></nobr>s Werk";
    title["de"]["leader2"] = "<nobr><strong STYLE='FONT-SIZE:14px;'>Kim Jong Il</strong></nobr>s Werk";
    title["de"]["leader3"] = "<nobr><strong STYLE='FONT-SIZE:14px;'>Kim Jong Un</strong></nobr>s Werk";
    title["de"]["trade"] = "Revista";
    title["de"]["pictorial"] = "Revista ilustrada";
    title["de"]["ordinary"] = "Anderes Buch";
    title["de"]["politics"] = "Politisches Buch";
    title["de"]["picture"] = "Anderes Buch";
    title["de"]["common"] = "Anderes Buch";
    title["de"]["history"] = "Anderes Buch";
    title["de"]["album"] = "Bildbände";
    title["de"]["cahier"] = "Leaflet";
    title["ru"] = new Array();
    title["ru"]["leader1"] = "Труд <nobr><strong STYLE='FONT-SIZE:14px;'>Ким Ир Сена</strong></nobr>";
    title["ru"]["leader2"] = "Труд <nobr><strong STYLE='FONT-SIZE:14px;'>Ким Чен Ира</strong></nobr>";
    title["ru"]["leader3"] = "Труд <nobr><strong STYLE='FONT-SIZE:14px;'>Ким Чен Ына</strong></nobr>";
    title["ru"]["trade"] = "Журнал «Внешняя торговля Кореи»";
    title["ru"]["pictorial"] = "Иллюстрированный журнал «Корея»";
    title["ru"]["mountain"] = "Журнал «Кымсугансан»";
    title["ru"]["ordinary"] = "Книги";
    title["ru"]["politics"] = "Политическая литература";
    title["ru"]["picture"] = "Книги";
    title["ru"]["common"] = "Книги";
    title["ru"]["history"] = "Книги";
    title["ru"]["album"] = "Книга-альбом";
    title["ru"]["cahier"] = "Другое";
    title["ch"] = new Array();
    title["ch"]["leader1"] = "<nobr><strong STYLE='FONT-SIZE:14px;'>金日成</strong></nobr>著作";
    title["ch"]["leader2"] = "<nobr><strong STYLE='FONT-SIZE:14px;'>金正日</strong></nobr>著作";
    title["ch"]["leader3"] = "<nobr><strong STYLE='FONT-SIZE:14px;'>金正恩</strong></nobr>著作";
    title["ch"]["trade"] = "杂志";
    title["ch"]["pictorial"] = "画报";
    title["ch"]["ordinary"] = "普通图书";
    title["ch"]["politics"] = "政治图书";
    title["ch"]["picture"] = "普通图书";
    title["ch"]["common"] = "普通图书";
    title["ch"]["history"] = "普通图书";
    title["ch"]["album"] = "画册";
    title["ch"]["cahier"] = "其他";
    title["ja"] = new Array();
    title["ja"]["leader1"] = "<nobr><strong STYLE='FONT-SIZE:14px;'>金日成</strong></nobr>同志の著作";
    title["ja"]["leader2"] = "<nobr><strong STYLE='FONT-SIZE:14px;'>金正日</strong></nobr>同志の著作";
    title["ja"]["leader3"] = "<nobr><strong STYLE='FONT-SIZE:14px;'>金正恩</strong></nobr>同志の著作";
    title["ja"]["trade"] = "雑誌";
    title["ja"]["pictorial"] = "画报";
    title["ja"]["ordinary"] = "一般書";
    title["ja"]["politics"] = "政治図書";
    title["ja"]["picture"] = "一般書";
    title["ja"]["common"] = "一般書";
    title["ja"]["history"] = "一般書";
    title["ja"]["album"] = "写真集";
    title["ja"]["cahier"] = "一般書";
    title["ar"] = new Array();
    title["ar"]["leader1"] = "مؤلف الرئيس <nobr><strong STYLE='FONT-SIZE:14px;'>كيم ايل سونغ</strong></nobr>";
    title["ar"]["leader2"] = "مؤلف القائد <nobr><strong STYLE='FONT-SIZE:14px;'>كيم جونغ ايل</strong></nobr>";
    title["ar"]["leader3"] = "مؤلف القائد الأعلى المحترم <nobr><strong STYLE='FONT-SIZE:14px;'>كيم جونغ وون</strong></nobr>";
    title["ar"]["trade"] = "الكتاب العام";
    title["ar"]["pictorial"] = "الكتاب العام";
    title["ar"]["ordinary"] = "الكتاب العام";
    title["ar"]["politics"] = "الكتاب السياسي";
    title["ar"]["picture"] = "الكتاب العام";
    title["ar"]["common"] = "الكتاب العام";
    title["ar"]["history"] = "الكتاب العام";
    title["ar"]["album"] = "الألبومات";
    title["ar"]["cahier"] = "الكتاب العام";
    $('.dropdown-menu').hide();
    lang = $('#lang').val();
    mark1 = $('#mark1').val();
    mark2 = $('#mark2').val();
    $('#PlNewBookFrame1 h6').html(title[lang][mark1]);
    $('#PlNewBookFrame2 h6').html(title[lang][mark2]);
    $('#PlBookFrame1 h6').html(title[lang][mark1]);
    $('#PlBookFrame2 h6').html(title[lang][mark2]);

});

$('.Language').change(function () {
    lang = $('.Language option:selected').val();
    if(flag == 1)
        viewtable();
    else
        viewpage();
});

function viewpage() {
    window.open('/index.php/Main/firstpage/'+ lang +'', '_self');
}

function times() {
    window.open('http://www.dprkportal.kp', '_blank');
}

function korea() {
    window.open('/index.php/Main/periodic/'+ lang +'/pictorialkorea', '_blank');
}

function kumsu() {
    window.open('/index.php/Main/periodic/ko/mountainkorea', '_blank');
}

function trade() {
    var temp = lang;
    if(temp == "ko")
        temp = "en";
    window.open('/index.php/Main/periodic/'+ temp +'/tradekorea', '_blank');
}

function search() {
    var searchVal = $('#HfSearchBox').val();
    window.open('/index.php/Main/total/'+ lang +'/'+ searchVal +'', '_self')
}

function contact() {
    viewtable();
}

function viewtable() {
    $('#HfgnFirst').addClass('HfgnActive');
    $('#HfgnFirst').removeClass('HfgnSelect');
    flag = 1;
    var mark = "";
    $.getJSON('/index.php/Main/getlist/', { page, lang }, function (res) {
        var html = '';
        html += '<div id = "ListFrame">';
        html += '<div id = "ListTableFrame">';
        html += '<table>';
        html += '<tbody>';
        html += '</tbody>';
        for( var i = 0; i < res.data.length; i ++ ) {
            mark = res.data[i].pDisplayMark;
            if(res.data[i].pCategory == "album")
                mark = "album";
            html += '<tr>';
            html += '<td width="20" align="center">';
            html += page * 10 + i + 1;
            html += '</td>';
            html += '<td width="500" align="left">';
            html += '<p>';
            html += '<a href="/KBMbooks/'+ lang +'/'+ res.data[i].pCategory +'/'+ res.data[i].pDisplayMark +'/'+ res.data[i].pFName +'", target="_blank">';
            html += res.data[i].pTitle;
            html += '</a>';
            html += '</p>';
            html += '</td>';
            html += '<td width="80" align="center">';
            html += title[lang][mark];
            html += '</td>';
            html += '<td width="220" align="center">';
            html += res.data[i].pPubUnit;
            html += '</td>';
            html += '<td width="100" align="center">';
            html += res.data[i].pPubDate;
            html += '</td>';
            html += '<td width="80" align="center">';
            html += res.data[i].pPageNum;
            html += '</td>';
            html += '</tr>';
        }
        html += '</table>';
        html += '</div>'
        html += '<div class="pagenation">';
        var pages = 1;
        var pageNum = 10;
        pages = Math.ceil(res.total / pageNum);
        count = pages;
        html += '<img alt="KBMimage" src="/assets/images/first.gif" onclick="goFirst()" />';
        html += '<img alt="KBMimage" src="/assets/images/prev.gif" onclick="goPrev()" />';
        html += '<input id="curPage" onchange="getByPage()">';
        html += " / " + pages;
        html += '<img alt="KBMimage" src="/assets/images/next.gif" onclick="goNext()" />';
        html += '<img alt="KBMimage" src="/assets/images/last.gif" onclick="goLast()" />'
        html += '</div>';
        html += '</div>';
        $('.MainFrame').html(html);
        $('.SplitFrame').html('');
        $('.SubFrame').html('');
        $('#curPage').val(page + 1);
    })
}

function getByPage() {
    page = $('#curPage').val() - 1;
    viewtable();
}

function goFirst() {
    page = 0;
    viewtable();
}

function goLast() {
    page = count - 1;
    viewtable();
}

function goPrev() {
    if(page > 0) {
        page = page - 1;
        viewtable();
    }
}

function goNext() {
    if(page < count - 1) {
        page = page + 1;
        viewtable();
    }
}

$('.dropdownBtn').click( function () {
    dropdownFlag = 1 - dropdownFlag;
    if(dropdownFlag == 1) {
        $('.dropdown-menu').show();
    } else {
        $('.dropdown-menu').hide();
    }
} )