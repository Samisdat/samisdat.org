/*jslint browser: true, white: true, vars: true */
/*global jQuery, Samisdat */
(function($) {

    "use strict";

    Samisdat.GithubChart = ( function() {
        
        var svg;

        var parseTime = d3.timeParse("%Y");
        var parseTime2 = d3.timeParse('%Y-%m-%d');
        var margin = {top: 30, right: 250, bottom: 30, left: 30};
        var setupD3 = function(dataFromDom){

            svg = d3.select("svg");

            var width = +svg.attr("width") - margin.left - margin.right;
            var height = +svg.attr("height") - margin.top - margin.bottom;
            var labelPadding = 3;

            var g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

            d3.requestTsv("/images/data.tsv", function(d) {
                d.date = parseTime(d.date);
                for (var k in d){
                    if (k !== "date"){
                        d[k] = +d[k];    
                    } 
                } 
                return d;
            }, function(error, data) {

                if (error){
                    throw error;    
                } 
                console.log(data[0])
                var series = data.columns.slice(1).map(function(key) {
                    return data.map(function(d) {
                        return {
                            key: key,
                            date: d.date,
                            value: d[key]
                        };
                    });
                });

                console.log(series)

                var x = d3.scaleTime()
                    .domain([data[0].date, data[data.length - 1].date])
                    .range([0, width]);

                var y = d3.scaleLinear()
                    .domain([25, 1])
                    .range([height, 0]);

                var z = d3.scaleCategory10();

                g.append("g")
                    .attr("class", "axis axis--x")
                    .attr("transform", "translate(0," + height + ")")
                    .call(d3.axisBottom(x));

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
                var label = serie.selectAll(".label")
                    .data(function(d) { return d; })
                    .enter().append("g")
                    .attr("class", "label")
                    .attr("transform", function(d, i) { return "translate(" + x(d.date) + "," + y(d.value) + ")"; });


                label.append("text")
                    .attr("dy", ".35em")
                    .text(function(d) { return d.value; })
                    //.filter(function(d, i) { return i === data.length - 1; })
                    .filter(function(d, i) { return 7 === 8; })
                    .append("tspan")
                    .attr("class", "label-key")
                    .text(function(d) { return " " + d.key; });

                label.append("rect", "text")
                    .datum(function() { return this.nextSibling.getBBox(); })
                    .attr("x", function(d) { return d.x - labelPadding; })
                    .attr("y", function(d) { return d.y - labelPadding; })
                    .attr("width", function(d) { return d.width + 2 * labelPadding; })
                    .attr("height", function(d) { return d.height + 2 * labelPadding; });
                */
                for(let i = 0, x = series.length; i < x; i += 1){
                    var lastOfSerie = series[i][(series[i].length - 1)];

                    svg.append("text")  
                        .attr("transform", "translate(" + (margin.left + width + 10) + "," + (margin.top + y(lastOfSerie.value)) + ")")
                        .attr("dy", ".35em")
                        .attr("text-anchor", "start")
                        .style("fill", "red")
                        .text(lastOfSerie.key);                    

                    }

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
                        data:date,
                        key:repoName,
                        value: position
                    });
                });

                datas.push(data);

            });
            console.log(datas)
            /*

            var datas = [];

            dates.forEach(function(date, index){

                var data = [];

                console.log(date, index);                    
                date = parseTime2(date);

                for(var repo in repos){
                    data.push({
                        date: date,
                        key: repo,
                        value: repos[repo].positions[index],
                    })
                }
                console.log(data);                    
            });
            */

        };

        var fromDom = function(){

            $('ul.github-chart').each(function(){
                createChart($(this));
            });

        };

        var ready = function() {
            setupD3();

            fromDom();
        };

        $(document).ready(ready);
    }());

})(jQuery);
