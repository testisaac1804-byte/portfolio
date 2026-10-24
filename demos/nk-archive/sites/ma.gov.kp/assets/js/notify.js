$(document).ready(function() {


    $.post(site_url + '/notify/getCountsByKind',
        function(data) {

            var datas = jQuery.parseJSON(data);
            console.log(datas);
            var item;
            for (item in datas) {
                var szId = '#' + datas[item].Kind + '_label_count';
                var counts = datas[item].counts;
                $(szId).html(counts);
                $(szId).css("visibility", "visible")
            }

        });
});