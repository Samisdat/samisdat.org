/*jslint browser: true, white: true, vars: true */
/*global jQuery, Samisdat */
(function($) {

    "use strict";

    //productive
 
	Samisdat.Conway.Generation = (function(){
		
		var generations_per_second = 10;
		
		var generation_counter = 0;
		
		var stasis = false;
		
		var get_generations_per_second = function(){
			return generations_per_second;
		};

		var set_generations_per_second = function(_generations_per_second){
			generations_per_second = _generations_per_second;
		};
		    
		var count = function(){
			generation_counter += 1;
		};
		
		var generation = function(){
			count();

			var duration = 1000 / generations_per_second;
			if(stasis === true){
				return;
			}
			
			Samisdat.Conway.Population.generation();
			window.setTimeout(generation, duration);
		};
		
		generation();
		
		$('header').on('invisible', function(evt, data){
			if(data.invisible === undefined){
				return;
			}
			
			if(data.invisible === true){
				stasis = true;
				return;
			}
			else if(data.invisible === false){
				stasis = false;
				generation();
				return;
			}
		});
		
		var get = function(){
			return generation_counter;
		};
		
		var cryostasis = function(){
			if(stasis === false){
				stasis = true;
			}
			else{
				stasis = false;
				generation();
			}
			
		};
		return{
			get_generations_per_second: get_generations_per_second,
			set_generations_per_second: set_generations_per_second,			
			get:get,
			count: count,
			cryostasis: cryostasis
		};
	})();

    //\productive    
    
})(jQuery);