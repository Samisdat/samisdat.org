/*jslint browser: true, white: true, vars: true */
/*global jQuery, Samisdat */
(function($) {

    "use strict";

    Samisdat.GithubChart = ( function() {
        
        var $gitChart;
        var gitChart;

        var MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

        var randomScalingFactor = function() {
            return Math.round(Math.random() * 25);
        };

        var data = (function(){

            var repos = [
                '/FreeCodeCamp/FreeCodeCamp',
                '/fed135/Kalm',
                '/gittips\/tips',
                '/bahmutov/javascript-journey',
                '/UDST/vizicities',
                '/benjamn/reify',
                '/angular/angular.js',
                '/getify/You-Dont-Know-JS',
                '/parkjs814/AlgorithmVisualizer',
                '/facebook/react',
                '/GoogleChrome/lighthouse',
                '/nickberens360/atomic-docs',
                '/airbnb/javascript',
                '/weixin/tmt-workflow',
                '/luruke/barba.js',
                '/SamyPesse/gitkit-js',
                '/vuejs/vue',
                '/yoshuawuyts/choo',
                '/nodejs/node',
                '/reactjs/redux',
                '/nylas/N1',
                '/tj/react-enroute',
                '/dvLden/Vidage',
                '/weixin/WeFlow',
                '/algolia/places'
            ];

            var dataSetConfig = {
                fill: false,
                backgroundColor: "rgba(75,192,192,0.4)",
                borderColor: "rgba(75,192,192,1)",
                borderCapStyle: 'butt',
                borderDash: [],
                borderDashOffset: 0.0,
                borderJoinStyle: 'miter',
                pointBorderColor: "rgba(75,192,192,1)",
                pointBackgroundColor: "#fff",
                pointBorderWidth: 5,
                pointHoverRadius: 5,
                pointHoverBackgroundColor: "rgba(75,192,192,1)",
                pointHoverBorderColor: "rgba(220,220,220,1)",
                pointHoverBorderWidth: 2,
                pointRadius: 1,
                pointHitRadius: 10                                    
            };

            var datasets = [];

            repos.forEach(function(repo, index){

                var position = index + 1;

                var dataset = {
                    label: repo,
                    data: [position, position, position, position, position, position, position]
                };

                dataset = $.extend({}, dataset, dataSetConfig);
                datasets.push(dataset);
            })

            return datasets;

        })();

        var config = {
            type: 'line',
            data: {
                labels: ["January", "February", "March", "April", "May", "June", "July"],
                datasets: data
            },
            options: {
                responsive: true,
                legend: {
                    position: 'right',
                },
                hover: {
                    mode: 'label'
                },
                scales: {
                    xAxes: [{
                        display: false,
                        scaleLabel: {
                            display: true,
                            labelString: 'Day'
                        }
                    }],
                    yAxes: [{
                        display: false,
                        scaleLabel: {
                            display: false,
                            labelString: 'Position'
                        },
                        ticks: {
                            suggestedMin: -1,
                            suggestedMax: 26,
                        }

                    }]
                },
                title: {
                    display: false,
                    text: 'Chart.js Line Chart - Legend'
                }
            }
        };

        var ready = function() {
            $gitChart = $('.gitChart canvas');

            if(undefined === $gitChart.get(0)){
                return;
            }

            var ctx = $gitChart.get(0).getContext('2d');

            gitChart = new Chart(ctx, config);

        };

        $(document).ready(ready);
    }());

})(jQuery);
