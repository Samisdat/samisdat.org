/*jslint browser: true, white: true, vars: true */
/*global jQuery, Samisdat */
(function($) {

    "use strict";

    //productive

	/**
	 * By observationg a habitat living organisms can keppt on canvas
	 */
	Samisdat.Conway.Observation = ( function() {

		var ready = function() {
	        var guns_and_eaters = Samisdat.Conway.Pattern.get('guns_and_eaters');
	        Samisdat.Conway.Population.seed(-11, -23, guns_and_eaters);
	        var guns_and_eaters = Samisdat.Conway.Pattern.get('guns_and_eaters');
	        Samisdat.Conway.Population.seed(-11, -67, guns_and_eaters);

	        var guns_and_eaters = Samisdat.Conway.Pattern.get('guns_and_eaters');
	        Samisdat.Conway.Population.seed(-11, 21, guns_and_eaters);
		};

		$(document).ready(ready);
	}());


    //\productive    
    
})(jQuery);