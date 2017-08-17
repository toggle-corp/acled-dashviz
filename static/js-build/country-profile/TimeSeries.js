'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var TimeSeries = function (_Element) {
    _inherits(TimeSeries, _Element);

    function TimeSeries() {
        _classCallCheck(this, TimeSeries);

        var _this = _possibleConstructorReturn(this, (TimeSeries.__proto__ || Object.getPrototypeOf(TimeSeries)).call(this, '<div id="time-series-container"></div>'));

        _this.header = new Element('<header><h4>Events over year</h4></header>');
        _this.timeSeries = new Element('<div id="time-series"></div>');

        _this.mapLegend = new MapLegend();

        _this.childElements.push(_this.header);
        _this.childElements.push(_this.timeSeries);
        _this.childElements.push(_this.mapLegend);
        return _this;
    }

    _createClass(TimeSeries, [{
        key: 'process',
        value: function process() {
            //this.mapLegend.fillAcledEvents('timeseries');
        }
    }, {
        key: 'init',
        value: function init() {
            $("#time-series svg").remove();

            this.parseTime = d3.timeParse("%Y");
            this.svg = d3.select("#time-series").append('svg');

            this.width = $('#time-series svg').width();
            this.height = $('#time-series svg').height();

            this.margin = { top: 8, right: 16, bottom: 64, left: 56 };

            this.scaleX = d3.scaleTime().range([0, this.width - this.margin.left - this.margin.right]);
            this.scaleY = d3.scaleLinear().range([this.height - this.margin.top - this.margin.bottom, 0]);

            this.canvas = this.svg.append('g').attr('transform', 'translate(' + this.margin.left + ',' + this.margin.top + ')');

            var that = this;

            this.lineFunction = d3.line().curve(d3.curveMonotoneX).x(function (d) {
                return that.scaleX(d.year);
            }).y(function (d) {
                return that.scaleY(d.count);
            });

            this.tip = d3.select("body").append("div").attr("class", "tooltip").style("display", 'none');
        }
    }, {
        key: 'render',
        value: function render(data) {
            var _this2 = this;

            var that = this;

            if (data) {
                this.filteredData = data.map(function (d) {
                    return Object.assign({}, d, {
                        year: that.parseTime(d.year),
                        event_type: d.event_type || '',
                        interaction: +d.interaction,
                        fatalities: +d.fatalities
                    });
                });

                this.filteredData = this.filteredData.filter(function (x) {
                    return x.year;
                });

                this.filteredData.sort(function (a, b) {
                    return new Date(a.year).getFullYear() - new Date(b.year).getFullYear();
                });
            }

            var yearGroupedData = [];

            var currentYear = 0;
            var currentData = null;

            var riotData = this.filteredData.filter(function (x) {
                return x.event_type.toLowerCase().includes('riots');
            });
            var otherData = this.filteredData.filter(function (x) {
                return !x.event_type.toLowerCase().includes('riots');
            });

            var acledEventData = {};

            var _loop = function _loop(e) {
                acledEventData[e] = _this2.filteredData.filter(function (x) {
                    return x.event_type == e;
                });
            };

            for (var e in acledEvents) {
                _loop(e);
            }

            var acledYearlyEventCount = [];

            var _loop2 = function _loop2(e) {
                var counts = [];
                acledEventData[e].reduce(function (a, b) {
                    if (!a[b.year]) {
                        a[b.year] = { count: 0, year: b.year };
                        counts.push(a[b.year]);
                    }

                    a[b.year].count++;
                    return a;
                }, {});
                acledYearlyEventCount.push({ event_type: e, data: counts, color: getEventColor(e) });
            };

            for (var e in acledEventData) {
                _loop2(e);
            }

            this.scaleX.domain([d3.min(acledYearlyEventCount, function (e) {
                return d3.min(e.data, function (d) {
                    return d.year;
                });
            }), d3.max(acledYearlyEventCount, function (e) {
                return d3.max(e.data, function (d) {
                    return d.year;
                });
            })]);
            this.scaleY.domain([0, d3.max(acledYearlyEventCount, function (e) {
                return d3.max(e.data, function (d) {
                    return d.count;
                });
            })]);

            this.canvas.selectAll('*').remove();

            var eventType = this.canvas.selectAll('.event').data(acledYearlyEventCount).enter().append('g').attr('class', 'event');

            eventType.append('path').attr('fill', 'none').attr('stroke', function (e) {
                return e.color;
            }).attr('stroke-width', 2).attr('d', function (e) {
                return _this2.lineFunction(e.data);
            }).attr('stroke-dasharray', function () {
                return this.getTotalLength();
            }).attr('stroke-dashoffset', function () {
                return this.getTotalLength();
            }).transition().delay(function (e, i) {
                return i * 200 + 100;
            }).duration(500).attr('stroke-dashoffset', 0);

            eventType.selectAll('circle').data(function (e, i) {
                return e.data.map(function (d) {
                    return { color: e.color, year: d.year, count: d.count, index: i };
                });
            }).enter().append('circle').attr('fill', function (d) {
                return d.color;
            }).attr('r', 0).attr('cx', function (d) {
                return _this2.scaleX(d.year);
            }).attr('cy', function (d) {
                return _this2.scaleY(d.count);
            }).on('mouseenter', function (d) {
                _this2.tip.style('display', 'block');
                _this2.tip.html('<div><label>Year</label><span>' + new Date(d.year).getFullYear() + '</span></div><div><label>No. of events</label><span>' + d.count + '</span></div>').style("left", d3.event.pageX + 10 + "px").style("top", d3.event.pageY - 10 + "px");
            }).on('mouseleave', function (d) {
                return _this2.tip.style('display', 'none');
            }).transition().duration(200).delay(function (d) {
                return d.index * 200 + 500 * _this2.scaleX(d.year) / _this2.width;
            }).attr('r', 4);

            // Add the X Axis
            this.canvas.append('g').attr('transform', 'translate(0,' + (this.height - this.margin.top - this.margin.bottom) + ')').attr('class', 'x-axis').call(d3.axisBottom(this.scaleX)).append('text').text('Years').attr('x', this.canvas.node().getBoundingClientRect().width / 2).attr('y', function () {
                return (that.margin.bottom + this.getBBox().height) / 2;
            }).attr('dy', '1em').attr('fill', '#000').attr('class', 'axis-name');

            // Add the Y Axis
            this.canvas.append("g").attr('class', 'y-axis').call(d3.axisLeft(this.scaleY)).append('text').attr('transform', 'rotate(-90)').text('No. of events ').attr('x', 0).attr('y', 0).attr('dy', '1em').attr('fill', '#000').attr('class', 'axis-name');
        }
    }, {
        key: 'load',
        value: function load(country) {
            var that = this;
            this.init();
        }
    }]);

    return TimeSeries;
}(Element);
//# sourceMappingURL=TimeSeries.js.map