
var honoredNamesSrc =  ['김일성','김정일','김정은','金日成','金正日','金正恩','Kim Il Sung','Kim Jong Il','Kim Jong Un','Ким Ир Сеном','Ким Ир Сена','Ким Ир Сену','Ким Ир Сене','Ким Ир Сен','Ким Чен Иром','Ким Чен Ира','Ким Чен Иру','Ким Чен Ире','Ким Чен Ир','Ким Чен Ыном','Ким Чен Ына','Ким Чен Ыну','Ким Чен Ыне','Ким Чен Ын'];
var honoredTextSrc = ['위대한 수령','위대한 령도자','경애하는','최고령도자','동지','대원수','원수']

function protectHonoredText(text) {
	var i =-1
	for (var i = 0; i < honoredNamesSrc.length; i++) {
		var pos = text.indexOf(honoredNamesSrc[i]);
		if (pos != -1) {
			var re = new RegExp(honoredNamesSrc[i], "g"); 
			text = text.replace(re, "<span class=\"honored-title\"><strong>"+honoredNamesSrc[i]+"</strong></span>");						
		}
	}
	for (var i = 0; i < honoredTextSrc.length; i++) {
		var pos = text.indexOf(honoredTextSrc[i]);
		if (pos != -1) {
			var re = new RegExp(honoredTextSrc[i], "g"); 
			text = text.replace(re, "<span class=\"honored-title\">"+honoredTextSrc[i]+"</span>");						
		}
	}
	return text;
}