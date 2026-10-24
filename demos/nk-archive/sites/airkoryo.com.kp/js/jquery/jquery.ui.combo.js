(function( $ ) {
    $.widget( "ui.combobox", {
        options: {
            maxlen: false,
            readonly: false,
            scrollable: false,
            name: "",
            userclass: "",
            width: "",
            label: "",
            _selected: null
        },
        _create: function() {
            var o = this.options;
            var self = this;
            var select = this.element.hide(),
                selected = select.children( ":selected" ),
                value = selected.val() ? selected.text() : "";
            var input = $( "<input>" )
                .insertAfter( select )
                .val( value )
                .autocomplete({
                    delay: 50,
                    combo: true,
                    minLength: 0,
                    source: function( request, response ) {
                        var matcher = new RegExp( $.ui.autocomplete.escapeRegex(request.term), "i" );
                        response( select.children( "option" ).map(function() {
                            var text = $( this ).text();
                            return {
                                label: text,
                                value: text,
                                option: this
                            }
                        }) );
                    },
                    select: function( event, ui ) {
                        ui.item.option.selected = true;
                        //select.val( ui.item.option.value );
                        self._trigger( "selected", event, {
                            item: ui.item.option
                        });
                        
                        // green added
                        if (o._selected != null) {
                            o._selected(ui.item.option);
                        }
                    },
                    change: function( event, ui ) {
                        if (o.readonly === false)
                            return;
                        if ( !ui.item ) {
                            var matcher = new RegExp( "^" + $.ui.autocomplete.escapeRegex( $(this).val() ) + "$", "i" ),
                                valid = false;
                            select.children( "option" ).each(function() {
                                if ( this.value.match( matcher ) ) {
                                    this.selected = valid = true;
                                    return false;
                                }
                            });
                            if ( !valid ) {
                                // remove invalid value, as it didn't match anything
                                $( this ).val( "" );
                                select.val( "" );
                                return false;
                            }
                        }
                    }
                }).addClass( "ui-widget ui-widget-content ui-widget-combo" ).addClass(o.userclass);
            
            if (o.maxlen !== false) {
                input.attr("maxlength", o.maxlen);
            }
            if (o.readonly === true) {
                input.attr("readonly", "readonly");
            }
            if (o.name !== "") {
                input.attr("name", o.name);
            }
            if (o.width !== "") {
                input.width(o.width);
            }
            if (o.label !== "") {
                input.attr("_label", o.label);
                input.val("");
                input.deflabel();
            }
            
            input.data( "autocomplete" )._renderItem = function( ul, item ) {
                if (o.scrollable == true) {
                    ul.addClass("scrollable");
                }
                return $( "<li></li>" )
                    .data( "item.autocomplete", item )
                    .append( "<a>" + item.label + "</a>" )
                    .appendTo( ul );
            };

            var button = $( "<button>&nbsp;</button>" )
                .attr( "tabIndex", -1 )
                //.attr( "title", "Show All Items" )
                .insertAfter( input )
                .button({
                    icons: {
                        primary: "ui-icon-combo-arrow"
                    },
                    text: false
                })
                .removeClass( "ui-corner-all" )
                .addClass( "ui-button-combo" )
                .click(function() {
                    // close if already visible
                    if ( input.autocomplete( "widget" ).is( ":visible" ) ) {
                        input.autocomplete( "close" );
                        return false;
                    }

                    // pass empty string as value to search for, displaying all results
                    input.autocomplete( "search", "" );
                    input.focus();
                    return false;
                });

            input.click(function(){
                button.click();
            });
        }
    });
})(jQuery);
