/**
 * Created by EBZ_KDH on 4/23/2021.
 */
var validation, switch_flight_type, toggle_flight_type;
var bookable_date = "<?php echo $bookable_date ?>";
(function($){
    $(document).ready(function(){
        validation = function() {
            if ($('#depart_station_no').val() == "") {
                alert("[[label _='Please select a departure station.']]");
                return false;
            }
            if ($('#arrive_station_no').val() == "") {
                alert("[[label _='Please select a arrival station.']]");
                return false;
            }
            if ($('#depart_station_no').val() == $('#arrive_station_no').val()) {
                alert("[[label _='Please check your flight stations.']]");
                return false;
            }

            if ($('#depart_date').hasClass("def-label") || $('#depart_date').val()=="") {
                alert("[[label _='Please enter a depature date.']]");
                return false;
            } else if ($('#depart_date').validDate() === false) {
                alert("[[label _='Please enter a valid depature date.']]");
                return false;
            }
            if ($('#depart_date').val() < bookable_date) {
                alert("[[label _='Flights should be booked %d days before taking off.' 1=$smarty.const.BOOKABLE_DAYS]]");
                return false;
            }

            if ($('#flight_type').val() == "RT") {
                if ($('#return_date').hasClass("def-label") || $('#return_date').val()=="") {
                    alert("[[label _='Please enter a returning date.']]");
                    return false;
                } else if ($('#return_date').validDate() === false || $('#return_date').val()<$('#depart_date').val() ) {
                    alert("[[label _='Please enter a valid returning date.']]");
                    return false;
                }
            }

            var num_adults = $("[name='flight[booking_num_adu]']").val();
            var num_children = $("[name='flight[booking_num_chi]']").val();
            var num_infants = $("[name='flight[booking_num_inf]']").val();
            if (isNaN(num_adults)) {
                alert("[[label _='Please select a valid adult nums.']]");
                return false;
            }
            if (isNaN(num_children)) {
                alert("[[label _='Please select a valid children nums.']]");
                return false;
            }
            if (isNaN(num_infants)) {
                alert("[[label _='Please select a valid infant nums.']]");
                return false;
            }
            if (num_adults+num_children+num_infants == 0) {
                alert("[[label _='Please select at least one passenger.']]");
                return false;
            }
            //if (num_infants > 0 && num_adults==0) {
            if (num_adults==0) {
                alert("[[label _='Please select at least one adult.']]");
                return false;
            }

            $('#sform').submit();
        }

        switch_flight_type = function(ftype) {
            if (ftype == "") ftype = "RT";
            $('#flight_type_selector a').removeClass("active");
            if (ftype == "OW") {
                $('#selector_image').removeClass("on");
                $('#selector_image').prev().children('a').addClass("active");
                $('.td-return').hide();
                $('#btn_search').parent().attr("colspan", "4");
            } else if (ftype == "RT") {
                $('#selector_image').addClass("on");
                $('#selector_image').next().children('a').addClass("active");
                $('.td-return').show();
                $('#btn_search').parent().attr("colspan", "2");
            }
            $('#flight_type').val(ftype);
        }
        toggle_flight_type = function() {
            if ($('#selector_image').hasClass("on"))
                switch_flight_type("OW");
            else
                switch_flight_type("RT");
        }
    });

})(jQuery);