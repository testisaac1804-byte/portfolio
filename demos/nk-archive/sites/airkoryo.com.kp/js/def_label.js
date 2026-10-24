(function($){
    $(document).ready(function(){
        $('input').deflabel();
    });
    
    $.fn.deflabel = function() {
        this.each(function(){
            var def_label = $(this).attr('_label');
            if (def_label == "" || typeof(def_label)=="undefined")
                return;
            
            if ($(this).val() == "" || $(this).val() == def_label) {
                $(this).addClass("def-label");
                $(this).val( def_label );
            }
            
            $(this).bind("focusin", function(){
                var input = this;
                setTimeout(function(){
                    if ($(input).hasClass("def-label")) {
                        $(input).removeClass("def-label");
                        if ($(input).val() == $(input).attr("_label"))
                            $(input).val("");
                    }
                }, 10);
            }).bind("focusout", function(event){
                var input = this;
                setTimeout(function(){
                    if ($(input).val() == "") {
                        $(input).addClass("def-label");
                        $(input).val( def_label );
                    }
                }, 100);
            }).bind("change", function(event){
                var input = this;
                setTimeout(function(){
                    if ($(input).val() == "") {
                        $(input).addClass("def-label");
                        $(input).val( def_label );
                    } else if ($(input).val() != $(input).attr("_label")) {
                        $(input).removeClass("def-label");
                    }
                }, 100);
            });
        });
    };

})(jQuery);
