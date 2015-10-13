$(document).ready(function(){
    /*=================================
    Navigation
    =================================*/
    var dontAnimate = false; //used to stop navspy animations when scrolling to a section
    //Scroll to anchors, replaces anchor link behavior
	$('[data-scroll-to], nav li a').click(function(e){
        $(this).parents('nav').find('.hidable').removeClass('unhide');
		var target = $(this).data('scroll-to') || $(this).attr('href');
        if (target){
            dontAnimate = true;
            var top = $(target).offset().top;
    		$('html, body').animate({
    			scrollTop: top - 22
    		}, {
                duration: 1500,
                always: function(){
                    dontAnimate = false;
                }
            });
            var navItem = $('nav li a[href='+target+']');
            animateNav(navItem);
            ga('send', {
                hitType: 'event',
                eventCategory: 'nav',
                eventAction: 'click',
                eventLabel: target
            });
    		e.stopImmediatePropagation();
    		return true;
        }
        return false;
	});
    //Show and hide the navigation bar after a set height
	var toggleNav = function(){
        if ($(window).width() > 991){
    		var s = $(window).scrollTop();
    		if (s > 600){
    			$('nav').collapse('show');
    		} else if (s < 400) {
    			$('nav').collapse('hide');
    		}
        }
	};
    //animate a navigation link to indicate location
    var animateNav = function(target) {
        if (target && !$(target).hasClass('active')) {
            $('nav li a.active').animate({
                paddingBottom: 10
            }, {
                duration: 400,
                easing: "linear",
                done: function(){
                    $(this).css({borderBottomWidth:0});
                }
            }).removeClass('active');
            $(target).animate({
                paddingBottom: 0
            }, {
                duration: 400,
                easing: "linear",
                start: function(){
                    $(this).css({borderBottomWidth:1});
                }
            }).addClass('active');
            ga('send', {
                hitType: 'event',
                eventCategory: 'sectionView',
                eventAction: 'view',
                eventLabel: $(target).attr('href')
            });
        }
    };
    //update navigation links to show current secion
    var navSpy = function(){
        var windowTop = $(window).scrollTop();
        if (dontAnimate){
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
    //navigation scroll handlers
	$(window).scroll(function(){
		toggleNav();
        navSpy();
	});
    /*==============================
    Days to Go countdown
    ==============================*/
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
    /*============================
    Gallery animations
    ============================*/
    +function(){
        var ret;
        var target;
        $('#gallery .image').hover(function(){
            if (!$(this).attr('style')){
                ret = {
                    height: $(this).height(),
                    width: $(this).width()
                };
            }
            var elem = this;
            var doAnimate = function(){
                if (target === elem){
                    var t = {};
                    var gallery = $(elem).parents('ul').first();
                    var leftOffset = $(elem).offset().left;
                    var topOffset = $(elem).offset().top - gallery.offset().top;
                    var rightOffset = gallery.width() - (leftOffset + $(elem).width());
                    var bottomOffset = gallery.height() - (topOffset + $(elem).height());
                    t.width = $(elem).children('img').width() * 1.05;
                    t.height = $(elem).children('img').height() * 1.05;
                    var left = (t.width - $(elem).width())/2;
                    if (left > rightOffset){
                        left += left - rightOffset;
                    }
                    left = Math.min(left,leftOffset);
                    t.marginLeft = -1*left;
                    var top = (t.height - $(elem).height())/2;
                    if (top > bottomOffset){
                        top += top - bottomOffset;
                    }
                    top = Math.min(top,topOffset);
                    t.marginTop = -1*top;
                    $(elem).addClass('active').css('z-index',255).animate(t);
                    $(elem).children('img').addClass('active').animate({
                        marginLeft: 0,
                        marginTop: 0,
                    });
                }
            };
            target = this;
            setTimeout(doAnimate,250);
        }, function(){
            if (target === this){
                target = null;
            }
            if (ret) {
                ret.marginTop = 0;
                ret.marginLeft = 0;
                $(this).animate(ret,{
                    always: function(){
                        $(this).removeAttr('style');
                    }
                });
                var offset = $(this).removeClass('active').children('img').removeClass('active').data('offset');
                if (offset){
                    if ($(this).hasClass('hor')){
                        $(this).children('img').animate({
                            marginLeft: -1*offset
                        });
                    } else {
                        $(this).children('img').animate({
                            marginTop: -1*offset
                        })
                    }
                }
            }
        });
        var fixImageSizes = function(){
            var w = $('#gallery ul').width();
            var images = Math.floor(w / 200);
            var imgWidth = w / images;
            var rows = Math.min(Math.floor($('#gallery li').css({
                width: imgWidth,
                height: imgWidth
            }).length / images),6);
            $('#gallery ul').css({
                height: rows * imgWidth
            });
            ret = {
                height: imgWidth,
                width: imgWidth
            };
        };
        $(window).resize(fixImageSizes);
        fixImageSizes();
    }();
    /*================================
    Bridal Party Active Image, Festivities Active Control
    ================================*/
	$('#groomsman-carousel, #bridesmaids-carousel, #festive-carousel, #location-carousel').on('slide.bs.carousel', function (e) {
		$(this).find('.carousel-image, .control').removeClass('active');
		$(this).find('[data-slide-to='+$(e.relatedTarget).index()+']').addClass('active');
	});
    /*===============================
    Google analytics events
    ===============================*/
    +function(){
        //carousel controls
        $('.carousel .control').click(function(){
            ga('send',{
                hitType: 'event',
                eventCategory: $(this).data('target'),
                eventAction: 'view',
                eventLabel: $(this).data('slide-to')
            });
            return true;
        });
        //offsite links
        $('a[target=_blank]').click(function(){
            ga('send',{
                hitType: 'event',
                eventCategory: 'link',
                eventAction: 'open',
                eventLabel: $(this).attr('href')
            });
            return true;
        });
        //gallery click
        $('#gallery a.image').click(function(){
            ga('send', {
                hitType: 'event',
                eventCategory: 'gallery',
                eventAction: 'click',
                eventLabel: $(this).attr('href')
            });
            return true;
        });
    }();
});

