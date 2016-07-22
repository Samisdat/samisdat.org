'use strict';

(function($) {


    $.fn.disableSelection = function() {
        return this
            .attr('unselectable', 'on')
            .css('user-select', 'none')
            .on('selectstart', false);
    };

    var githubChart = function($chartList) {

        var series = [];
        var dates = [];

        var svg;
        var inlineAxis;

        var margin = {top: 40, right: 20, bottom: 10, left: 20};
        var radius = 20;
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

            if (12 < copiedDate.getHours()){
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

            inlineAxis
                .append('line')
                .attr('x1', 0)
                .attr('x2', 0)
                .attr('y1', -1 * margin.top)
                .attr('y2', height)
            ;

            series.forEach(function(serie){

                var firstOfSerie = serie[0];

                var circle = inlineAxis.append('g')
                    .attr('id', 'point-' + firstOfSerie.key.replace('/', '-'))
                ;

                circle.append('rect')
                    .attr('x', -radius)
                    .attr('y', -radius)
                    .style('fill', z(firstOfSerie.key))
                    .style('stroke', 'none')
                    .style('opacity', 0.3)
                    .attr('width', radius * 2)
                    .attr('height', radius * 2)
                ;
                
                circle.append('line')
                    .attr('x1', -radius)
                    .attr('x2', radius)
                    .attr('y1', -radius)
                    .attr('y2', radius)
                    .style('fill', 'none')
                    .style('stroke', '1px')
                ;

                circle.append('line')
                    .attr('x1', -2*radius)
                    .attr('x2', 2*radius)
                    .attr('y1', 2*radius)
                    .attr('y2', -2*radius)
                    .style('fill', 'none')
                    .style('stroke', '1px')
                ;

                circle.append('circle')
                    .attr('r', radius)
                    .style('fill', z(firstOfSerie.key))
                    .style('stroke', 'none')
                    .style('opacity', 0.3)
                    .attr('cx', 0)
                    .attr('cy', 0)
                ;

                inlineAxis.append('text')
                    .attr('id', 'label-' + firstOfSerie.key.replace('/', '-'))
                    .style('fill', 'black')
                    .style('stroke', 'black')
                    .text(firstOfSerie.key)
                    .attr('text-anchor', 'start')
                    .attr('transform', 'translate(' + 10 + ',' + y(firstOfSerie.value) + ')')
                ;
            });

            var labelWidth = 0;

            inlineAxis.selectAll('text').each(function() {
                if (this.getBBox().width > labelWidth){
                    labelWidth = this.getBBox().width;
                }

                d3.select(this).attr('width', this.getBBox().width);

            });

            labelSwitchThreshold = width - labelWidth + margin.left;
        };

        var __moveInlineAxis = function(xPos){

            if(margin.left > xPos){
                xPos = margin.left;
            }

            if(margin.left + width < xPos){
                xPos = margin.left + width;
            }

            var dateOnPos = x.invert(xPos);

            var dateRounded = roundDate(dateOnPos);

            inlineAxis
                .attr('transform', 'translate(' + x(dateOnPos) + ',' + margin.top + ')')
            ;

            svg.selectAll('.serie path').each(function(serie){
                var point = this.getPointAtLength(xPos);
                console.log(point)
                var item = serie[bisectDate(serie, dateRounded)];

                point = point.y;

                var firstOfSerie = serie[0];

                inlineAxis.select('#point-' + firstOfSerie.key.replace('/', '-'))
                    .attr('transform', 'translate(' + 0 + ',' + point + ')')
                ;

                var transformX = 10;
                var label = inlineAxis.select('#label-' + firstOfSerie.key.replace('/', '-'));

                if (xPos > labelSwitchThreshold){
                    var labelWidth = parseInt(label.attr('width'), 10);
                    transformX = -10 - labelWidth;
                }

                label
                    .attr('transform', 'translate(' + transformX + ',' + y(item.value) + ')')
                ;
            });

        };


        var moveInlineAxis = function(xPos){

            if(margin.left > xPos){
                xPos = margin.left;
            }

            if(margin.left + width < xPos){
                xPos = margin.left + width;
            }

            var xValue = xPos - margin.left;

            var dateOnPos = x.invert(xPos);

            console.log(xPos, xValue, dateOnPos, x.invert(xValue))

            var dateRounded = roundDate(dateOnPos);

            inlineAxis
                .attr('transform', 'translate(' + x(dateOnPos) + ',' + margin.top + ')')
            ;

            svg.selectAll('.serie path').each(function(serie){

                var item = serie[bisectDate(serie, dateRounded)];

                var pathEl = this;
                var pathLength = pathEl.getTotalLength();

                var offsetLeft = 0;

                var x = xPos - offsetLeft; 

                  var beginning = x, end = pathLength, target;

                  var pos;

                  while (true) {
                    target = Math.floor((beginning + end) / 2);
                    pos = pathEl.getPointAtLength(target);
                    if ((target === end || target === beginning) && pos.x !== x) {
                        break;
                    }
                    if (pos.x > x)      end = target;
                    else if (pos.x < x) beginning = target;
                    else                break; //position found
                  }


                var point = pos.y;

                var firstOfSerie = serie[0];

                inlineAxis.select('#point-' + firstOfSerie.key.replace('/', '-'))
                    .attr('transform', 'translate(' + 0 + ',' + point + ')')
                ;

                var transformX = 10;
                var label = inlineAxis.select('#label-' + firstOfSerie.key.replace('/', '-'));

                if (xPos > labelSwitchThreshold){
                    var labelWidth = parseInt(label.attr('width'), 10);
                    transformX = -10 - labelWidth;
                }

                label
                    .attr('transform', 'translate(' + transformX + ',' + y(item.value) + ')')
                ;
            });

        };

        var createBackgroundAxis = function(){
            var formatDayMonth = d3.timeFormat('%d.%m');

            var axixBg = svg.append('g')
                .attr('transform', 'translate(' + 0 + ',' + 0 + ')')
            ;

            dates.forEach(function(date, index){

                var zebra = (0 === index % 2) ? 'odd' : 'even';

                axixBg.append('rect')
                    .attr('class', 'axis-bg ' + zebra)
                    .attr('x', x(date) + margin.left)
                    .attr('y', 0)
                    .attr('width', x(dates[1]))
                    .attr('height', height + margin.top + margin.bottom)
                ;
            });

            var firstDate = dates.slice(0, 1).pop();
            var lastDate = dates.slice(-1).pop();

            axixBg.append('text')
                .attr('class', 'axis-bg-text')
                .style('fill', 'black')
                .text(formatDayMonth(firstDate))
                .attr('text-anchor', 'start')
                .attr('transform', 'translate(' + x(firstDate) + margin.left + ',' + 12 + ')')
            ;

            axixBg.append('text')
                .attr('class', 'axis-bg-text')
                .style('fill', 'black')
                .text(formatDayMonth(lastDate))
                .attr('text-anchor', 'end')
                .attr('transform', 'translate(' + (x(lastDate) + margin.left) + ',' + 12 + ')')
            ;

        };

        var createChart = function(){

            svg = d3.select('svg');

            width = svg.attr('width') - margin.left - margin.right;
            height = svg.attr('height') - margin.top - margin.bottom;

            var firstDate = dates.slice(0, 1).pop();
            var lastDate = dates.slice(-1).pop();

            var min = undefined;
            var max = undefined;

            series.forEach(function(serie){
                serie.forEach(function(value){
                    if(undefined === min || min > value.value){
                        min = value.value;
                    }
                    if(undefined === max || max < value.value){
                        max = value.value;
                    }
                });
            });

            x = d3.scaleTime()
                .domain([firstDate, lastDate])
                .range([0, width]);

            y = d3.scaleLinear()
                .domain([max, min])
                .range([height, 0]);

            z = d3.scaleOrdinal(d3.schemeCategory10);

            createBackgroundAxis();

            var g = svg.append('g')
                .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
            ;

            var serie = g.selectAll('.serie')
                .data(series)
                .enter().append('g')
                .attr('class', 'serie')
            ;

            serie.append('path')
                .attr('class', 'line')
                .style('stroke', function(d) { return z(d[0].key); })
                .attr('d', d3.line()/*.curve(d3.curveCatmullRom.alpha(1))*/
                .x(function(d) { return x(d.date); })
                .y(function(d) { return y(d.value); }))
            ;

        };

        var addEventListener = function(){

            svg.on('mousemove', function() {

                var mouseX = d3.mouse(this)[0];
                moveInlineAxis(mouseX);

            });

            svg.on('touchmove', function() {

                var mouseX = d3.mouse(this)[0];
                moveInlineAxis(mouseX);

            });

        };


        var getSeriesFromDom = function(){
            dates = $chartList.data('dates');

            if (undefined === dates){
                return;
            }

            var repos = {};

            dates = dates.split(',');

            dates.forEach(function(date, index){
                dates[index] = parseTime(date);
            });

            var $repos = $chartList.find('li');

            $repos.each(function(index){
                var fakePosition = Array.apply(index, { length: $repos.length })
                fakePosition.fill(index + 1);

                var positions = $(this).data('positions');
                var stars = $(this).data('stars');

                if (undefined === positions || undefined === stars){
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

                //positions = fakePosition;

                var repoName = $(this).find('a').text();

                repos[repoName] = {
                    positions: positions,
                    stars: stars
                };

                var serie = [];

                positions.forEach(function(position, index){
                    var date = dates[index];
                    serie.push({
                        date: date,
                        key: repoName,
                        value: position
                    });
                });

                var lastSerieValue = serie[serie.length - 1];

                if(8 < index){
                    return true;
                }
                series.push(serie);


            });

        };

        var markup = function(){

            var listWidth = $chartList.width();
            var listHeight = $chartList.height();

            var $row = $('<div class="github-chart-wrap">');
            var $svg = $('<svg width="' + listWidth + '" height="' + listHeight + '"></svg>');

            $svg.disableSelection();

            $chartList.before($row);

            $row.append($svg);

            $chartList.remove();

        };

        getSeriesFromDom();
        markup();
        createChart();
        createInlineAxis();
        addEventListener();

        //moveInlineAxis(width + margin.left);
        //moveInlineAxis(margin.left);
        moveInlineAxis(200);

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
