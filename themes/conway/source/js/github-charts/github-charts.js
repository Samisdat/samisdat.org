/*jslint browser: true, white: true, vars: true */
/*global jQuery, Samisdat */
(function($) {

    "use strict";

    Samisdat.GithubChart = ( function() {
        
        var svg;

        var parseTime = d3.timeParse("%Y");
        var parseTime2 = d3.timeParse('%Y-%m-%d');
        var margin = {top: 30, right: 0, bottom: 1   , left: 0};

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
                /*
                g.append("g")
                    .attr("class", "axis axis--x")
                    .attr("transform", "translate(0," + height + ")")
                    .call(d3.axisBottom(x));
                */
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

                /*
                for(let i = 0, x = series.length; i < x; i += 1){
                    var lastOfSerie = series[i][(series[i].length - 1)];

                    svg.append("text")  
                        .attr("transform", "translate(" + (margin.left + width + 10) + "," + (margin.top + y(lastOfSerie.value)) + ")")
                        .attr("dy", ".35em")
                        .attr("text-anchor", "start")
                        .style("fill", "red")
                        .text(lastOfSerie.key);                    

                }
                */

                var addInlineAxix = function(date){

                    var values = [];

                    series.forEach(function(serie){
                        serie.forEach(function(data){
                            
                            if(data.date.getTime() === date.getTime()){
                                values.push(data);
                            }
                        });
                    });

                    var inlineAxisGroup = svg.append("g")
                        .style("opacity", "0.5")
                        .attr("class", "inlineAxis")
                        .attr('id', 'date-' + date.getTime())
                    ;
   
                    var inlineAxisLine = inlineAxisGroup
                        .append("line")
                        .attr("x1", x(date)).attr("x2", x(date)) 
                        .attr("y1", 0).attr("y2", height);    
                        
                    values.forEach(function(value){

                        inlineAxisGroup.append('circle')
                            .attr('r', 3)
                            .attr('class', 'circle focusCircle')
                            .attr('cx', x(date))
                            .attr('cy', y(value.value) + margin.top)
                        ;

                        inlineAxisGroup.append("text")  
                            .style("fill", "black")
                            .style("stroke", "black")
                            .style("black", "blue")
                            .text(value.key)    
                            .attr('text-anchor', 'start')                            
                            .attr('x', x(date))
                            .attr('y', y(value.value) + margin.top )
                        ;                    

                    });
                    var switchSide = false;
                    inlineAxisGroup.selectAll("text").each(function(d,i) { 
                        if(width < (x(date) + this.getComputedTextLength())){
                            switchSide = true;
                        }
                    });

                    if(true === switchSide){

                        inlineAxisGroup.selectAll("text").each(function(d,i) { 
                            d3.select(this).attr('text-anchor', 'end');                            

                        });

                    }
                    

                };

                addInlineAxix(series[0][0].date);
                addInlineAxix(series[0][1].date);
                addInlineAxix(series[0][2].date);
                addInlineAxix(series[0][3].date);
                addInlineAxix(series[0][4].date);
                addInlineAxix(series[0][5].date);
                addInlineAxix(series[0][6].date);

                

                var hoverLineGroup = svg.append("g")
                    .attr("class", "hover-line");

                var hoverLine = hoverLineGroup
                    .append("line")
                    .attr("x1", 10).attr("x2", 10) 
                    .attr("y1", 0).attr("y2", height);    

                var bisectDate = d3.bisector(function(d) { return d[0]; }).left;    

                svg.on("mouseover", function() { 
                    console.log('mouseover')
                }).on("mousemove", function() {

                    var mouse_x = d3.mouse(this)[0];
                    var mouse_y = d3.mouse(this)[1];
                    

                    var dateOnMouse = x.invert(mouse_x);

                    var roundDate = function(date){
                        if(12 < date.getHours()){
                            date.setDate(date.getDate() + 1);
                        }
                        date.setHours(0);
                        date.setMinutes(0);
                        date.setSeconds(0);
                        date.setMilliseconds(0);                    

                        return date;
                    };
                    
                    console.log(dateOnMouse, roundDate(dateOnMouse))
                    var i = bisectDate(series, dateOnMouse);
                    console.log(i)

                    hoverLine.attr("x1", mouse_x).attr("x2", mouse_x)
                    hoverLineGroup.style("opacity", 1);

                    svg.selectAll('.inlineAxis').style('opacity', 0)

                    svg.select('#date-' + dateOnMouse.getTime()).style('opacity', 1);
                    
                    /*
                    svg.selectAll('.inlineAxis').each(function(){
                        console.log(this)
                    });
                    */

                })  .on("mouseout", function() {
                    console.log('mouseout');
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
