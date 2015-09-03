$(document).ready(function(){
    	$('[data-scroll-to], nav li a').click(function(e){
    		var target = $(this).data('scroll-to') || $(this).attr('href');
            if (target){
        		$('html, body').animate({
        			scrollTop: $(target).offset().top - 22
        		}, 1000);
                if ($(this).attr('href')){
                    animateNav(this);
                }
        		e.stopImmediatePropagation();
        		return true;
            }
            return false;
    	});
    	var toggleNav = function(){
    		var s = $(window).scrollTop();
    		if (s > 600){
    			$('nav').collapse('show');
    		} else if (s < 400) {
    			$('nav').collapse('hide');
    		}
    	};
        var animateNav = function(target) {
            if (target && !$(target).hasClass('active')) {
                $('nav li a.active').animate({
                    paddingBottom: 10
                }, {
                    duration: 600,
                    easing: "linear",
                    done: function(){
                        $(this).css({borderBottomWidth:0});
                    }
                }).removeClass('active');
                $(target).animate({
                    paddingBottom: 0
                }, {
                    duration: 600,
                    easing: "linear",
                    start: function(){
                        $(this).css({borderBottomWidth:1});
                    }
                }).addClass('active');
            }
        };
        var navSpy = function(){
            var watchNav = function(winTop){
                var windowTop = $(window).scrollTop();
                if (winTop != windowTop){
                    return;
                }
                var windowBottom = windowTop + $(window).height();
                var t;
                var p = 0;
                $('nav a[href^="#"]').each(function(){
                    var target = $(this).attr('href');
                    var top = $(target).offset().top;
                    var bottom = top + $(target).height();
                    var size = Math.min(windowBottom,bottom) - Math.max(windowTop, top);
                    if (size > p) {
                        t = this;
                        p = size;
                    }
                });
                animateNav(t);
            };
            var winTop = $(window).scrollTop();
            setTimeout(function(){watchNav(winTop);},80);
            
        };
    	$(window).scroll(function(){
    		toggleNav();
            navSpy();
    	});
    	$('#groomsman-carousel').on('slide.bs.carousel', function (e) {
    		$(this).find('.carousel-image').removeClass('active');
    		$(this).find('[data-slide-to='+$(e.relatedTarget).index()+']').addClass('active');
		});
        $('#toggle-map').change(function(){
            if (this.checked){
                $('#location-map').css('z-index','10');
            }
        });
        $('#toggle-info').change(function(){
            if (this.checked){
                $('#location-map').css('z-index','0');
            }
        })
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

