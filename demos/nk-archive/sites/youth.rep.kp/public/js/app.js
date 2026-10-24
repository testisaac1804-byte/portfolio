(function ($) {
  var App = {
    initialize: function () {
      // Initialize datepicker.
      $.fn.datepicker.dates["ko"] = {
        days: [
          "일요일",
          "월요일",
          "화요일",
          "수요일",
          "목요일",
          "금요일",
          "토요일",
          "일요일",
        ],
        daysShort: ["일", "월", "화", "수", "목", "금", "토", "일"],
        daysMin: ["일", "월", "화", "수", "목", "금", "토", "일"],
        months: [
          "1월",
          "2월",
          "3월",
          "4월",
          "5월",
          "6월",
          "7월",
          "8월",
          "9월",
          "10월",
          "11월",
          "12월",
        ],
        monthsShort: [
          "1월",
          "2월",
          "3월",
          "4월",
          "5월",
          "6월",
          "7월",
          "8월",
          "9월",
          "10월",
          "11월",
          "12월",
        ],
      };
      $.fn.datepicker.dates["en"] = {
        days: [
          "일요일",
          "월요일",
          "화요일",
          "수요일",
          "목요일",
          "금요일",
          "토요일",
          "일요일",
        ],
        daysShort: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
        daysMin: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
        months: [
          "Jan",
          "Feb",
          "March",
          "April",
          "May",
          "June",
          "July",
          "Aug",
          "Sep",
          "Oct",
          "Nov",
          "Dec",
        ],
        monthsShort: [
          "Jan",
          "Feb",
          "March",
          "April",
          "May",
          "June",
          "July",
          "Aug",
          "Sep",
          "Oct",
          "Nov",
          "Dec",
        ],
      };
      $.fn.datepicker.dates["ch"] = {
        days: [
          "일요일",
          "월요일",
          "화요일",
          "수요일",
          "목요일",
          "금요일",
          "토요일",
          "일요일",
        ],
        daysShort: ["日", "一", "二", "三", "四", "五", "六", "日"],
        daysMin: ["日", "一", "二", "三", "四", "五", "六", "日"],
        months: [
          "1月",
          "2月",
          "3月",
          "4月",
          "5月",
          "6月",
          "7月",
          "8月",
          "9月",
          "10月",
          "11月",
          "12月",
        ],
        monthsShort: [
          "1月",
          "2月",
          "3月",
          "4月",
          "5月",
          "6月",
          "7月",
          "8月",
          "9月",
          "10月",
          "11月",
          "12月",
        ],
      };
      $.fn.datepicker.dates["ru"] = {
        days: [
          "일요일",
          "월요일",
          "화요일",
          "수요일",
          "목요일",
          "금요일",
          "토요일",
          "일요일",
        ],
        daysShort: [
          "Воскресенье",
          "Понедельник",
          "Вторник",
          "Среда",
          "Четверг",
          "Пятница",
          "Суббота",
          "Воскресенье",
        ],
        daysMin: [
          "Воскресенье",
          "Понедельник",
          "Вторник",
          "Среда",
          "Четверг",
          "Пятница",
          "Суббота",
          "Воскресенье",
        ],
        months: [
          "Январь",
          "Февраль",
          "Март",
          "Апрель",
          "Май",
          "Июнь",
          "Июль",
          "Август",
          "Сентябрь",
          "Октябрь",
          "Ноябрь",
          "Декабрь",
        ],
        monthsShort: [
          "Январь",
          "Февраль",
          "Март",
          "Апрель",
          "Май",
          "Июнь",
          "Июль",
          "Август",
          "Сентябрь",
          "Октябрь",
          "Ноябрь",
          "Декабрь",
        ],
      };
      $(".datepicker")
        .datepicker({
          todayHighlight: true,
          autoclose: true,
          language: language,
        })
        .on("changeDate", this.onChangeDate);

      $("#photo-slider").carousel({
        interval: 5000,
      });

      $(".article-link").click(this.openArticle);
      $(".form-control").keydown(function (event) {
        if (event.which == 13) {
          if ($("#title").val() == "" && $("#contents").val() == "") {
            // alert("검색어를 입력하십시오.");
            return false;
          }
          window.open(
            "/index.php/str_data?title=" +
              encodeURI($("#title").val()) +
              "&contents=" +
              encodeURI($("#contents").val()),
            "_self"
          );
        }
      });
      $(".btn-sm").click(this.checking_str);
    },
    checking_str: function (event) {
      if ($("#title").val() == "" && $("#contents").val() == "") {
        if ($("#title").attr("lang") == "ko") alert("검색어를 입력하십시오.");
        if ($("#title").attr("lang") == "en") alert("Enter search key");
        if ($("#title").attr("lang") == "ru")
          alert("Enter search key in Russian");
        if ($("#title").attr("lang") == "ch")
          alert("Enter search key in Chinese");
        return false;
      }
      window.open(
        "/index.php/str_data?title=" +
          encodeURI($("#title").val()) +
          "&contents=" +
          encodeURI($("#contents").val()),
        "_self"
      );
    },
    onChangeDate: function (event) {
      window.open(
        "/index.php/date/" +
          event.date.getFullYear() +
          "/" +
          (event.date.getMonth() + 1) +
          "/" +
          event.date.getDate(),
        "_self"
      );
    },
    /**
     * Open the article view.
     */
    openArticle: function (event) {
      event.preventDefault();
      var width = 1920,
        height = 1300;
      const newWindow = window.open(
        "/index.php/article/" + $(this).data("url"),
        "청년전위",
        "width=" +
          width +
          ",height=" +
          height +
          ",top=" +
          (screen.height - height) / 2 +
          ",left=" +
          (screen.width - width) / 2 +
          ",scrollbars=yes" +
          ",menubar=no" +
          ",directories=no" +
          ",location=no" +
          ",status=0" +
          ",resizable=no"
      );

      newWindow.window.addEventListener(
        "mousewheel",
        function (e) {
          if (e.ctrlKey == true || e.metaKey == true) e.preventDefault();
        },
        { capture: false, passive: false, once: false }
      );
      newWindow.window.addEventListener("keydown", function (e) {
        if (
          e.keyCode == 17 ||
          e.keyCode == 187 ||
          e.keyCode == 189 ||
          e.keyCode == 109 ||
          e.keyCode == 107
        ) {
          e.preventDefault();
          return false;
        }
      });
    },
  };

  App.initialize();
})(jQuery);
