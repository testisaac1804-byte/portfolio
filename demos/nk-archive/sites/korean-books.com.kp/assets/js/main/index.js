var dataType = '';
var displayMark = '';
var url = '';
var searchVal = '';
var page = 0;
var count = 1;
var lang = "ko";
var pageMark = 'p';
var total_cnt = 0;
var pageMarkCh1 = '';
var pageMarkCh2 = '';

var dropdownFlag = 0;

var title = new Array();

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
    title["en"]["picture album"] = "Picture Album";
    title["en"]["album"] = "Picture Album";
    title["en"]["cahier"] = "Leaflet";
    title["en"]["magazine"] = "Magazine";
    title["ko"] = new Array();
    title["ko"]["leader1"] = "위대한 수령 <nobr><strong STYLE='FONT-SIZE:14px;'>김일성</strong></nobr>동지의 로작";
    title["ko"]["leader2"] = "위대한 령도자 <nobr><strong STYLE='FONT-SIZE:14px;'>김정일</strong></nobr>동지의 로작";
    title["ko"]["leader3"] = "경애하는 <nobr><strong STYLE='FONT-SIZE:14px;'>김정은</strong></nobr>동지의 로작";
    title["ko"]["mountain"] = "잡지";
    title["ko"]["pictorial"] = "화보";
    title["ko"]["ordinary"] = "기타도서";
    title["ko"]["politics"] = "정치도서";
    title["ko"]["picture"] = "그림도서";
    title["ko"]["common"] = "상식도서";
    title["ko"]["history"] = "력사도서";
    title["ko"]["picture album"] = "화첩";
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
    title["fr"]["picture album"] = "Albums";
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
    title["sp"]["picture album"] = "Álbum";
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
    title["de"]["picture album"] = "Bildbände";
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
    title["ru"]["picture album"] = "Книга-альбом";
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
    title["ch"]["picture album"] = "画册";
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
    title["ja"]["picture album"] = "写真集";
    title["ja"]["album"] = "写真集";
    title["ja"]["cahier"] = "一般書";
    title["ar"] = new Array();
    title["ar"]["leader1"] = "مؤلف الرئيس <nobr><strong STYLE='FONT-SIZE:14px;'>كيم ايل سونغ</strong></nobr>";
    title["ar"]["leader2"] = "مؤلف القائد <nobr><strong STYLE='FONT-SIZE:14px;'>كيم جونغ ايل</strong></nobr>";
    title["ar"]["leader3"] = "مؤلف القائد <nobr><strong STYLE='FONT-SIZE:14px;'>كيم جونغ وون</strong></nobr>";
    title["ar"]["trade"] = "الكتاب العام";
    title["ar"]["pictorial"] = "الكتاب العام";
    title["ar"]["ordinary"] = "الكتاب العام";
    title["ar"]["politics"] = "الكتاب السياسي";
    title["ar"]["picture"] = "الكتاب العام";
    title["ar"]["common"] = "الكتاب العام";
    title["ar"]["history"] = "الكتاب العام";
    title["ar"]["picture album"] = "الألبوم";
    title["ar"]["album"] = "الألبوم";
    title["ar"]["cahier"] = "الكتاب العام";
    $('.dropdown-menu').hide();
    
    pageMark = $('#page').val();
    dataType = $('#type').val();
    lang = $('#lang').val();
    if(lang == "ch") {
        pageMarkCh1 = $('#pageCh').val().split('#')[0];
        pageMarkCh2 = $('#pageCh').val().split('#')[1];
    }

    total_cnt = $('#total').val();
    if($('#searchval').val()) {
        searchVal = decodeURIComponent($('#searchval').val());
        $('#HfSearchBox').val(searchVal);
    }
    if($('#subpage').val() == "pictorialkorea")
    {
        getByCategory('periodic', 'pictorial');
    }
    if($('#subpage').val() == "mountainkorea")
    {
        getByCategory('periodic', 'mountain');
    }
    if($('#subpage').val() == "tradekorea")
    {
        getByCategory('periodic', 'trade');
    }
    viewtable();
});

function viewtable() {
    var path = dataType;
    var mark = "";
    if(path == "album")
        mark = "picture album";
    $.getJSON('/index.php/Main/category/', {dataType, lang}, function(category) {
        $.getJSON('/index.php/Main/search/', {dataType, displayMark, page, searchVal, lang}, function (res) {
            var html = '';
            html += '<div style="margin: 0 auto">';
            html += '<div id="MfNavFrame">';
            for(var k = 0; k < category.length; k ++) {
                html += '<h3 id="'+ category[k].pDisplayMark +'" class="MfniActive" onclick="getByCategory(`' + category[k].pCategory + '`,`' + category[k].pDisplayMark + '`)">'+ category[k].pTitle +'</h3>'
            }
            html += '</div>';
            html += '<div class="totalCnt">';
            html += total_cnt;
            html += " (" + res.total + ") ";
            html += '</div>';
            html += '<div id="MfGallery">';
            html += '<table cellspacing="10px">';
            html += '<tbody>';
            for(var i = 0; i < res.data.length; i +=2) {
                if(path != "album")
                    mark = res.data[i].pDisplayMark;
                html += '<tr>';
                    for(var j = i; j <= i + 1; j ++) {
                        if( j == res.data.length)
                            continue;
                        if(path != "album")
                            mark = res.data[j].pDisplayMark;
                        if(res.data[j].pCategory == 'album')
                            mark = 'album';
                        html += '<td class="xGalleryFrame">';
                        html += '<table width="120px">';
                        html += '<tbody>';
                        html += '<tr>';
                        html += '<td width="120px" height="120px">';
                        html += '<img alt="KBMimage" height="100px" src="/KBMimages/'+ lang +'/'+ res.data[j].pCategory +'/'+ res.data[j].pDisplayMark +'/'+ res.data[j].pMName +'" onclick="window.open(`/KBMbooks/'+ lang +'/'+ res.data[j].pCategory +'/'+ res.data[j].pDisplayMark +'/' + res.data[j].pFName + '`)"/>';
                        html += '</td>';
                        html += '</tr>';
                        html += '</tbody>';
                        html += '</table>';
                        html += '<div class="xGalleryItemFrame">';
                        html += '<h6>';
                        html += '- ' + title[lang][mark] + ' -';
                        html += '</h6>';
                        html += '<p>';
                        html += '<a href="/KBMbooks/'+ lang +'/'+ res.data[j].pCategory +'/'+ res.data[j].pDisplayMark +'/'+ res.data[j].pFName +'", target="_blank">';
                        html += searchTxt(res.data[j].pTitle);
                        html += '</a>';
                        html += '</p>';
                        html += '<h4>';
                        html += res.data[j].pPubUnit;
                        html += '</h4>';
                        html += '<h1>';
                        html += res.data[j].pPubDate;
                        html += '</h1>';
                        if(lang == "ch") {
                            html += '<h5>';
                            html += '('+ pageMarkCh1 + res.data[j].pPageNum + " " + pageMarkCh2 +')';
                            html += '</h5>';
                        } else {
                            html += '<h5>';
                            html += '('+ res.data[j].pPageNum + ' ' + pageMark +')';
                            html += '</h5>';
                        }
                        html += '<p align="center">';
                        html += '<img alt="KBMimage" src="/assets/images/download-' + lang + '.gif" onclick="window.open(`/KBMbooks/'+ lang +'/'+ res.data[j].pCategory +'/'+ res.data[j].pDisplayMark +'/' + res.data[j].pFName + '`)" />';
                        html += '</p>';
                        html += '</div>';
                        html += '</td>';
                    }
                }
                html += '</tr>';
            // }
            html += '</tbody>';
            html += '</table>';
            html += '</div>';
            html += '<div class="pagenation">';
            var pages = 1;
            var pageNum = 8;
            pages = Math.ceil(res.total / pageNum);
            count = pages;
            // for(var l = 0; l < pages; l ++) {
            //     html += '<span class="Mfpn-visit" onclick="getByPage('+ l +')">'+ (l + 1) +'</span>';
            // }
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
            if(displayMark)
                $('#MfNavFrame #' + displayMark).addClass('MfniSelected');
            if(dataType == "total") {
                $('#HfgnAll').addClass('HfgnSelect');
                $('#HfgnWork').removeClass('HfgnSelect');
                $('#HfgnPeriodic').removeClass('HfgnSelect');
                $('#HfgnBook').removeClass('HfgnSelect');
                $('#HfgnAlbum').removeClass('HfgnSelect');
                $('#HfgnEtc').removeClass('HfgnSelect');
            }
            if(dataType == "work") {
                $('#HfgnWork').addClass('HfgnSelect');
                $('#HfgnEtc').removeClass('HfgnSelect');
                $('#HfgnPeriodic').removeClass('HfgnSelect');
                $('#HfgnBook').removeClass('HfgnSelect');
                $('#HfgnAlbum').removeClass('HfgnSelect');
                $('#HfgnAll').removeClass('HfgnSelect');
            }
            if(dataType == "periodic") {
                $('#HfgnPeriodic').addClass('HfgnSelect');
                $('#HfgnWork').removeClass('HfgnSelect');
                $('#HfgnEtc').removeClass('HfgnSelect');
                $('#HfgnBook').removeClass('HfgnSelect');
                $('#HfgnAlbum').removeClass('HfgnSelect');
                $('#HfgnAll').removeClass('HfgnSelect');
            }
            if(dataType == "book") {
                $('#HfgnBook').addClass('HfgnSelect');
                $('#HfgnWork').removeClass('HfgnSelect');
                $('#HfgnPeriodic').removeClass('HfgnSelect');
                $('#HfgnAll').removeClass('HfgnSelect');
                $('#HfgnAlbum').removeClass('HfgnSelect');
                $('#HfgnEtc').removeClass('HfgnSelect');
            }
            if(dataType == "album") {
                $('#HfgnAlbum').addClass('HfgnSelect');
                $('#HfgnWork').removeClass('HfgnSelect');
                $('#HfgnPeriodic').removeClass('HfgnSelect');
                $('#HfgnBook').removeClass('HfgnSelect');
                $('#HfgnAll').removeClass('HfgnSelect');
                $('#HfgnEtc').removeClass('HfgnSelect');
            }
            if(dataType == "etc") {
                $('#HfgnEtc').addClass('HfgnSelect');
                $('#HfgnWork').removeClass('HfgnSelect');
                $('#HfgnPeriodic').removeClass('HfgnSelect');
                $('#HfgnBook').removeClass('HfgnSelect');
                $('#HfgnAlbum').removeClass('HfgnSelect');
                $('#HfgnAll').removeClass('HfgnSelect');
            }
        })
    })
    
}

function searchTxt(str) {
    var reg = new RegExp(searchVal, "i");
    var res = str.replace(reg, "<strong>" + searchVal + "</strong>");
    
    // res = str.replace(searchVal.toUpperCase(), "<strong>" + searchVal.toUpperCase() + "</strong>");
    // res = res.replace(searchVal.toLowerCase(), "<strong>" + searchVal.toLowerCase() + "</strong>");
    return res;
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

function getByCategory(category, mark) {
    displayMark = mark;
    dataType = category;
    page = 0;
    viewtable();
}

function getByPage() {
    if($('#curPage').val() > 0 && $('#curPage').val() <= count) {
        page = $('#curPage').val() - 1;
        viewtable();
    }
}

function search() {
    searchVal = $('#HfSearchBox').val();
    viewtable();
}

$('.Language').change(function () {
    lang = $('.Language option:selected').val();
    window.open('/index.php/Main/index/'+ dataType +'/'+ lang +'', '_self');
    // viewtable();
});

function logo() {
    window.open('/index.php/Main/firstpage/'+ lang +'', '_self');
}

$('#HfgnFirst').click( function () {
    window.open('/index.php/Main/index/firstpage/'+ lang +'', '_self');
} )
$('#HfgnWork').click( function () {
    window.open('/index.php/Main/index/work/'+ lang +'', '_self');
} )
$('#HfgnPeriodic').click( function () {
    window.open('/index.php/Main/index/periodic/'+ lang +'', '_self');
} )
$('#HfgnBook').click( function () {
    window.open('/index.php/Main/index/book/'+ lang +'', '_self');
} )
$('#HfgnAlbum').click( function () {
    window.open('/index.php/Main/index/album/'+ lang +'', '_self');
} )
$('#HfgnEtc').click( function () {
    window.open('/index.php/Main/index/etc/'+ lang +'', '_self');
} )
$('#HfgnAll').click( function () {
    window.open('/index.php/Main/index/total/'+ lang +'', '_self');
} )

$('.dropdownBtn').click( function () {
    dropdownFlag = 1 - dropdownFlag;
    if(dropdownFlag == 1) {
        $('.dropdown-menu').show();
    } else {
        $('.dropdown-menu').hide();
    }
} )