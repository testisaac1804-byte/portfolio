var total = 1;
var cur_page = 1;
var per_page = 10;
var kind = 'active';


if (document.documentElement.clientWidth < 767) {
    $(document).ready(function() {
        $('.search input').hide();
        $('#search-trigger').click(function() {
            $('.search input').slideToggle('fast').focus();
            $('.preheader .user, .preheader .phone').slideToggle('fast');
            $(this).toggleClass('active');
        });
    });
}

if (document.documentElement.clientWidth > 767) {
    $(document).ready(function() {
        $('.search input').hide();
        $('#search-trigger').click(function() {
            $('.search input').slideToggle('fast').focus();
            $(this).toggleClass('active');
        });
    });
}

var search_str = $('#search_str').val();
if(search_str != ''){
   
    refreshList();
}
// refreshList();
drawPagination(total, per_page, cur_page);
select_type(kind);


function refreshList() {

    var search_str = $('#search_str').val();
    if(search_str == ''){
        window.location.assign('/index.php/search/index');
        
    }
    if (search_str == undefined)
        return;
    var unallowed = new RegExp('[#%&?@!$^*()=+|/<>,.~`\'\"]', 'g'); 
    if (search_str.match(unallowed))
        search_str = search_str.replace(unallowed, ""); // 어느위치든지 # % & ? ' " 가 있는 경우 지우기
    var backslash = /\\/g; 
    if (search_str.match(backslash))
        search_str = search_str.replace(backslash, ""); //backslashe는 따로 지우자

    $('#search_str').val(search_str) ;
    if(search_str == ''){
        window.location.assign('/index.php/search/index');
        
    }

    $.post(site_url + '/search/get_lists', { type: kind, cur_page: cur_page, search_str: search_str, per_page: per_page },
        function(data) {

            var data = jQuery.parseJSON(data);

            var totalCount = (data.countResult['total'] == undefined) ? '0' : data.countResult['total'];
            var activeCount = (data.countResult['active'] == undefined) ? '0' : data.countResult['active'];
            var newsCount = (data.countResult['news'] == undefined) ? '0' : data.countResult['news'];
            var lawsCount = (data.countResult['laws'] == undefined) ? '0' : data.countResult['laws'];
            var todayCount = (data.countResult['today'] == undefined) ? '0' : data.countResult['today'];

            $('#total_count').html(totalCount);
            $('#active_count').html(activeCount);
            $('#news_count').html(newsCount);
            $('#laws_count').html(lawsCount);
            $('#today_count').html(todayCount);

            if (totalCount != '0')
                setRedColor('#total_count');

            if (activeCount != '0')
                setRedColor('#active_count');

            if (newsCount != '0')
                setRedColor('#news_count');

            if (lawsCount != '0')
                setRedColor('#laws_count');

            if (todayCount != '0')
                setRedColor('#today_count');

            total = data.countResult[kind];
            
            if (isNaN(total))
                total = 0;

            $('#search_list').html(data.list_html);
            if(total != 0 ){
                drawPagination(total, per_page, cur_page);
            }else{
                $('.pagination').html('');
            }
            //LOADING.hide();
        });

}


function select_type(type_str) {
    $('li').removeClass('active');
    $('#li_' + type_str).addClass('active');
    kind = type_str;
    cur_page = 1;
    refreshList();
}

function setRedColor(count_name) {

    $(count_name).removeClass('badge-blue');
    $(count_name).addClass('badge-red');
}