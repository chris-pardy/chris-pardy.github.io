$(document).ready(function(){
    	$('[data-scroll-to], nav li a').click(function(e){
    		var target = $(this).data('scroll-to') || $(this).attr('href');
            if (target){
        		$('html, body').animate({
        			scrollTop: $(target).offset().top
        		}, 1000);
        		e.stopImmediatePropagation();
        		return true;
            }
            return false;
    	});
    	var toggleNav = function(){
    		var s = $(window).scrollTop();
    		if (s > 200){
    			$('nav').collapse('show');
    		} else if (s < 190) {
    			$('nav').collapse('hide');
    		}
    	};
    	$(window).scroll(function(){
    		toggleNav();
    	});
    	$('#groomsman-carousel').on('slide.bs.carousel', function (e) {
    		$(this).find('.carousel-image').removeClass('active');
    		$(this).find('[data-slide-to='+$(e.relatedTarget).index()+']').addClass('active');
		});
        +function(){
            var updateDaysToGo = function(){
                var now = new Date();
                var weddingDay = new Date($('#wedding-date').attr('datetime'));
                var timeToGo = weddingDay.getTime() - now.getTime();
                var dtg = Math.floor(timeToGo/86400000);
                timeToGo = timeToGo % 86400000
                var htg = Math.floor(timeToGo/3600000);
                timeToGo = timeToGo % 3600000;
                var mtg = Math.floor(timeToGo/60000);
                timeToGo = timeToGo % 60000;
                var stg = Math.floor(timeToGo/1000);
                //1000 ms per sec * 60 sec per min * 60 min per hour * 24 hour per day
                $('#days-to-go').html(dtg);
                $('#hours-to-go').html(htg);
                $('#minutes-to-go').html(mtg);
                $('#seconds-to-go').html(stg);
                setTimeout(updateDaysToGo, 1000);
            };
            updateDaysToGo();
        }();
	});