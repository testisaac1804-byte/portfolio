/**
 * Created by JUNIOR on 2017-04-12.
 */

(function($) {

    function clazz(SuperClass, methods) {
      var constructor = function () {};
      constructor.prototype = new SuperClass;
      constructor.prototype.constructor = constructor;
      constructor.prototype.parent = SuperClass.prototype;
      constructor.prototype = $.extend(constructor.prototype, methods);
      return constructor;
    }

    var Pagination = clazz(Object, {
      init: function(opts) {
        this.options = $.extend({}, {}, $.fn.pagination.defaults, opts);
        this.create();
      },
      create: function() {
        var total_page_count = this.options.total_page_count;
        var start = this.options.start;
        var length = this.options.length;

        var inner = '';
        var tmp_start = 0;
        
        if (total_page_count == 0)
          return;

        if (total_page_count == 1) {
          inner += '<li class="disabled"><a class="" data-key="first"><i class="fa fa-angle-double-left"></i></a></li>';
          inner += '<li class="disabled"><a class="" data-key="prev"><i class="fa fa-angle-left"></i></a></li>';
          inner += '<li class="active"><a class="page_nav" data-key="'+ (tmp_start+1) +'">'+ (tmp_start+1) +'</a></li>';
          inner += '<li class="disabled"><a class="" data-key="next"><i class="fa fa-angle-right"></i></a></li>';
          inner += '<li class="disabled"><a class="" data-key="last"><i class="fa fa-angle-double-right"></i></a></li>';
        } else if (total_page_count != 1) {
          if (start - parseInt(length / 2) > 0 || start + parseInt(length / 2) > total_page_count)
            tmp_start = start - parseInt(length / 2);
          else
            tmp_start = start;

          if (start <= parseInt(length / 2))
            tmp_start = 1;
          else if (start > total_page_count - parseInt(length / 2))
            tmp_start = total_page_count - (length - 1);

          if ((start == 0) || (start == 1)) {
            var page_nav = '';
            var button_status = 'disabled';
          } else {
            var page_nav = 'page_nav';
            var button_status = '';
          }

          inner += '<li class="'+ button_status +'"><a class="'+ page_nav +'" data-key="1"><i class="fa fa-angle-double-left"></i></a></li>';
          inner += '<li class="'+ button_status +'"><a class="'+ page_nav +'" data-key="prev"><i class="fa fa-angle-left"></i></a></li>';
          for (var i = 0; i < length; i ++) {
            if (tmp_start == start)
              inner += '<li class="active">';
            else
              inner += '<li>';

            if (start == 0)
              inner += '<a class="page_nav" data-key="'+ (tmp_start+1) +'">'+ (tmp_start+1) +'</a></li>';
            else
              inner += '<a class="page_nav" data-key="'+ tmp_start +'">'+ tmp_start +'</a></li>';

            tmp_start ++;
          }

          // if (start != 0)
          //   inner += '<li><a class="pagi_nav" data-key="'+ tmp_start +'">'+ tmp_start +'</a></li>';

          if (start == total_page_count) {
            var page_nav = '';
            var button_status = 'disabled';
          } else {
            var page_nav = 'page_nav';
            var button_status = '';
          }

          inner += '<li class="'+ button_status +'"><a class="'+ page_nav +'" data-key="next"><i class="fa fa-angle-right"></i></a></li>';
          inner += '<li class="'+ button_status +'"><a class="'+ page_nav +'" data-key="'+total_page_count+'"><i class="fa fa-angle-double-right"></i></a></li>';
        }
        
        this.options.element.html(inner);
        this.options.element.find('.page_nav').on('click', $.proxy(this.click_change_page, this, length, total_page_count, this.options.element));
      },

      click_change_page: function (length, last, el, event) {
        $('body').animate({
          scrollTop: 0
        }, 300);

        var data = event.currentTarget.attributes['data-key'].value;
        var data_parent = event.currentTarget.parentElement;
        var data_parent_parent = event.currentTarget.parentElement.parentElement;

        if (data == 'first' || data == '1')
          data = 0;

        if (data == 'prev' && data != 1) {
          var tmp_data = $(data_parent_parent).find('.active').children().attr('data-key');
          data = (parseInt(tmp_data) - 1) == 1 ? 0 : parseInt(tmp_data) - 1;
        }

        if (data == 'next') {
          var tmp_data = $(data_parent_parent).find('.active').children().attr('data-key');
          data = parseInt(tmp_data) + 1;

        }
        if (data == 'last')
          data = last;
        
        $(data_parent_parent).find('.active').removeClass('active');
        
        if (data != 0 && data != 'prev' && data != 'next' && data != -1) {
          $(data_parent).addClass('active');
        }

        var temp = data == 0 ? 1 : data;

        if (el[0].attributes['class'].value.split(' ')[1] == 'goods-pagination') {
          $(el).parents("form").find("[name='page']").val(temp);
          $(el).parents("form").submit();
        } else if (el[0].attributes['class'].value.split(' ')[1] == 'devsite-pagination') {
          
        }
      }
    });

    $.fn.pagination = function() {

      var args = Array.prototype.slice.call(arguments, 0);

      this.each(function() {
        if (typeof(args[0]) === "object") {
          args[0].element = $(this);
          var page_nav = new Pagination();
          return page_nav.init(args[0]);
        }
      });
    };

    $.fn.pagination.defaults = {
      total_page_count: 0,
      start: 0,
      length: 5
    }

})(jQuery);