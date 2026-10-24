function gf_func_keydown( event )
{
	if( event.keyCode == 13 ){
		return true;
	}
	else{
		formAllow(event, "k");
	}
}
function formAllow(evt, str)
{
	evt = (evt) ? evt : window.event;

	var elem = (evt.target) ? evt.target : ((evt.srcElement) ? evt.srcElement : null); 

	if ((/(\S+)/).test(str)) {

		var charCode = (evt.charCode) ? evt.charCode : ((evt.keyCode) ? evt.keyCode:((evt.which) ? evt.which : 0));
		var newChar = elem.value;
		
		if(evt.ctrlKey || (typeof(evt.metaKey) != 'undefined' && evt.metaKey)){
			return true;
		} else if(evt.shiftKey){
			if (charCode == 37 || charCode == 39) // left/right arrow
			{
				return true;
			}
		} else if(evt.altKey){
			return true;
		}
		
		if (str == "k")//조선어
		{
			var unallowed = new RegExp('[#%&?@!$^*()=+|/<>,.~`\'\"]', 'g'); 
			if (newChar.match(unallowed))
				elem.value = newChar.replace(unallowed, ""); // 어느위치든지 # % & ? ' " 가 있는 경우 지우기
			var backslash = /\\/g; 
			if (elem.value.match(backslash))
				elem.value = elem.value.replace(backslash, ""); //backslashe는 따로 지우자
		}else{
			var unallowed = new RegExp('[^\\' + (RegExp.$1).split('').join('\\') + ']', 'g');
			elem.value = newChar.replace(unallowed, "");
		}
	}
}