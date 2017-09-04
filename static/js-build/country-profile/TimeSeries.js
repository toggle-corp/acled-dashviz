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
            var _this2 = this;

            $("#time-series svg").remove();

            this.parseTime = d3.timeParse("%Y-%m");
            this.svg = d3.select("#time-series").append('svg');

            this.width = $('#time-series svg').width();
            this.height = $('#time-series svg').height();

            this.margin = { top: 8, right: 16, bottom: 64, left: 56 };

            this.scaleX = d3.scaleTime().range([0, this.width - this.margin.left - this.margin.right]);
            this.scaleY = d3.scaleLinear().range([this.height - this.margin.top - this.margin.bottom, 0]);

            this.canvas = this.svg.append('g').attr('transform', 'translate(' + this.margin.left + ',' + this.margin.top + ')');

            var that = this;

            this.lineFunction = d3.line().curve(d3.curveMonotoneX).x(function (d) {
                return _this2.scaleX(_this2.parseTime(d.key));
            }).y(function (d) {
                return that.scaleY(d.value);
            });

            this.tip = d3.select("body").append("div").attr("class", "tooltip tooltip-large").style("display", 'none');
        }
    }, {
        key: 'showTooltip',
        value: function showTooltip() {
            this.tip.style("display", null);
            this.tipLine.attr("stroke", "black");
        }
    }, {
        key: 'updateTooltip',
        value: function updateTooltip() {
            var date = this.scaleX.invert(d3.mouse(this.tipBox.node())[0]);
            var ym = d3.timeFormat('%Y-%m')(date);

            var tipData = this.filteredData.map(function (e) {
                return {
                    key: e.key,
                    value: (e.values.filter(function (d) {
                        return d.key === ym;
                    })[0] || { value: 0 }).value
                };
            });
            var eventHtml = '';

            tipData.forEach(function (e) {
                eventHtml += '<div><span class="number">' + e.value + '</span><span class="event">' + e.key.capitalize() + '</span></div>';
            });

            this.tip.html('\n            <div>\n                <div>' + d3.timeFormat('%B, %Y')(date) + '</div>\n                <hr>\n                <div>' + eventHtml + '</div>\n            </div>\n        ');
            this.tip.style("left", d3.event.pageX + 24 + "px").style("top", d3.event.pageY - 24 + "px");

            this.tipLine.attr("x1", this.scaleX(date)).attr("x2", this.scaleX(date));
        }
    }, {
        key: 'hideTooltip',
        value: function hideTooltip() {
            this.tip.style("display", "none");
            this.tipLine.attr('stroke', 'none');
        }
    }, {
        key: 'render',
        value: function render(data) {
            var _this3 = this;

            var that = this;

            this.filteredData = d3.nest().key(function (d) {
                return d.event_type;
            }).key(function (d) {
                return d.event_date.substring(0, d.event_date.length - 3);
            }).sortKeys(d3.ascending).rollup(function (v) {
                return v.length;
            }).entries(data);

            this.scaleX.domain([that.parseTime(d3.min(this.filteredData, function (e) {
                return d3.min(e.values, function (d) {
                    return d.key;
                });
            })), that.parseTime(d3.max(this.filteredData, function (e) {
                return d3.max(e.values, function (d) {
                    return d.key;
                });
            }))]);
            this.scaleY.domain([0, d3.max(this.filteredData, function (e) {
                return d3.max(e.values, function (d) {
                    return d.value;
                });
            })]);

            this.canvas.selectAll('*').remove();

            this.tipLine = this.canvas.append('line');
            this.tipLine.attr('stroke', 'none').style("stroke-dasharray", "3, 3").attr('y1', 0).attr('y2', this.height - this.margin.bottom - this.margin.top);

            var eventType = this.canvas.selectAll('.event').data(this.filteredData).enter().append('g').attr('class', 'event');

            eventType.append('path').attr('fill', 'none').attr('stroke', function (e) {
                return getEventColor(e.key);
            }).attr('stroke-width', 2).attr('d', function (e) {
                return _this3.lineFunction(e.values);
            }).attr('stroke-dasharray', function () {
                return this.getTotalLength();
            }).attr('stroke-dashoffset', function () {
                return this.getTotalLength();
            }).transition().delay(function (e, i) {
                return i * 200 + 100;
            }).duration(500).attr('stroke-dashoffset', 0);

            this.tipBox = this.canvas.append('rect').attr('width', this.width - this.margin.right - this.margin.left).attr('height', this.height - this.margin.top - this.margin.bottom).attr('opacity', 0).style('cursor', 'crosshair').on('mouseenter', function () {
                _this3.showTooltip();
            }).on('mousemove', function () {
                _this3.updateTooltip();
            }).on('mouseleave', function () {
                _this3.hideTooltip();
            });

            /*
            eventType.selectAll('circle')
                .data((e, i) => e.data.map(d => ({ color: e.color, year: d.year, count: d.count, index: i })))
                .enter()
                .append('circle')
                .attr('fill', d => d.color)
                .attr('r', 0)
                .attr('cx', d => this.scaleX(d.year))
                .attr('cy', d => this.scaleY(d.count))
                .on('mouseenter', d => {
                    this.tip.style('display', 'block');
                    this.tip.html('<div><label>Year</label><span>'+new Date(d.year).getFullYear()+'</span></div><div><label>No. of events</label><span>'+d.count+'</span></div>')
                        .style("left", (d3.event.pageX + 10) + "px")		
                        .style("top", (d3.event.pageY - 10) + "px"); 
                })
                .on('mouseleave', d => this.tip.style('display', 'none'))
                .transition().duration(200).delay(d =>
                    (d.index*200) + 500 * this.scaleX(d.year) / this.width
                ).attr('r', 4);
            */

            // Add the X Axis
            this.canvas.append('g').attr('transform', 'translate(0,' + (this.height - this.margin.top - this.margin.bottom) + ')').attr('class', 'x-axis').call(d3.axisBottom(this.scaleX).tickFormat(function (date) {
                if (d3.timeYear(date) < date) {
                    return d3.timeFormat('%b')(date);
                } else {
                    return d3.timeFormat('%Y')(date);
                }
            })).append('text').text('Years').attr('x', this.canvas.node().getBoundingClientRect().width / 2).attr('y', function () {
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