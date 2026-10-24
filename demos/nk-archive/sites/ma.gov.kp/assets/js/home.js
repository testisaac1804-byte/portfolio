var owl_carousel = function() {
    return {
        init: function(callback) {
            var time = 7; // time in seconds

            var $progressBar,
                $bar,
                $elem,
                isPause,
                tick,
                percentTime;

            //Init the carousel
            $("#owl-demo").owlCarousel({
                slideSpeed: 500,
                paginationSpeed: 500,
                singleItem: true,
                afterInit: progressBar,
                afterMove: moved,
                startDragging: pauseOnDragging
            });

            //Init progressBar where elem is $("#owl-demo")
            function progressBar(elem) {
                $elem = elem;
                //build progress bar elements
                buildProgressBar();
                //start counting
                start();
            }

            //create div#progressBar and div#bar then prepend to $("#owl-demo")
            function buildProgressBar() {
                $progressBar = $("<div>", {
                    id: "progressBar"
                });
                $bar = $("<div>", {
                    id: "bar"
                });
                $progressBar.append($bar).prependTo($elem);
            }

            function start() {
                //reset timer
                percentTime = 0;
                isPause = false;
                //run interval every 0.01 second
                tick = setInterval(interval, 10);
            };

            function interval() {
                if (isPause === false) {
                    percentTime += 1 / time;
                    $bar.css({
                        width: percentTime + "%"
                    });
                    //if percentTime is equal or greater than 100
                    if (percentTime >= 100) {
                        //slide to next item
                        $elem.trigger('owl.next')
                    }
                }
            }

            //pause while dragging
            function pauseOnDragging() {
                isPause = true;
            }

            //moved callback
            function moved() {
                //clear interval
                clearTimeout(tick);
                //start again
                start();
            }
       
        }
    }
}();

owl_carousel.init();

$(document).ready(function() {
	
	$.ajax({
		url: site_url+'/home/notify',
		success:function(result){
			
			if(result == 'no'){
				
				return;
			}
			else{
				
				$('#notiresult').html(result);
				$('#modal-3').modal('show');
			}
		}
	});

    $("#dob").datetimepicker({
        format: 'YYYY-MM-DD',
        widgetPositioning:{
            vertical:'bottom'
        },
        keepOpen:false,
        useCurrent: false,
        maxDate: new Date()
    });

    $('[data-toggle="tooltip"]').tooltip();
   
});

function onCheck(){
	$.ajax({
		url: site_url+'/notify/changenotify',
		success:function(data){
		}
	});
}
