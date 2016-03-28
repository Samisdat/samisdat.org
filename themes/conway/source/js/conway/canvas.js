/*jslint browser: true, white: true, vars: true */
/*global jQuery, Samisdat */

'use strict';

(function($) {

    Samisdat.Conway.Canvas = ( function() {
        var animationPaused = false;

        var $canvas;

        var canvas = {
            ctx: undefined,
            width: 0,
            height: 0,
        };

        var offset = {
            x: 0,
            y: 0
        };

        var cell = {
            width: 8,
            spacing: 0
        };

        var visibile = {
            rows: undefined,
            collums: undefined
        };

        var main = {
            offsetLeft: undefined,
            width: undefined
        };

        var aside = {
            offsetLeft: undefined,
            width: undefined
        };

        var render = function() {

            var populationPos = {
                top: Math.floor(visibile.rows / 2),
                left: Math.floor(visibile.collums / 2)
            };

            canvas.ctx.fillStyle = '#c5cf9c';
            canvas.ctx.fillRect(0, 0, canvas.width, canvas.height);

            // lighten main column a little
            canvas.ctx.fillStyle = '#e0e5c4';
            canvas.ctx.fillRect(aside.offsetLeft, 0, aside.width, canvas.height);

            for (var row = 0; row < visibile.rows; row += 1) {
                for (var column = 0; column < visibile.collums; column += 1) {

                    var color = '#ffffff';

                    var actualCell = Samisdat.Conway.Population.get_cell(
                        ( row - populationPos.top ),
                        ( column - populationPos.left )
                    );

                    if(undefined === actualCell || false === actualCell.live()){
                        continue;

                        if( 0 === (column - populationPos.left) ){
                            color = '#ff0000';
                        }
                        else{
                            continue;
                        }
                    }

                    if(undefined !== actualCell && true === actualCell.live()){
                        color = '#8c9568';
                    }

                    canvas.ctx.fillStyle = color;
                    canvas.ctx.fillRect((offset.x + (column) * (cell.width + cell.spacing) ), (offset.y + (row) * (cell.width + cell.spacing) ), cell.width, cell.width);
                }
            }
        };

        var lastHash = '';

        var somethingToRender = function(){
            var hash = {
                generation: Samisdat.Conway.Generation.get()
            };

            hash = JSON.stringify(hash);

            if(hash === lastHash){
                console.log('nothing changed');
                return false;
            }

            hash = lastHash;
            return true;
        };

        var loop = function() {
            var animate = somethingToRender();

            if(true === animate){
                render();
            }

            if(true === animationPaused ){
                return;
            }

            //requestAnimationFrame(loop);
        };

        $('#conway').on('invisible', function(evt, data){
            if(undefined === data.invisible){
                return;
            }

            if(true === data.invisible){
                animationPaused = true;
                return;
            }
            else if(false === data.invisible){
                animationPaused = false;
                loop();
                return;
            }
        });

        /**
         * Everything dealing with width/height in a function
         */

        var prepareObservation = function() {
            canvas.width = $canvas.width();
            canvas.height = $canvas.height();

            // canvas is getting blury when these stunts are left
            $canvas.find('canvas').css({
                width: canvas.width + 'px',
                height: canvas.height + 'px'
            });

            canvas.ctx.canvas.width = canvas.width;
            canvas.ctx.canvas.height = canvas.height;
            canvas.ctx.width = canvas.width;
            canvas.ctx.height = canvas.height;

            // how many rows/col can be shown in given space
            visibile.rows = Math.floor((canvas.height - cell.spacing) / (cell.width + cell.spacing));
            visibile.collums = Math.floor((canvas.width - cell.spacing) / (cell.width + cell.spacing));

            // add two so we get cutted cells on all sides
            visibile.rows += 2;
            visibile.collums += 2;

            offset.x = canvas.width - (visibile.collums * (cell.width + cell.spacing) + cell.spacing);
            offset.x = Math.floor(offset.x / 2);

            offset.y = canvas.height - (visibile.rows * (cell.width + cell.spacing) + cell.spacing);
            offset.y = Math.floor(offset.y / 2);
        };

        var setupCanvas = function() {
            $canvas = $('div#conway');
            if ($canvas.get(0) === undefined) {
                return false;
            }

            canvas.ctx = $canvas.find('canvas').get(0).getContext('2d');

            if (!canvas.ctx) {
                return false;
            }

            canvas.ctx.fillStyle = '#000000';
            canvas.ctx.strokeStyle = '#000000';
            canvas.ctx.lineWidth = 1;

        };

        var getColumns = function(){

            main.offsetLeft = $('header .row').offset().left;
            main.width = parseInt($('header .col-md-4').css('margin-left'), 10);
            aside.offsetLeft = $('nav .col-md-8').offset().left;
            aside.width = $('nav .col-md-8').width() + parseInt($('header .col-md-4').css('padding-left'), 10) + parseInt($('header .col-md-4').css('padding-right'), 10);
        };

        var ready = function() {
            getColumns();
            $(window).resize(getColumns);

            setupCanvas();
            prepareObservation();

            loop();
        };

        $(document).ready(ready);
    }());

})(jQuery);
