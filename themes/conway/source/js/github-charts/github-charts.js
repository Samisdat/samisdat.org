/*jslint browser: true, white: true, vars: true */
/*global jQuery, Samisdat */
(function($) {

    "use strict";

    Samisdat.GithubChart = ( function() {
        
        var svg;

        var parseTime = d3.timeParse("%Y");
        var parseTime2 = d3.timeParse('%Y-%m-%d');
        var margin = {top: 30, right: 0, bottom: 1   , left: 0};

        var bisectDate = d3.bisector(function(d) { return d.date; }).left;

        var setupD3 = function(dataFromDom){

            svg = d3.select("svg");

            var width = svg.attr("width") - margin.left - margin.right;
            var height = svg.attr("height") - margin.top - margin.bottom;
            var labelPadding = 3;

            var g = svg.append("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

                var series = dataFromDom;

                var firstDate = series[0][0].date;
                var lastDate = series[0][(series[0].length - 1)].date;

                var x = d3.scaleTime()
                    .domain([firstDate, lastDate])
                    .range([0, width]);

                var y = d3.scaleLinear()
                    .domain([25, 1])
                    .range([height, 0]);

                var z = d3.scaleCategory10();

                var serie = g.selectAll(".serie")
                    .data(series)
                    .enter().append("g")
                    .attr("class", "serie");

                serie.append("path")
                    .attr("class", "line")
                    .style("stroke", function(d) { return z(d[0].key); })
                    .attr("d", d3.line()
                    .x(function(d) { return x(d.date); })
                    .y(function(d) { return y(d.value); }));

                var hoverLineGroup = svg.append("g")
                    .attr("class", "hover-line");

                var hoverLine = hoverLineGroup
                    .append("line")
                    .attr("x1", 10).attr("x2", 10) 
                    .attr("y1", 0).attr("y2", height);    

                series.forEach(function(serie){

                    var firstOfSerie = serie[0];

                        hoverLineGroup.append('circle')
                            .attr('id', 'point-' + firstOfSerie.key.replace('/', '-'))
                            .attr('r', 5)
                            .style("fill", z(firstOfSerie.key))
                            .attr('cx', 0)
                            .attr('cy', y(firstOfSerie.value) + margin.top)
                        ;

                        hoverLineGroup.append("text")  
                            .style("fill", "black")
                            .style("stroke", "black")
                            .style("black", "blue")
                            .text(firstOfSerie.key)    
                            .attr('text-anchor', 'start')                            
                            .attr('x', 0)
                            .attr('y', y(firstOfSerie.value) + margin.top )

                })                

                svg.on("mouseover", function() { 
                    //console.log('mouseover')
                }).on("mousemove", function() {

                    var mouse_x = d3.mouse(this)[0];
                    var mouse_y = d3.mouse(this)[1];
                    

                    var dateOnMouse = x.invert(mouse_x);

                    hoverLineGroup
                        .attr("transform", "translate(" + x(dateOnMouse) + "," + 0 + ")");;

                    svg.selectAll('.serie path').each(function(serie){
                        var point = this.getPointAtLength(mouse_x);

                        point = point.y + margin.top;

                        var firstOfSerie = serie[0];

                        hoverLineGroup.select('#point-' + firstOfSerie.key.replace('/', '-'))
                            //.attr('cx', x(dateOnMouse))
                            .attr('cy', point)
                        ;
                    });

                    //hoverLine.attr("x1", mouse_x).attr("x2", mouse_x)
                    hoverLineGroup.style("opacity", 1);

                })  .on("mouseout", function() {
                    //console.log('mouseout');
                    //hoverLineGroup.style("opacity", 1e-6);
                });

        };

        var createChart = function($githubChart){
            var dates = $githubChart.data('dates');
            
            if(undefined === dates){
                return;
            }

            var repos = {};

            dates = dates.split(',');

            var $repos = $githubChart.find('li');

            var datas = [];

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

                var data = [];

                positions.forEach(function(position, index){
                    var date = parseTime2(dates[index]);
                    data.push({
                        date: date,
                        key: repoName,
                        value: position
                    });
                });

                datas.push(data);

            });

            setupD3(datas);

        };

        var markup = function($githubChart){
            var $row = $('<div class="row github-chart-wrap">');
            var $left = $('<div class="col-sm-12">');
            var $svg = $('<svg width="725" height="600"></svg>');
            //var $right = $('<div class="col-sm-5">');

            $githubChart.before($row);

            $row.append($left.append($svg));
            //$row.append($right);
            $githubChart.remove();
            //$right.append($githubChart);

            $svg.attr('width', parseInt($left.width(), 10));
            //$svg.attr('height', parseInt($right.height(), 10));
            $svg.attr('height', parseInt(500, 10));

        };

        var ready = function() {
            

            $('ul.github-chart').each(function(){
                markup($(this));

                $(this).css('border', '1px solid red');
                createChart($(this));
            });
        };

        $(document).ready(ready);
    }());

})(jQuery);
