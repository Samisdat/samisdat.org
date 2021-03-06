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
            top: 40, 
            right: 3, 
            bottom: 10, 
            left: 3
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

        var roundDate = function(dateToRound){

            var before = new Date(dateToRound.getTime());
            before.setHours(0);
            before.setMinutes(0, 0, 0);

            var after = new Date(dateToRound.getTime());

            after.setDate(after.getDate() + 1);

            after.setHours(0);
            after.setMinutes(0, 0, 0);

            return {
                before: before,
                after: after                
            };
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

                inlineAxis.append('circle')
                    .attr('id', 'point-' + keyToId(firstOfSerie.key))
                    .attr('r', radius)
                    .style('fill', z(firstOfSerie.key))
                    .style('stroke', 'none')
                    .attr('cx', 0)
                    .attr('cy', 0)
                ;
                /*
                inlineAxis.append('text')
                    .attr('id', 'label-' + firstOfSerie.key.replace('/', '-'))
                    .style('fill', 'black')
                    .style('stroke', 'black')
                    .text(firstOfSerie.key)
                    .attr('text-anchor', 'end')
                    .style('opacity', 0)
                    .attr('x', -20)
                    .attr('transform', 'translate(0,' + y(firstOfSerie.value) + ')')
                ;
                */
            });

            var labelWidth = 0;

            inlineAxis.selectAll('text').each(function() {
                if (this.getBBox().width > labelWidth){
                    labelWidth = this.getBBox().width;
                }

                d3.select(this).attr('width', this.getBBox().width);

            });

            labelSwitchThreshold = labelWidth + margin.left;
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

        var lastDate;

        var __moveInlineAxis = function(xPos){
            if(margin.left > xPos){
                xPos = margin.left;
            }

            if(margin.left + width < xPos){
                xPos = margin.left + width;
            }

            var xValue = xPos - margin.left;

            var dateOnPos = x.invert(xPos);

            var dateRounded = roundDate(dateOnPos);

            if(lastDate === dateRounded){
                return;
            }

            lastDate = dateRounded;

            console.log(lastDate, dateRounded);
            inlineAxis
                .attr('transform', 'translate(' + x(dateOnPos) + ',' + margin.top + ')')
            ;

            var checkValueOnDate = function(date, serie){

                var hasValueOnDate = false;

                serie.forEach(function(day){
                    if(date.toString() !== day.date.toString()){
                        return true;
                    }

                    if(null === day.value){
                        return true;
                    }

                    hasValueOnDate = true;
                    return false;
                    
                });

                return hasValueOnDate;
            };

            var hideInlineLabel = function(item){
                inlineAxis.select('#point-' + item.key.replace('/', '-'))
                    .style('opacity', 0)
                ;


                var label = inlineAxis.select('#label-' + item.key.replace('/', '-'))
                    .style('opacity', 0)
                ;

            };

            svg.selectAll('.serie path').each(function(serie){

                var hasValueOnDate = checkValueOnDate(dateRounded, serie);

                var item = serie[bisectDate(serie, dateRounded)];
                console.log(hasValueOnDate, item)
                if(null === item.value){
                    hideInlineLabel(item);
                    return;
                }

                var pathEl = this;
                var pathLength = pathEl.getTotalLength();

                var offsetLeft = 0;

                var x = xValue; 

                var beginning = x, end = pathLength, target;

                var pos;

                while (true) {
                    target = Math.floor((beginning + end) / 2);
                    pos = pathEl.getPointAtLength(target);
                    
                    if ((target === end || target === beginning) && pos.x !== x) {
                        break;
                    }

                    if (pos.x > x){
                        end = target;
                    }      
                    else if (pos.x < x){ 
                        beginning = target;
                    }
                    else{
                        break; //position found
                    }
                }

                var point = pos.y;

                var firstOfSerie = getFirstValueOfSerie(serie);

                inlineAxis.select('#point-' + firstOfSerie.key.replace('/', '-'))
                    .attr('transform', 'translate(' + 0 + ',' + point + ')')
                    .style('opacity', 1)
                ;

                var transformX = -10;

                var label = inlineAxis.select('#label-' + firstOfSerie.key.replace('/', '-'))
                    .style('opacity', 1)
                ;

                console.log(label)

                if (xPos < labelSwitchThreshold){
                    var labelWidth = parseInt(label.attr('width'), 10);
                    transformX = labelWidth + 10;
                }

                if(lastY === y(item.value)){
                    label
                        .attr('transform', 'translate(0,' + y(item.value) + ')')
                        .attr('x',  transformX)
                    ;
                }
                else{
                    label
                        .attr('x', transformX)                    
                        .attr('transform', 'translate(0,' + y(item.value) + ')')
                    ;
                }


                return;

                var lastY = label.attr('data-last-y')   ;
                if(null !== lastY){
                    lastY = lastY * 1;
                }
                else{
                    lastY = y(item.value);   
                }

                label.attr('data-last-y', y(item.value));

                if (xPos < labelSwitchThreshold){
                    var labelWidth = parseInt(label.attr('width'), 10);
                    transformX = labelWidth + 10;
                }

                if(lastY === y(item.value)){
                    label
                        .attr('transform', 'translate(0,' + y(item.value) + ')')
                        .attr('x',  transformX)
                    ;
                }
                else{
                    label
                        .attr('x', transformX)                    
                        .attr('transform', 'translate(0,' + lastY + ')')
                        .transition()
                        .attr('transform', 'translate(0,' + y(item.value) + ')')
                    ;
                }

            });

        };

        var checkValueOnDate = function(date, serie){

            var hasValueOnDate = false;

            serie.forEach(function(day){
                if(date.toString() !== day.date.toString()){
                    return true;
                }

                if(null === day.value){
                    return true;
                }

                hasValueOnDate = true;
                return false;
                
            });

            return hasValueOnDate;
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

            inlineAxis
                .attr('transform', 'translate(' + x(dateOnPos) + ',' + margin.top + ')')
            ;

            var datesArounded = roundDate(dateOnPos);

            svg.selectAll('.serie path').each(function(serie){

                var hasValueBefore = checkValueOnDate(datesArounded.before, serie);
                var hasValueAfter = checkValueOnDate(datesArounded.after, serie);

                var firstOfSerie = getFirstValueOfSerie(serie);

                var movingPoint = inlineAxis.select('#point-' + keyToId(firstOfSerie.key));


                if(false === hasValueBefore || false === hasValueAfter){
                    movingPoint.style('opacity', 0);
                    return;
                }

                movingPoint.style('opacity', 1);

                var item = serie[bisectDate(serie, datesArounded.before)];


                var pathEl = this;
                var pathLength = pathEl.getTotalLength();

                var offsetLeft = 0;

                var x = xValue; 

                var beginning = x, end = pathLength, target;

                var pos;

                while (true) {
                    target = Math.floor((beginning + end) / 2);
                    pos = pathEl.getPointAtLength(target);
                    
                    if ((target === end || target === beginning) && pos.x !== x) {
                        break;
                    }

                    if (pos.x > x){
                        end = target;
                    }      
                    else if (pos.x < x){ 
                        beginning = target;
                    }
                    else{
                        break; //position found
                    }
                }

                var point = pos.y;

                movingPoint.attr('transform', 'translate(' + 0 + ',' + point + ')')

                console.log(datesArounded.before, datesArounded.before);
                console.log(serie[0].key, hasValueBefore, hasValueAfter);
            });


            console.log(dateOnPos, datesArounded);


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

            createInlineAxis();

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
                .style('stroke', function(d) { return z(d[0].key); })
                .attr("d", line)
                /*
                .attr('d', d3.line()//.curve(d3.curveMonotoneX)
                .x(function(d) { return x(d.date); })
                .y(function(d) { return y(d.value); }))
                */
            ;

            series.forEach(function(serie){
                serie.forEach(function(value){
                    if(null === value.value){
                        return true;
                    }

                    svg.append("circle")
                        .attr("r", 4)
                        .style('stroke', function(d) { return z(value.key); })
                        .style('fill', function(d) { return z(value.key); })
                        .attr("cx", x(value.date) + margin.left )
                        .attr("cy", y(value.value) + margin.top );
                });
            });

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

                positions.forEach(function(position, index){
                    var date = dates[index];
                    serie.push({
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
            var listHeight = $chartList.height();

            var $row = $('<div class="github-chart-wrap">');
            var $svg = $('<svg width="' + listWidth + '" height="' + listHeight + '"></svg>');

            $svg.disableSelection();

            $chartList.before($row);

            $row.append($svg);

            //$chartList.remove();

        };

        getSeriesFromDom();
        markup();
        createChart();

        addEventListener();

        moveInlineAxis(width + margin.left - 1);

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
