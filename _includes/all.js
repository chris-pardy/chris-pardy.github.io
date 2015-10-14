$(document).ready(function(){
    /*=================================
    Navigation
    =================================*/
    var dontAnimate = false; //used to stop navspy animations when scrolling to a section
    //Scroll to anchors, replaces anchor link behavior
    $('nav li a').each(function(){
        var t = $(this);
        t.attr('data-scroll-to',t.attr('href')).removeAttr('href');
    });
	$('[data-scroll-to]').click(function(){
        $(this).parents('nav').find('.hidable').removeClass('unhide');
		var target = $(this).data('scroll-to');
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
            var navItem = $('nav li a[data-scroll-to='+target+']');
            animateNav(navItem, 1500);
            ga('send', {
                hitType: 'event',
                eventCategory: target.substr(1),
                eventAction: 'click',
                eventLabel: 'nav'
            });
        }
	});
    //Show and hide the navigation bar after a set height
    +function(){
        var w = $(window);
        var notSmall = w.width() > 991;
        var nav = $('nav');
        $(window).scroll(function(){
            if (notSmall){
                var s = w.scrollTop();
                if (s > 600){
                    nav.collapse('show');
                } else if (s < 400) {
                    nav.collapse('hide');
                }    
            }
        }).resize(function(){
            notSmall = w.width() > 991;
        });
    }();
    //animate a navigation link to indicate location
    var animateNav = function(target, duration) {
        if (target && !$(target).hasClass('active')) {
            duration = duration || 400;
            $('nav li a.active').animate({
                paddingBottom: 10
            }, {
                duration: duration,
                easing: "linear",
                done: function(){
                    $(this).css({borderBottomWidth:0});
                }
            }).removeClass('active');
            $(target).animate({
                paddingBottom: 0
            }, {
                duration: duration,
                easing: "linear",
                start: function(){
                    $(this).css({borderBottomWidth:1});
                }
            }).addClass('active');
            var frag = $(target).data('scroll-to');
            if(history && history.replaceState){
                history.replaceState({},null,frag);
            }
            ga('send', {
                hitType: 'event',
                eventCategory: frag.substr(1),
                eventAction: 'view'
            });
        }
    };
    //update navigation links to show current secion
    +function(){
        var targets = [];
        $('nav a[data-scroll-to]').each(function(){
            var target = {
                navElem: this,
                section: $($(this).data('scroll-to'))
            };
            target.top = function(){
                if (target._top){
                    return target._top;
                }
                target._top = target.section.offset().top;
                return target._top;
            };
            target.height = function(){
                if (target._height){
                    return target._height
                }
                target._height = target.section.height();
                return target._height;
            };
            target.resized = function(){
                target._top = null;
                target._height = null;
            };
            targets.push(target);
        });
        var w = $(window);
        var windowHeight = w.height();
        w.scroll(function(){
            if (dontAnimate){
                return;
            }
            var windowTop = w.scrollTop();
            var windowBottom = windowTop + windowHeight;
            var t;
            var p = 0;
            for (var i = 0; i < targets.length; i++){
                var target = targets[i];
                var top = target.top();
                var bottom = top + target.height();
                var size = Math.min(windowBottom, bottom) - Math.max(windowTop, top);
                if (size > p) {
                    t = target.navElem;
                    p = size;
                }
            }
            animateNav(t);
        }).resize(function(){
            windowHeight = w.height();
            for (var i = 0; i < targets.length; i++){
                targets[i].resized();
            }
        });
    }();
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
            }).length / images),4);
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
    $('[data-track-event]').each(function(){
        var t = $(this);
        var edata = {
            hitType: 'event',
            eventAction: t.data('track-event'),
            eventCategory: t.data('track-category') || t.parents('section').attr('id'),
        }
        var eventLabel = t.data('track-label');
        if (eventLabel){
            edata.eventLabel = eventLabel;
        }
        //assume click
        $(this).click(function(){
            ga('send',edata);
            return true;
        });
    });
});

