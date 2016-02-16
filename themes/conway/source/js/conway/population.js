/*jslint browser: true, white: true, vars: true */
/*global jQuery, Samisdat */
(function($) {

    "use strict";

    //productive

	/**
	 * Organisms live in a habitat
	 */
	Samisdat.Conway.Population = ( function() {

			// mapping of row/column to index are stored as key value in object population_dictionary
			var cells = [];
			var cells_dictionary = {};

			var get_cell = function(row, column) {
				var index = cells_dictionary[row + '-' + column];
				if (index === undefined) {
					return undefined;
				}
				return cells[index];
			};

			var living_cell = function(row, collum){
				var cell = get_cell(row, collum);
				if(cell === undefined){
					return false;
				}
				return cell.live();
			};

			var add_cell = function(row, column) {
				cells_dictionary[row + '-' + column] = cells.length;
				var cell = Samisdat.Conway.Cell(row, column); 
				cells.push(cell);
				return cell;
			};

			var remove_cell = function(row, column) {
				var index = cells_dictionary[row + '-' + column];
				cells[index] = undefined;				
				delete cells_dictionary[row + '-' + column];				
			};


			var neighborhood = function(){
				for (var cell_index in cells) {
					if (cells[cell_index].neighborhood === undefined) {
						continue;
					}
					cells[cell_index].neighborhood();
				}
			};

			/**
			 * Seed a pattern
			 * @param start_row integer
			 * @param start_column integer
			 * @param pattern array of array containing the pattern
			 */
			var seed = function(start_row, start_column, pattern) {

				for (var row = 0, rows = pattern.length; row < rows; row += 1) {
					for (var column = 0, columns = pattern[row].length; column < columns; column += 1) {
						var pattern_cell = pattern[row][column];
						
						// Only add living cells from pattern						
						if(pattern_cell !== 1){
							continue;
						}

						var cell = add_cell((start_row + row), (start_column + column));
						cell.birth(true);
					}
				}
				neighborhood();
			};

			var next_generation = function() {

				for (var cell_index in cells) {
					if (cells[cell_index] === undefined || cells[cell_index].next_generation === undefined) {
						continue;
					}
					cells[cell_index].next_generation();
				}
			};

			var replace_generation = function() {
				for (var cell_index in cells) {
					if (cells[cell_index] === undefined || cells[cell_index].replace_generation === undefined) {
						continue;
					}
					cells[cell_index].replace_generation();
				}
			};
			
			var garbage = function(){
				var _cells = [];
				
				for (var cell_key in cells_dictionary) {
					var cell_index = cells_dictionary[cell_key];
					var _cell = cells[cell_index];
					cells_dictionary[cell_key] = _cells.length;
					_cells.push(_cell);					 
				}
				cells = _cells;
			};
			
			var generation = function() {
				next_generation();

				replace_generation();
				garbage();
			};	

			var json = function(){
				var left = undefined;
				var right = undefined;
				var top = undefined;
				var bottom = undefined;
				for (var cell_index in cells) {
					var cell = cells[cell_index];
					var row = cell.get_row();
					var column = cell.get_column();
					
					if(left === undefined || left > column){
						left = column;
					}
					
					if(top === undefined || top > row){
						top = row;
					}

					if(right === undefined || right < column){
						right = column;
					}
					
					if(bottom === undefined || bottom < row){
						bottom = row;
					}
				}
				
				var pattern = [];
				
				for(var row = top; row <= bottom; row += 1){
					var cells_in_row = [];
					for(var column = left; column <= right; column += 1){
						var cell = living_cell(row, column);
						cells_in_row.push(cell);
					}
					pattern.push(cells_in_row);
				}
				return pattern;
			};

			return {
				get_cell : get_cell,
				remove_cell:remove_cell,
				living_cell: living_cell,
				add_cell : add_cell,
				generation : generation,
				seed : seed,
				json:json
			};

		}());

    //\productive    
    
})(jQuery);