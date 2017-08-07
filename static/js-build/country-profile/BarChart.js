'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var BarChart = function (_Element) {
    _inherits(BarChart, _Element);

    function BarChart() {
        _classCallCheck(this, BarChart);

        var _this = _possibleConstructorReturn(this, (BarChart.__proto__ || Object.getPrototypeOf(BarChart)).call(this, '<div id="bar-chart-container"></div>'));

        _this.header = new Element('<header><h4>Events Involving Main Actors</h4></header>');
        _this.barChart = new Element('<div id="bar-chart"></div>');

        _this.childElements.push(_this.header);
        _this.childElements.push(_this.barChart);
        return _this;
    }

    _createClass(BarChart, [{
        key: 'init',
        value: function init() {
            $("#bar-chart svg").remove();

            this.svg = d3.select("#bar-chart").append('svg');

            this.width = $('#bar-chart svg').width();
            this.height = $('#bar-chart svg').height();

            this.margin = { top: 10, right: 24, bottom: 56, left: 24 };

            this.scaleX = d3.scaleLinear().range([0, this.width - this.margin.left - this.margin.right]);
            this.scaleY = d3.scaleLinear().range([this.height - this.margin.top - this.margin.bottom, 0]);

            // 10 sections, 8px margin
            this.barHeight = (this.height - this.margin.top - this.margin.bottom) / 10 - 8;

            this.canvas = this.svg.append('g').attr('transform', 'translate(' + this.margin.left + ',' + this.margin.top + ')');
        }
    }, {
        key: 'loadData',
        value: function loadData(country) {
            var that = this;

            return $.ajax({
                method: 'GET',
                url: 'https://api.acleddata.com/acled/read',
                data: { 'limit': 0, 'country': country, 'fields': 'actor1|year|event_type|interaction|fatalities' },
                dataType: 'json',
                crossDomain: true,
                success: function success(response) {
                    that.data = response.data;
                    that.data.sort(function (a, b) {
                        return b.actor1.localeCompare(a.actor1);
                    });
                    that.filteredData = that.data.slice();
                }
            });
        }
    }, {
        key: 'applyFilters',
        value: function applyFilters() {
            this.filteredData = this.data.slice();
            this.filterByEvents();
            this.filterByInteraction();
            this.filterByFatalities();
            this.filterByYear();
            this.filterWrapper.element.hide();
            this.render();
        }
    }, {
        key: 'filterByEvents',
        value: function filterByEvents() {
            var container = this.filterWrapper.element.find('.filter-event-type .content');
            var requiredEvents = container.find('input[type="checkbox"]:checked').map(function () {
                return $(this).data('target');
            }).get();

            this.filteredData = this.filteredData.filter(function (x) {
                return requiredEvents.find(function (y) {
                    return compareEvents(x.event_type, y);
                });
            });
        }
    }, {
        key: 'filterByInteraction',
        value: function filterByInteraction() {
            var container = this.filterWrapper.element.find('.filter-interaction .content');
            var lowerLimit = 0;
            var upperLimit = 0;

            switch (container.find('input[type="radio"]:checked').data('value')) {
                case 'less than 100':
                    lowerLimit = 0;
                    upperLimit = 100;
                    break;
                case '100 - 1000':
                    lowerLimit = 100;
                    upperLimit = 1000;
                    break;
                case '1000 - 10000':
                    lowerLimit = 1000;
                    upperLimit = 10000;
                    break;
                case 'more than 10000':
                    lowerLimit = 1000;
                    upperLimit = Infinity;
                    break;
                case 'all':
                    lowerLimit = 0;
                    upperLimit = Infinity;
                    break;
            }

            this.filteredData = this.filteredData.filter(function (x) {
                return x.interaction >= lowerLimit && x.interaction < upperLimit;
            });
        }
    }, {
        key: 'filterByFatalities',
        value: function filterByFatalities() {
            var container = this.filterWrapper.element.find('.filter-fatalities .content');
            var lowerLimit = 0;
            var upperLimit = 0;

            switch (container.find('input[type="radio"]:checked').data('value')) {
                case 'less than 100':
                    lowerLimit = 0;
                    upperLimit = 100;
                    break;
                case '100 - 1000':
                    lowerLimit = 100;
                    upperLimit = 1000;
                    break;
                case '1000 - 10000':
                    lowerLimit = 1000;
                    upperLimit = 10000;
                    break;
                case '10000 - 100000':
                    lowerLimit = 10000;
                    upperLimit = 100000;
                    break;
                case 'more than 10000':
                    lowerLimit = 1000;
                    upperLimit = Infinity;
                    break;
                case 'all':
                    lowerLimit = 0;
                    upperLimit = Infinity;
                    break;
            }

            this.filteredData = this.filteredData.filter(function (x) {
                return x.fatalities >= lowerLimit && x.fatalities < upperLimit;
            });
        }
    }, {
        key: 'filterByYear',
        value: function filterByYear() {
            var container = this.filterWrapper.element.find('.filter-year');

            var startYear = container.find('.start-year').val();
            startYear = startYear ? new Date(startYear) : new Date(0);

            var endYear = container.find('.end-year').val();
            endYear = endYear ? new Date(endYear) : new Date();

            function isDateYearInRange(d, d1, d2) {
                return d.getFullYear() >= d1.getFullYear() && d.getFullYear() <= d2.getFullYear();
            }

            this.filteredData = this.filteredData.filter(function (x) {
                return isDateYearInRange(new Date(x.year), startYear, endYear);
            });
        }
    }, {
        key: 'render',
        value: function render(data) {
            if (data) {
                this.filteredData = data;
            }

            var that = this;

            var actors = [];
            var currentActor = "";
            var currentData = null;

            this.filteredData.sort(function (a, b) {
                return (a.actor1 || '').localeCompare(b.actor1 || '');
            });

            for (var i = 0; i < this.filteredData.length; i++) {
                var cfd = this.filteredData[i].actor1;

                if (currentActor != cfd) {
                    currentActor = cfd;
                    currentData = { 'name': cfd, 'count': 0 };
                    actors.push(currentData);
                }
                ++currentData.count;
            }

            actors.sort(function (a, b) {
                return b.count - a.count;
            });
            actors.splice(Math.min(10, actors.length));

            this.scaleX.domain([0, d3.max(actors, function (d) {
                return d.count;
            })]);

            this.canvas.selectAll("*").remove();
            var bar = this.canvas.selectAll("g").data(actors).enter().append("g").attr("transform", function (d, i) {
                return "translate(0," + i * (that.barHeight + 8) + ")";
            });

            bar.append("rect").attr("height", this.barHeight / 1.5).attr("width", 0).transition().duration(500).delay(function (d, i) {
                return i * 50;
            }).attr("width", function (d) {
                return that.scaleX(d.count);
            });

            bar.append("text").attr("x", 8).attr("y", this.barHeight / 3).attr("dy", ".35em").attr("class", "label").text(function (d) {
                return d.name;
            });

            // Add the X Axis
            this.canvas.append('g').attr('transform', 'translate(0,' + (this.height - this.margin.top - this.margin.bottom) + ')').attr('class', 'x-axis').call(d3.axisBottom(this.scaleX));
        }
    }, {
        key: 'load',
        value: function load(country) {
            var that = this;

            this.init();
        }
    }]);

    return BarChart;
}(Element);
//# sourceMappingURL=BarChart.js.map