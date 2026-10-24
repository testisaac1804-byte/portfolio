function noBrConvert(v) {
    if (!v) {
        return '';
    }
    var vr = new String(v);

    var rg1 = new RegExp('김일성', 'g');
    var rg2 = new RegExp('김정일', 'g');
    var rg3 = new RegExp('김정은', 'g');
    var rg4 = new RegExp('<br />', 'g');
    vr = vr.replace(rg1, '<nobr><b>김일성</b></nobr>');
    vr = vr.replace(rg2, '<nobr><b>김정일</b></nobr>');
    vr = vr.replace(rg3, '<nobr><b>김정은</b></nobr>');
    vr = vr.replace(rg4, '<br /><span class="indent"></span>');

    rg1 = new RegExp('Kim Il Sung', 'g');
    rg2 = new RegExp('Kim Jong Il', 'g');
    rg3 = new RegExp('Kim Jong Un', 'g');
    vr = vr.replace(rg1, '<nobr style="font-size: 1.1em;"><b>Kim Il Sung</b></nobr>');
    vr = vr.replace(rg2, '<nobr style="font-size: 1.1em;"><b>Kim Jong Il</b></nobr>');
    vr = vr.replace(rg3, '<nobr style="font-size: 1.1em;"><b>Kim Jong Un</b></nobr>');

    rg1 = new RegExp('Ким Ир Сена', 'g');
    rg2 = new RegExp('Ким Чен Ира', 'g');
    rg3 = new RegExp('Ким Чен Ун', 'g');
    vr = vr.replace(rg1, '<nobr style="font-size: 1.1em;"><b>Ким Ир Сена</b></nobr>');
    vr = vr.replace(rg2, '<nobr style="font-size: 1.1em;"><b>Ким Чен Ира</b></nobr>');
    vr = vr.replace(rg3, '<nobr style="font-size: 1.1em;"><b>Ким Чен Ун</b></nobr>');

    rg1 = new RegExp('金日成', 'g');
    rg2 = new RegExp('金正日', 'g');
    rg3 = new RegExp('金正恩', 'g');
    vr = vr.replace(rg1, '<nobr style="font-size: 1.1em;"><b>金日成</b></nobr>');
    vr = vr.replace(rg2, '<nobr style="font-size: 1.1em;"><b>金正日</b></nobr>');
    vr = vr.replace(rg3, '<nobr style="font-size: 1.1em;"><b>金正恩</b></nobr>');

    return vr;
}

function base_url($uri)
{
    var $base_url = $("#base_url").val();
    var $complete_url = $base_url + $uri;

    if ($uri !=null && $uri.substr(0, 1) == '/')
        $complete_url = $base_url + $uri.substr(1);

    return $complete_url;
}

$(window).on("scroll", function () {
    if($(window).scrollTop() >= 150)
    {
        // $("header>div.nav-bar").css("position","fixed");
        $('.scroll-to-top').fadeIn(300);
    }
    else if($(window).scrollTop() < 150)
    {
        // $("header>div.nav-bar").css("position","static");
        $('.scroll-to-top').fadeOut(300);
    }
});


