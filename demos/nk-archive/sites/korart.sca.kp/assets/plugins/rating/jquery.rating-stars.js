jQuery.fn.ratingStars = function( options ) {
 
    var defaults = {
        selectors: {
            starsSelector: '.rating-stars',
            starSelector: '.rating-star',
            starActiveClass: 'is--active',
            starHoverClass: 'is--hover',
            starNoHoverClass: 'is--no-hover',
            targetFormElementSelector: '.rating-value'
        }
    };
 
    var settings = $.extend( {}, defaults, options );

    var methods = {
        init: function(element) {
            var me = this;
            
            methods.registerEvents(element);
            methods.loadDefaultValue(element);
        },

        loadDefaultValue: function (element) {
            var me = this;
            var defaultValue = $(element).children(settings.selectors.targetFormElementSelector).val();

            var i = 0;
            $.each($(element).children(settings.starsSelector).children(settings.starSelector), function(index, element) {
                if(i <= (defaultValue - 1)) {
                    $(element).addClass(settings.selectors.starActiveClass);
                }
                i++;
            });
        },

        registerEvents: function (element) {
            var me = this;
    
            $.each($(element).children(settings.starsSelector).children(settings.starSelector), function(index, starElement) {
                $(starElement).on("mouseenter", $.proxy(me.onStarEnter, me, starElement, element));
                $(starElement).on("mouseleave", $.proxy(me.onStarLeave, me, starElement, element));
                $(starElement).on("click touchstart", $.proxy(me.onStarSelected, me, starElement, element));
            });
        },

    };
    methods.init($(this));
    return this.each(function() {
        methods.init($(this));
    });
};
