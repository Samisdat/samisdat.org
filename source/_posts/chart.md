title: chart
date: 2016-06-21 19:37:59
tags:
teaser:
---

Lorem

<div id="foo"></div>
    

<style>
svg{
    width:100%;
}
path { 
    stroke: steelblue;
    stroke-width: 2;
    fill: none;
}

.axis path,
.axis line {
    fill: none;
    stroke: grey;
    stroke-width: 1;
    shape-rendering: crispEdges;
}

</style>

<script src="http://d3js.org/d3.v3.min.js"></script>

<script>

var margin = {top: 30, right: 50, bottom: 30, left: 50},
    width = 600 - margin.left - margin.right,
    height = 270 - margin.top - margin.bottom;

var parseDate = d3.time.format("%d-%b-%y").parse;

var x = d3.time.scale().range([0, width]);
var y = d3.scale.linear().range([height, 0]);

var xAxis = d3.svg.axis().scale(x)
    .orient("bottom").ticks(5);

var yAxis = d3.svg.axis().scale(y)
    .orient("left").ticks(5);

var valueline = d3.svg.line()
    .x(function(d) { return x(d.date); })
    .y(function(d) { return y(d.close); });
    
var valueline2 = d3.svg.line()
    .x(function(d) { return x(d.date); })
    .y(function(d) { return y(d.open); });
  
var svg = d3.select("#foo")
    .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
    .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// Get the data
d3.csv("/images/data2b.csv", function(error, data) {
    data.forEach(function(d) {
        d.date = parseDate(d.date);
        d.close = +d.close;
        d.open = +d.open;
    });

    // Scale the range of the data
    x.domain(d3.extent(data, function(d) { return d.date; }));
    y.domain([0, d3.max(data, function(d) { return Math.max(d.close, d.open); })]);

    svg.append("path")      // Add the valueline path.
        .attr("class", "line")
        .attr("d", valueline(data));

    svg.append("path")      // Add the valueline2 path.
        .attr("class", "line")
        .style("stroke", "red")
        .attr("d", valueline2(data));

    svg.append("g")         // Add the X Axis
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

    svg.append("g")         // Add the Y Axis
        .attr("class", "y axis")
        .call(yAxis);

    svg.append("text")
        .attr("transform", "translate(" + (width+3) + "," + y(data[0].open) + ")")
        .attr("dy", ".35em")
        .attr("text-anchor", "start")
        .style("fill", "red")
        .text("Open");

    svg.append("text")
        .attr("transform", "translate(" + (width+3) + "," + y(data[0].close) + ")")
        .attr("dy", ".35em")
        .attr("text-anchor", "start")
        .style("fill", "steelblue")
        .text("Close");

console.log(data.length-1);
console.log(data[data.length-1].open);
console.log(data[0].open);
console.log(y(data[0].open));
console.log(y(data[0].close));

});

</script>

Ipsum