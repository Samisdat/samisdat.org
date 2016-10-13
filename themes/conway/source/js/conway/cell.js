/*jslint browser: true, white: true, vars: true */
/*global jQuery, Samisdat */
(function($) {

    "use strict";

    //productive
 
	Samisdat.Conway.Cell = function(row, column) {

		var is_living = false;
		var _is_living = false;

		var _was_alive = false;

		var last_birth_in_generation = false;
		var last_death_in_generation = false;

		var get_row = function() {
			return row;
		};
		var get_column = function() {
			return column;
		};

		var death = function(immediately) {
			immediately = (immediately === undefined) ? false : immediately;

			if (immediately === true) {
				is_living = _is_living = false;
				last_death_in_generation = Samisdat.Conway.Generation.get();
			} else {
				_is_living = false;
				last_death_in_generation = Samisdat.Conway.Generation.get() + 1;
			}
		};
		var birth = function(immediately) {

			immediately = (immediately === undefined) ? false : immediately;

			last_birth_in_generation = Samisdat.Conway.Generation.get();

			if (immediately === true) {
				is_living = _is_living = true;
			} else {
				_is_living = true;
				last_birth_in_generation += 1;
			}
			_was_alive = true;
		};

		var live = function() {
			return is_living;
		};

		var neighbour = function(row, column) {

			var _cell = Samisdat.Conway.Population.get_cell(row, column);

			if (_cell === undefined) {				
				return 0;
			}
			if (_cell.live === undefined) {
				return 0;
			}
			var live = _cell.live();

			return (live === true) ? 1 : 0;
		};

		var neighbours_pos = function(){
			var pos = [];
			// neighbours on top
			pos.push({y:row - 1, x: column - 1});
			pos.push({y:row - 1, x: column});
			pos.push({y:row - 1, x: column + 1});

			// neighbours on the left and on the right
			pos.push({y:row, x: column - 1});
			pos.push({y:row, x: column + 1});

			// neighbours below
			pos.push({y:row + 1, x: column - 1});
			pos.push({y:row + 1, x: column});
			pos.push({y:row + 1, x: column + 1});
			
			return pos;
			
		};
		
		/**
		 * Cells affect their neighborhood
		 * Living cells create death cells around them
		 * death cells that are surounded by non living cells disappear
		 */
		var neighborhood = function(){
			var pos = neighbours_pos();
			if(is_living === true){
				for(var i = 0, x = pos.length; i < x; i += 1){
					var cell = Samisdat.Conway.Population.get_cell(pos[i].y, pos[i].x);
					if(cell === undefined){
						var death_cell = Samisdat.Conway.Population.add_cell(pos[i].y, pos[i].x);
						death_cell.death(true);
					}
				}
			}
			else if(is_living === false){
			
				var neighbours = 0;
				
				for(var i = 0, x = pos.length; i < x; i += 1){
					neighbours += neighbour(pos[i].y, pos[i].x);	
				}
				
				if(neighbours === 0){
					Samisdat.Conway.Population.remove_cell(row, column);
				}				
			}

		};

		var next_generation = function() {
			
			var pos = neighbours_pos();
			
			var neighbours = 0;
			
			for(var i = 0, x = pos.length; i < x; i += 1){
				neighbours += neighbour(pos[i].y, pos[i].x);	
			}
						
			if (is_living === false) {
				// Any dead cell with exactly three live neighbours becomes a live cell, as if by reproduction.
				if (neighbours === 3) {
					birth();
				}
				return;
			}

			// Any live cell with two or three live neighbours lives on to the next generation.
			if (neighbours === 2 || neighbours === 3) {
				// do nothing, just mark for generation switch
				_is_living = true;
				return;
			}

			// Any live cell with fewer than two live neighbours dies, as if caused by under-population.
			// Any live cell with more than three live neighbours dies, as if by overcrowding.
			death();

		};
		var replace_generation = function() {
			is_living = _is_living;
			
			neighborhood();
		};
		return {
			get_row : get_row,
			get_column : get_column,
			neighborhood: neighborhood,
			next_generation : next_generation,
			replace_generation : replace_generation,
			live : live,
			death : death,
			birth : birth
		};
	};



    //\productive    
    
})(jQuery);