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


            var line = d3.line().curve(d3.curveMonotoneX)
                .defined(function(d) { return d.value; })
                .x(function(d) { return x(d.date); })
                .y(function(d) { return y(d.value); });

            serie.append('path')
                .attr('class', 'line')
                .style('stroke', function(d) { return z(d[0].index); })
                .attr('d', line)
            ;

            var labels = svg.append('g')
                .attr('class', 'labels')
            ;

            series.forEach(function(serie){

                var lastNonNullValue;

                serie.forEach(function(value, index){
                    if(null === value.value){
                        return true;
                    }

                    lastNonNullValue = index;

                    svg.append("circle")
                        .attr("r", 5)
                        .style('stroke', function(d) { return z(value.index); })
                        .style('fill', function(d) { return z(value.index); })
                        .attr("cx", x(value.date) + margin.left )
                        .attr("cy", y(value.value) + margin.top );
                });

                if((serie.length -1 )!== lastNonNullValue){
                    return;
                }

                var lastNonNullValue = serie[lastNonNullValue];

                var label = labels.append('a')
                    .attr('class', 'label')
                    .attr('xlink:href', 'https://github.com/' + lastNonNullValue.key)
                    .attr('target', '_blank')
                ;

                var bg = label.append("rect")

                var xPos = x(lastNonNullValue.date) + margin.left;
                var yPos = y(lastNonNullValue.value) + margin.top - 8;
                
                var text = label.append("text")
                    //.style('stroke', function(d) { return z(lastNonNullValue.index); })
                    //.style('fill', function(d) { return z(lastNonNullValue.index); })
                    .attr("x", xPos)
                    .attr("y", yPos)
                    .text(lastNonNullValue.key)
                    /*.on("click", function(){

                        var url = 'https://github.com/' + d3.select(this).text();
                        console.log(url)
                    })*/
                ;

                console.log(lastNonNullValue)

            });

            svg.selectAll('.label').each(function() {

                var bg = d3.select(this).select('rect');
                console.log(bg)

                var labelBox = this.getBBox();

                bg
                    .attr("x", labelBox.x -2 )
                    .attr("y", labelBox.y - 2)
                    .attr("width", labelBox.width + 4)
                    .attr("height", labelBox.height + 4)
                ;
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
