getPageSize = function() {
        
     var xScroll, yScroll;
    
    if (window.innerHeight && window.scrollMaxY) {    
        xScroll = window.innerWidth + window.scrollMaxX;
        yScroll = window.innerHeight + window.scrollMaxY;
    } else if (document.body.scrollHeight > document.body.offsetHeight){ // all but Explorer Mac
        xScroll = document.body.scrollWidth;
        yScroll = document.body.scrollHeight;
    } else { // Explorer Mac...would also work in Explorer 6 Strict, Mozilla and Safari
        xScroll = document.body.offsetWidth;
        yScroll = document.body.offsetHeight;
    }
    
    var windowWidth, windowHeight;
    
    if (self.innerHeight) {    // all except Explorer
        if(document.documentElement.clientWidth){
            windowWidth = document.documentElement.clientWidth; 
        } else {
            windowWidth = self.innerWidth;
        }
        windowHeight = self.innerHeight;
    } else if (document.documentElement && document.documentElement.clientHeight) { // Explorer 6 Strict Mode
        windowWidth = document.documentElement.clientWidth;
        windowHeight = document.documentElement.clientHeight;
    } else if (document.body) { // other Explorers
        windowWidth = document.body.clientWidth;
        windowHeight = document.body.clientHeight;
    }    
    
    // for small pages with total height less then height of the viewport
    if(yScroll < windowHeight){
        pageHeight = windowHeight;
    } else { 
        pageHeight = yScroll;
    }

    // for small pages with total width less then width of the viewport
    if(xScroll < windowWidth){    
        pageWidth = xScroll;        
    } else {
        pageWidth = windowWidth;
    }

    return [pageWidth,pageHeight];
}

function getAgeFromBirthday(birthday, today) {
    var t_year = today.substring(0, 4);
    var t_m_day = today.substring(5, 10);
    
    var b_year = birthday.substring(0, 4);
    var b_m_day = birthday.substring(5, 10);
    
    if (t_m_day >= b_m_day)
        return t_year-b_year;
    else
        return t_year-b_year-1;
}

var _wait, _notify, myajax;
(function($){
    
    //validation functions
    $.fn.validRequired = function() {
        var valid = true;
        this.each(function(){
            $(this).find('.validation-failed').removeClass('validation-failed');
            $(this).find('input.required-entry, .required-entry input, textarea.required-entry').not(':hidden').each(function(){
                if ($(this).val() == '') {
                    $(this).addClass('validation-failed');
                    
                    valid = false;
                }
            });

            if (!valid) {
                $(this).find('.validation-failed').eq(0).focus();
            }
        });
        return valid;
    };
    $.fn.validEmail = function() {
        var email_exp = /^[\!\#$%\*/?|\^\{\}`~&\'\+\-=_a-z0-9][\!\#$%\*/?|\^\{\}`~&\'\+\-=_a-z0-9\.]{1,30}[\!\#$%\*/?|\^\{\}`~&\'\+\-=_a-z0-9]@([a-z0-9_-]{1,30}\.){1,5}[a-z]{2,4}$/i;
        var valid = true;
        this.each(function(){
            if ($(this).val() == '') return;
            //$(this).removeClass('validation-failed');
            if (email_exp.test($(this).val()) == false ) {
                valid = false;
            }
        });
        return valid;
    }
    $.fn.validDate = function() {
        var date_exp = /^(\d{4})-(\d{2})-(\d{2})$/;
        var valid = true;
        this.each(function(){
            if(date_exp.test($(this).val()) == false )
                valid = false;
        });
        return valid;
    }
    $.fn.validEngChar = function(){
        var eng_exp = /^[a-zA-Z]+$/;
        var valid = true;
        this.each(function(){
            if(eng_exp.test($(this).val()) == false )
                valid = false;
        });
        return valid;
    }
    // ===================================

    $.fn.disable = function() {
        this.each(function(){
            $(this).find('input').attr('disabled', true);
            $(this).find('select').attr('disabled', true);
            $(this).attr('disabled', true);
        });
    };

    $.fn.enable = function() {
        this.each(function(){
            $(this).find('input:disabled').removeAttr('disabled');
            $(this).find('select:disabled').removeAttr('disabled');
            $(this).removeAttr('disabled');
        });
    };
    
    $.fn.turnOffAutocomplete = function() {
        this.each(function(){
            $(this).attr({
                "autocomplete": "off"/*,
                "aria-autocomplete": "list",
                "aria-haspopup": "true"*/
            })

        });
    }
    
    $.fn.onEnter = function(callback) {
        this.each(function(){
            $(this).keydown(function(evt){
                if (evt.keyCode == 13)
                    callback();
            });
        });
    }

    $.fn.combine = function(separator) {
        var res = "";
        var is_first = 1;
        this.each(function(){
            if (is_first != 1) res += separator;
            else is_first = 0;
            res += $(this).val();
        });
        return res;
    };

    _wait = function(){
        $("body").append("<div id='loading_container'><div id='overlay'></div><div id='loader'></div></div>");
        
        var sizes = getPageSize();
        $("#overlay").width(sizes[0]);
        $("#overlay").height(sizes[1]);
        
        var left = (sizes[0] - $("#loader").width()) /2;
        var top = (sizes[1] - $("#loader").height()) /2;
        
        $("#loader").css("left", left+"px");
        $("#loader").css("top", top+"px");
        
        $("#loading_container").show(200, function(){
            $("#loading_container").focus();
        });
    }
    
    _notify = function(){
        $("#loading_container").hide(200, function(){
            $("#loading_container").remove();
        });
    }
    
    myajax = function(_url, _data, _dataType, _callback, _type) {
        //_data = _data.replace('+', '!');
        if (typeof(_type) == "undefined")
            _type = "POST";
        $.ajax({
            url: _url,
            type: _type,
            dataType: _dataType,
            data: _data,
            success: function( res ) {
                if (res == null) {
                    _callback(null);                    
                }
                if (_dataType == 'json' && res.code == 'redirect') {
                    document.location.href = res.url;
                    return;
                }
                if (_dataType == 'text' && res.substring(0, 8) == 'redirect') {
                    document.location.href = res.substring(9);
                    return;
                }
                
                _callback(res);
            },
            error: function( res ) {
                _callback(null);
            }
        });
    }
    
})(jQuery);

var _wait_div_count = 0;
function WaitStart(msg)
{
    _wait_div_count++;
    if (_wait_div_count > 1) return;
    if(msg == null || msg == "") msg = "Loading...";
    
    var sizes = getPageSize();
    
    var style="style='width:"+sizes[0]+"px;"+"height:"+sizes[1]+"px;'";
    htmltext ="<div class='temp_wait_div' "+style+" >";
    if(msg != null)    htmltext+="<span> " + msg + "</span>";
                    htmltext+="</div>";
    $("body").append(htmltext);
}

function WaitStop()
{
    _wait_div_count--;
    if (_wait_div_count > 0) return;
    $(".temp_wait_div").eq(0).remove();    
}
 

var version = parseInt(navigator.appVersion.substr(navigator.appVersion.indexOf('MSIE')+5, 3));
version = isNaN(version)?0:version;

function strlpad(str, nlen, padstr) {
    var len = str.length;
    for (i=0; i<nlen-len; i++)
        str = padstr+str;
    return str;
}

function timeValid(str)
{
	if (str == null || str == "")
		return false;
	if (str.length < 4)
		return false;

	var hour = str.substring(0,2);
	var min = str.substring(2);

	if (hour > 23)
		return false;
	if (min > 59)
		return false;
	return str;
}

function weekdayValid(str)
{
	var tmp = str.split(",");
	for (i=0; i<tmp.length; i++)
	{	if (tmp[i].length > 1) 
			return false;
		if (isNaN(tmp[i]) == true)
			return false;
		if (tmp[i] > 7 || tmp[i]<1)
			return false;
	}
	return str;
}

//input parameter:16JAN17 2016-01-02
//input parameter:15JAN
//output: 2017-01-01, false
function dateValid(str)
{
	var _months = new Array('JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC');
	var now = new Date();
	var thisYear = now.getFullYear();
//	alert(str.length); return;
	str = str.toUpperCase();
	if (str.length == 5 || str.length == 7 || str.length == 9)
	{
	var day,month,year;
	var rday,rmonth,ryear;

	if (str.length == 5)
	{
		rday = str.substring(0,2);
		rmonth = str.substring(2); 
		ryear = thisYear;

		day = parseInt(rday);
		month = rmonth;
		year = parseInt(ryear);
	}
	if (str.length == 7)
	{
		rday = str.substring(0,2);
		rmonth = str.substring(2,5); 
		ryear = "20" + str.substring(5);

		day = parseInt(rday);
		month = rmonth;
		year = parseInt(ryear);
	}
	if (str.length == 9)
	{
		rday = str.substring(0,2);
		rmonth = str.substring(2,5); 
		ryear = str.substring(5);

		day = parseInt(rday);
		month = rmonth;
		year = parseInt(ryear);
	}

	for (i=0; i<12; i++)
	{
		if (month == _months[i])
			break;
	}

	if (i == 12)
		return false;
	
	if (isNaN(day) == true)
		return false;

	if (day > 31) 
		return false;

	if (month == "FEB" && day > 29 && (year%4==0)) return false;
	if (month == "FEB" && day > 28 && (year%4!=0)) return false;
	if (month == "JAN" && day > 31) return false;
	if (month == "MAR" && day > 31) return false;
	if (month == "APR" && day > 30) return false;
	if (month == "MAY" && day > 31) return false;
	if (month == "JUN" && day > 30) return false;
	if (month == "JUL" && day > 31) return false;
	if (month == "AUG" && day > 31) return false;
	if (month == "SEP" && day > 30) return false;
	if (month == "OCT" && day > 31) return false;
	if (month == "NOV" && day > 30) return false;
	if (month == "DEC" && day > 31) return false;
	
	if (month == "JAN") rmonth = "01";
	if (month == "FEB") rmonth = "02";
	if (month == "MAR") rmonth = "03";
	if (month == "APR") rmonth = "04";
	if (month == "MAY") rmonth = "05";
	if (month == "JUN") rmonth = "06";
	if (month == "JUL") rmonth = "07";
	if (month == "AUG") rmonth = "08";
	if (month == "SEP") rmonth = "09";
	if (month == "OCT") rmonth = "10";
	if (month == "NOV") rmonth = "11";
	if (month == "DEC") rmonth = "12";

	return ryear + "-" + rmonth + "-" + rday;
}
	else
		return false;
}
