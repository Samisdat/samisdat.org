/*jslint browser: true, white: true, vars: true */
/*global jQuery, Samisdat */
(function($) {

    "use strict";

	Samisdat.PositionConway = ( function() {
		var $conway;
		var invisible = false;

		var $navbar;
		var fixed = false;

		var scroll = function(){
			
			var scrollTop = $(window).scrollTop();

			if(fixed === false && scrollTop > 200){
				fixed = true;
				$navbar.addClass('navbar-fixed-top');
			}
			else if(fixed === true && scrollTop <= 200){
				fixed = false;
				$navbar.removeClass('navbar-fixed-top');
			}

			if(invisible === false && scrollTop > 250){
				invisible = true;
				$conway.trigger('invisible', {invisible:invisible});
				$conway.addClass('invisible');
			}
			else if(invisible === true && scrollTop <= 250){
				invisible = false;
				$conway.trigger('invisible', {invisible:invisible});
				$conway.removeClass('invisible');
			}
		};
		var ready = function() {
			$conway = $('#conway');
			$navbar = $('.navbar');
			$(window).scroll(scroll);
			scroll();
		};

		$(document).ready(ready);
	}());

	Samisdat.CodeHighLight = ( function() {

		var ready = function() {
            $('pre code').each(function(i, block) {
                hljs.highlightBlock(block);
            });
		};

		$(document).ready(ready);
	}());

})(jQuery);
