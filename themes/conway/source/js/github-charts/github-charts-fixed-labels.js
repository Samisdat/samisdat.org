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

        var margin = {
            top: 20, 
            right: 6, 
            bottom: 10, 
            left: 10
        };
        

        var radius = 5;
        var width;
        var height;

        var x;
        var y;
        var z;

        var labelSwitchThreshold;

        var parseTime = d3.timeParse('%Y-%m-%d');

        var bisectDate = d3.bisector(function(d) { return d.date; }).left;

        var keyToId = function(key){

            var id = key + '';
            id.toLowerCase();

            id = id.replace(/\//g, '-');
            id = id.replace(/\./g, '-');

            return id; 
        };

        var getFirstValueOfSerie = function(serie){

            var firstNotNullValue;

            serie.forEach(function(value, index){
                if(null === value.value){
                    return true;
                }

                if(undefined !== firstNotNullValue){
                    return false;
                }

                firstNotNullValue = index;
            });

            return serie[firstNotNullValue];
        };

        var createBackgroundAxis = function(){
            var formatDayMonth = d3.timeFormat('%d.%m');

            var axixBg = svg.append('g')
                .attr('transform', 'translate(' + 0 + ',' + 0 + ')')
                .attr('class', 'axis-bg')                
            ;

            dates.forEach(function(date, index){

                var label = axixBg  .append('g')
                    .attr('id', 'axis-bg-date-label-' + getDateFormated(date))
                    .attr('class', 'axis-bg-date-label')
                ;

                label.append('rect')
                    .attr('x', x(date) + margin.left - radius)
                    .attr('y', margin.top)
                    .attr('width', radius * 2)
                    .attr('height', height)
                ;

                label.append('text')
                    .text(formatDayMonth(date))
                    .attr('x', x(date) + margin.left - radius)
                    .attr('y', margin.top)
                ;

            });

            return;
            dates.forEach(function(date, index){

                if(index + 1 === dates.length ){
                    return false;
                }

                var zebra = (0 === index % 2) ? 'odd' : 'even';

                axixBg.append('rect')
                    .attr('class', 'axis-bg ' + zebra)
                    .attr('x', x(date) + margin.left)
                    .attr('y', 0)
                    .attr('width', x(dates[1]))
                    .attr('height', height + margin.top + margin.bottom)
                ;
            });

            return;

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

        var addDataPoints = function(){

            var dataPoints = svg.append('g')
                .attr('class', 'data-points')
            ;

            series.forEach(function(serie){

                serie.forEach(function(value, index){
                    if(null === value.value){
                        return true;
                    }

                    dataPoints.append("circle")
                        .attr("label", 'data-point')
                        .attr("r", 4)
                        .style('stroke', function(d) { return z(value.index); })
                        .style('fill', function(d) { return z(value.index); })
                        .attr("cx", x(value.date) + margin.left )
                        .attr("cy", y(value.value) + margin.top )
                    ;
                });

            });
        };

        var roundDate = function(dateToRound){

            var copiedDate = new Date(dateToRound.getTime());

            if (12 < copiedDate.getHours()){
                copiedDate.setDate(copiedDate.getDate() + 1);
            }

            copiedDate.setHours(0);
            copiedDate.setMinutes(0, 0, 0);

            return copiedDate;
        };

        var dateFormat = d3.timeFormat('%y-%m-%d');

        var getDateFormated = function(date){
            
            return dateFormat(date);

        };

        var createInlineAxis = function(){
            
            inlineAxis = svg.append('line')
                .attr('class', 'inlineAxis')            
                .attr('x1', 0)
                .attr('x2', 0)
                .attr('y1', -1 * margin.top)
                .attr('y2', height)
            ;
        };

        var checkValueOnDate = function(serie){

            var hasValueOnDate = false;

            serie.forEach(function(day){

                if(activeDay.toString() !== day.date.toString()){
                    return true;
                }

                if(null === day.value){
                    return true;
                }

                hasValueOnDate = day;
                return false;
                
            });

            return hasValueOnDate;
        };

        var activeDay;

        var activateDay = function(){

            var dateLabel = d3.select('.axis-bg-date-label.active')
                .classed('active', false);
            ;

            var dateLabel = d3.select('#axis-bg-date-label-' + getDateFormated(activeDay))
                .classed('active', true);
            ;

            svg.select("g.datapoints-highlights").selectAll("*").remove();
            svg.select("g.datapoints-highlights").remove();

            var highlights = svg.append('g')
                .attr('class', 'datapoints-highlights')
            ;

            var labels = highlights.append('g')
                .attr('class', 'labels')
            ;

            var xPos;

            svg.selectAll('.serie path').each(function(serie){

                var hasValueOnDate = checkValueOnDate(serie);
                
                if(false === hasValueOnDate){
                    return true;
                }

                var label = labels.append('a')
                    .attr('class', 'label')
                    .attr('xlink:href', 'https://github.com/' + hasValueOnDate.key)
                    .attr('target', '_blank')
                ;

                var bg = label.append("rect")
                    .style('stroke', function(d) { return z(hasValueOnDate.index); })
                    .attr('rx', '2')
                    .attr('ry', '2')
                ;

                var highlightCircle = labels.append("circle")
                    .attr("r", 7)
                    .style('fill', 'white')
                    .style('stroke-width', '1')
                    .style('stroke', function(d) { return z(hasValueOnDate.index); })
                    .attr("cx", x(hasValueOnDate.date) + margin.left )
                    .attr("cy", y(hasValueOnDate.value) + margin.top )
                    
                    labels.append("circle")
                        .attr("label", 'data-point')
                        .attr("r", 4)
                        .style('stroke', function(d) { return z(hasValueOnDate.index); })
                        .style('fill', function(d) { return z(hasValueOnDate.index); })
                        .attr("cx", x(hasValueOnDate.date) + margin.left )
                        .attr("cy", y(hasValueOnDate.value) + margin.top )
                    ;
                   
                xPos = x(hasValueOnDate.date) + margin.left;
                var yPos = y(hasValueOnDate.value) + margin.top - 8;
                
                var text = label.append("text")
                    //.style('fill', function(d) { return z(lastNonNullValue.index); })
                    .attr("x", xPos - 4)
                    .attr("y", yPos + 1)
                    .text(hasValueOnDate.key)
                ;

            });         

            var switchSide = false;
            svg.selectAll('.label').each(function() {

                if(true === switchSide){
                    return true;
                }
                var labelBox = this.getBBox();

                if(xPos < labelBox.width){
                    switchSide = true;
                    return true;
                }

                return true;
            });

            svg.selectAll('.label').each(function() {

                if(true === switchSide){

                    var text = d3.select(this).select('text');

                    text
                        .attr('text-anchor', 'start' )
                    ;                                        
                }    

                var labelBox = this.getBBox();

                if(true === switchSide){

                    text
                        .attr('x', labelBox.x + 10)
                    ;                                        
                }

                var bg = d3.select(this).select('rect');

                var x = labelBox.x - 4;

                if(true === switchSide){
                    x += 10;
                }

                bg
                    .attr("x",  x )
                    .attr("y", labelBox.y - 2 )
                    .attr("width", labelBox.width + 8)
                    .attr("height", labelBox.height + 4)
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


            inlineAxis
                .attr('transform', 'translate(' + xPos + ',' + margin.top + ')')
            ;

            var dateOnPos = x.invert(xPos);

            var dateRounded = roundDate(dateOnPos);


            if(undefined === activeDay || activeDay.toString() !== dateRounded.toString()){
                activeDay = dateRounded;

                activateDay();
            }

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
            createInlineAxis();

            createBackgroundAxis();

            var g = svg.append('g')
                .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
            ;

            var serie = g.selectAll('.serie')
                .data(series)
                .enter().append('g')
                .attr('class', 'serie')
            ;


            var line = d3.line().curve(d3.curveMonotoneX)
                .defined(function(d) { return d.value; })
                .x(function(d) { return x(d.date); })
                .y(function(d) { return y(d.value); });

            serie.append('path')
                .attr('class', 'line')
                .style('stroke', function(d) { return z(d[0].index); })
                .attr('d', line)
            ;

            addDataPoints();

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
                    var value = null;
                    if('' !== item){
                        value = parseInt(item, 10);
                    }

                    positions[index] = value;


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

                positions.forEach(function(position, index2){
                    var date = dates[index2];
                    serie.push({
                        index: index,
                        date: date,
                        key: $.trim(repoName),
                        value: position
                    });
                });

                var lastSerieValue = serie[serie.length - 1];


                series.push(serie);


            });

        };

        var markup = function(){

            var listWidth = $chartList.width();
            var listHeight = $chartList.height() * 1.3;

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

        addEventListener();

        activeDay = dates[ (dates.length - 1 )];
        activeDay = dates[ 1 ];
        activateDay();
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
