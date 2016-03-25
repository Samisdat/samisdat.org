/*jslint browser: true, white: true, vars: true */
/*global jQuery, Samisdat */
(function($) {

    "use strict";

	Samisdat.PositionConway = ( function() {
		var $conway;
		var invisible = false;

		var scroll = function(){
			if(invisible === false && $(window).scrollTop() > 250){
				invisible = true;
				$conway.trigger('invisible', {invisible:invisible});
				$conway.addClass('invisible');
			}
			else if(invisible === true && $(window).scrollTop() <= 250){
				invisible = false;
				$conway.trigger('invisible', {invisible:invisible});
				$conway.removeClass('invisible');
			}
		};
		var ready = function() {
			$conway = $('#conway');
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
