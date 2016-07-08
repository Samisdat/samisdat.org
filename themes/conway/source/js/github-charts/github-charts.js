/*jslint browser: true, white: true, vars: true */
/*global jQuery, Samisdat, d3 */
(function($) {

    'use strict';

    (function($){
        $.fn.disableSelection = function() {
            return this
                     .attr('unselectable', 'on')
                     .css('user-select', 'none')
                     .on('selectstart', false);
        };
    })(jQuery);
    
    var githubChart = function($chartList) {

        var series = [];

        var svg;
        var inlineAxis;

        var margin = {top: 30, right: 0, bottom: 1   , left: 0};
        var width;
        var height;

        var x;
        var y;
        var z;

        var labelSwitchThreshold;

        var parseTime = d3.timeParse('%Y-%m-%d');

        var bisectDate = d3.bisector(function(d) { return d.date; }).left;

        var roundDate = function(dateToRound){

            var copiedDate = new Date(dateToRound.getTime());

            if(12 < copiedDate.getHours()){
                copiedDate.setDate(copiedDate.getDate() + 1);
            }

            copiedDate.setHours(0);
            copiedDate.setMinutes(0, 0, 0);

            return copiedDate;
        };

        var createInlineAxis = function(){
            inlineAxis = svg.append('g')
                .attr('class', 'inlineAxis')
            ;

            var hoverLine = inlineAxis
                .append('line')
                .attr('x1', 0).attr('x2', 0) 
                .attr('y1', -1* margin.top).attr('y2', height)
            ;    

            series.forEach(function(serie){

                var firstOfSerie = serie[0];

                inlineAxis.append('circle')
                    .attr('id', 'point-' + firstOfSerie.key.replace('/', '-'))
                    .attr('r', 6)
                    .style('fill', z(firstOfSerie.key))
                    .attr('cx', 0)
                    .attr('cy', 0)
                ;

                inlineAxis.append('text')  
                    .attr('id', 'label-' + firstOfSerie.key.replace('/', '-'))                        
                    .style('fill', 'black')
                    .style('stroke', 'black')
                    .style('black', 'blue')
                    .text(firstOfSerie.key)    
                    .attr('text-anchor', 'start')                            
                    .attr('transform', 'translate(' + 10 + ',' + y(firstOfSerie.value) + ')')                            
                ;
            });

            var labelWidth = 0;

            inlineAxis.selectAll('text').each(function(d,i) { 
                if(this.getBBox().width > labelWidth){
                    labelWidth = this.getBBox().width;
                }

                d3.select(this).attr('width', this.getBBox().width);                

            });

            labelSwitchThreshold = width - labelWidth + margin.left;
        };

        var moveInlineAxis = function(xPos){

            var dateOnPos = x.invert(xPos);
            
            var dateRounded = roundDate(dateOnPos);

            inlineAxis
                .attr('transform', 'translate(' + x(dateOnPos) + ',' + margin.top + ')')
            ;

            svg.selectAll('.serie path').each(function(serie){
                var point = this.getPointAtLength(xPos);

                var item = serie[bisectDate(serie, dateRounded)];

                point = point.y;

                var firstOfSerie = serie[0];

                inlineAxis.select('#point-' + firstOfSerie.key.replace('/', '-'))
                    .attr('transform', 'translate(' + 0 + ',' + point + ')')
                ;

                var transformX = 10;
                var label = inlineAxis.select('#label-' + firstOfSerie.key.replace('/', '-'));

                if(xPos > labelSwitchThreshold){
                    var labelWidth = parseInt(label.attr('width'), 10);
                    transformX = -10 - labelWidth;
                }
                
                label
                    .attr('transform', 'translate(' + transformX + ',' + y(item.value) + ')')                                                
                ;
            });

        };

        var createChart = function(){

            svg = d3.select('svg');

            width = svg.attr('width') - margin.left - margin.right;
            height = svg.attr('height') - margin.top - margin.bottom;
            var labelPadding = 3;

            var g = svg.append('g')
                .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
            ;

            var dates = [];

            series[0].forEach(function(serie){
                dates.push(serie.date)
            });            

            var firstDate = series[0][0].date;
            var lastDate = series[0][(series[0].length - 1)].date;

            x = d3.scaleTime()
                .domain([firstDate, lastDate])
                .range([0, width]);

            // Add the x Axis
            svg.append("g")
                .attr("transform", "translate(0," + height + ")")
                .call(d3.axisBottom().scale(x).tickValues(dates))
            ;

            y = d3.scaleLinear()
                .domain([6, 1])
                .range([height, 0]);

            z = d3.scaleCategory10();

            var serie = g.selectAll('.serie')
                .data(series)
                .enter().append('g')
                .attr('class', 'serie')
            ;

            serie.append('path')
                .attr('class', 'line')
                .style('stroke', function(d) { return z(d[0].key); })
                .attr('d', d3.line()
                .x(function(d) { return x(d.date); })
                .y(function(d) { return y(d.value); }))
            ;

        };

        var addEventListener = function(){

            svg.on('mousemove', function() {

                var mouse_x = d3.mouse(this)[0];
                moveInlineAxis(mouse_x);

            });

            svg.on('touchmove', function() {

                var mouse_x = d3.mouse(this)[0];
                moveInlineAxis(mouse_x);

            });

        };


        var getSeriesFromDom = (function(){
            var dates = $chartList.data('dates');
            
            if(undefined === dates){
                return;
            }

            var repos = {};

            dates = dates.split(',');

            var $repos = $chartList.find('li');

            $repos.each(function(){
                var positions = $(this).data('positions');
                var stars = $(this).data('stars');

                if(undefined === positions || undefined === stars){
                    $(this.remove());
                    return;
                }

                positions = positions.split(',');
                stars = stars.split(',');

                positions.forEach(function(item, index){
                    positions[index] = parseInt(item, 10);
                });

                stars.forEach(function(item, index){
                    stars[index] = parseInt(item, 10);
                });

                var repoName = $(this).find('a').text(); 

                repos[repoName] = {
                    positions: positions,
                    stars: stars
                };

                var serie = [];

                positions.forEach(function(position, index){
                    var date = parseTime(dates[index]);
                    serie.push({
                        date: date,
                        key: repoName,
                        value: position
                    });
                });

                series.push(serie);

            });

        })();

        var markup = function(){

            var width = $chartList.width();
            var height = $chartList.height();
            
            var $row = $('<div class="github-chart-wrap">');
            var $svg = $('<svg width="' + width + '" height="' + height + '"></svg>');

            $svg.disableSelection();

            $chartList.before($row);

            $row.append($svg);

            $chartList.remove();

            $svg.css('border', '1px solid red');

        };

        markup();
        createChart();
        createInlineAxis();                
        addEventListener();

        moveInlineAxis(width - 50);

    };

    Samisdat.GithubCharts = ( function() {
        var ready = function() {
            
            $('ul.github-chart').each(function(){

                githubChart($(this));
            });
        };

        $(document).ready(ready);
    }());


})(jQuery);
