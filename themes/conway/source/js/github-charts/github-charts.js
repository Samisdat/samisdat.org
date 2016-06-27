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

                for(let i = 0, x = series.length; i < x; i += 1){
                    var lastOfSerie = series[i][(series[i].length - 1)];

                    svg.append("text")  
                        .attr("transform", "translate(" + (margin.left + width + 10) + "," + (margin.top + y(lastOfSerie.value)) + ")")
                        .attr("dy", ".35em")
                        .attr("text-anchor", "start")
                        .style("fill", "red")
                        .text(lastOfSerie.key);                    

                }

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

        var fromDom = function(){

            $('ul.github-chart').each(function(){
                createChart($(this));
            });

        };

        var ready = function() {

            fromDom();
        };

        $(document).ready(ready);
    }());

})(jQuery);
