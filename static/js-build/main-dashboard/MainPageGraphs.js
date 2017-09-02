'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var MainPageGraphs = function (_Element) {
    _inherits(MainPageGraphs, _Element);

    function MainPageGraphs() {
        _classCallCheck(this, MainPageGraphs);

        var _this = _possibleConstructorReturn(this, (MainPageGraphs.__proto__ || Object.getPrototypeOf(MainPageGraphs)).call(this, '<div id="main-page-graphs-container"></div>'));

        _this.header = new Element('\n            <header>\n                <div class="radio-group-container">\n                <label class="radio-group active"><input type="radio" name="graph-type-radio" value="event" checked>Events</label>\n                    <label class="radio-group"><input type="radio" name="graph-type-radio" value="fatalities">Fatalities</label>\n                </div>\n            </header>\n        ');
        _this.graph = new Element('<div id="graph"></div>');

        _this.mapLegend = new MapLegend();

        _this.childElements.push(_this.header);
        _this.childElements.push(_this.graph);
        _this.childElements.push(_this.mapLegend);
        return _this;
    }

    _createClass(MainPageGraphs, [{
        key: 'process',
        value: function process() {
            var that = this;
            this.originalData = [];
            this.graphType = this.header.element.find('input:checked').val();

            this.header.element.find('input').on('click', function () {
                $(this).closest('.radio-group-container').find('label.active').removeClass('active');
                $(this).closest('label').addClass('active');
                that.graphType = $(this).val();
                that.render(that.originalData);
            });
        }
    }, {
        key: 'init',
        value: function init() {
            $("#graph svg").remove();

            this.parseTime = d3.timeParse("%Y-%m");
            this.svg = d3.select("#graph").append('svg');

            this.width = $('#graph svg').width();
            this.height = $('#graph svg').height();

            this.margin = { top: 16, right: 16, bottom: 64, left: 64 };

            this.scaleX = d3.scaleTime().range([0, this.width - this.margin.left - this.margin.right]);
            this.scaleY = d3.scaleLinear().range([this.height - this.margin.top - this.margin.bottom, 0]);

            this.canvas = this.svg.append('g').attr('transform', 'translate(' + this.margin.left + ',' + this.margin.top + ')');

            var that = this;

            this.lineFunction = d3.line().curve(d3.curveMonotoneX).x(function (d) {
                return that.scaleX(that.parseTime(d.key));
            }).y(function (d) {
                return that.scaleY(d.value);
            });

            this.tip = d3.select("body").append("div").attr("class", "tooltip tooltip-large").style("display", 'none');

            this.mapLegend.fillAcledEvents('graphs');
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

            var tipData = this.data.map(function (e) {
                return {
                    key: e.key,
                    value: e.values.filter(function (d) {
                        return d.key === ym;
                    })[0].value
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
            var _this2 = this;

            var that = this;
            this.originalData = data;

            if (this.graphType == 'event') {
                this.data = d3.nest().key(function (d) {
                    return d.event_type;
                }).key(function (d) {
                    return d.event_date.substring(0, d.event_date.length - 3);
                }).sortKeys(d3.ascending).rollup(function (v) {
                    return v.length;
                }).entries(data);
            } else {
                this.data = d3.nest().key(function (d) {
                    return d.event_type;
                }).key(function (d) {
                    return d.event_date.substring(0, d.event_date.length - 3);
                }).sortKeys(d3.ascending).rollup(function (v) {
                    return d3.sum(v, function (e) {
                        return +e.fatalities;
                    });
                }).entries(data);
            }

            this.scaleX.domain([that.parseTime(d3.min(this.data, function (e) {
                return d3.min(e.values, function (d) {
                    return d.key;
                });
            })), that.parseTime(d3.max(this.data, function (e) {
                return d3.max(e.values, function (d) {
                    return d.key;
                });
            }))]);
            this.scaleY.domain([0, d3.max(this.data, function (e) {
                return d3.max(e.values, function (d) {
                    return d.value;
                });
            })]);

            this.canvas.selectAll('*').remove();

            this.tipLine = this.canvas.append('line');
            this.tipLine.attr('stroke', 'none').style("stroke-dasharray", "3, 3").attr('y1', 0).attr('y2', this.height - this.margin.bottom - this.margin.top);

            var eventType = this.canvas.selectAll('.event').data(this.data).enter().append('g').attr('class', 'event');

            eventType.append('path').attr('class', function (e) {
                return 'event-graph-path';
            }).attr('fill', 'none').attr('stroke', function (e) {
                return getEventColor(e.key);
            }).attr('stroke-width', 2).attr('d', function (e) {
                return _this2.lineFunction(e.values);
            }).attr('stroke-dasharray', function () {
                return this.getTotalLength();
            }).attr('stroke-dashoffset', function () {
                return this.getTotalLength();
            })
            /*
            .on('mouseenter', function(d){ 
                d3.selectAll('.event-graph-path').attr('opacity', '0.2');
                d3.select(this).attr('opacity', '1');
            })
            .on('mouseleave', function(d){ 
                d3.selectAll('.event-graph-path').attr('opacity', '1');
            })
            */
            .transition().delay(function (e, i) {
                return i * 200 + 100;
            }).duration(500).attr('stroke-dashoffset', 0);

            this.tipBox = this.canvas.append('rect').attr('width', this.width - this.margin.right - this.margin.left).attr('height', this.height - this.margin.top - this.margin.bottom).attr('opacity', 0).on('mouseenter', function () {
                _this2.showTooltip();
            }).on('mousemove', function () {
                _this2.updateTooltip();
            }).on('mouseleave', function () {
                _this2.hideTooltip();
            });

            /*
            eventType.selectAll('circle')
                .data((e, i) => e.values.map(d => ({ color: getEventColor(e.key), year: d.key, count: d.value, index: i })))
                .enter()
                .append('circle')
                .attr('fill', d => d.color)
                .attr('r', 0)
                .attr('cx', d => that.scaleX(that.parseTime(d.year)) )
                .attr('cy', d => that.scaleY(d.count))
                .on('mouseenter', d => {
                    this.tip.style('display', 'block');
                    if (that.graphType == 'event') {
                        this.tip.html('<div><label>Year</label><span>'+d.year+'</span></div><div><label>No. of events</label><span>'+d.count+'</span></div>')
                            .style("left", (d3.event.pageX + 10) + "px")		
                            .style("top", (d3.event.pageY - 10) + "px"); 
                    } else {
                        this.tip.html('<div><label>Year</label><span>'+d.year+'</span></div><div><label>No. of fatalities</label><span>'+d.count+'</span></div>')
                            .style("left", (d3.event.pageX + 10) + "px")		
                            .style("top", (d3.event.pageY - 10) + "px"); 
                    }
                })
                .on('mouseleave', d => this.tip.style('display', 'none'))
                .transition().duration(200).delay(d =>
                    (d.index*200) + 500 * this.scaleX(d.year) / this.width
                ).attr('r', 4);
            */

            // Add the X Axis
            this.canvas.append('g').attr('transform', 'translate(0,' + (this.height - this.margin.top - this.margin.bottom) + ')').attr('class', 'x-axis').call(d3.axisBottom(this.scaleX).tickFormat(function (date) {
                if (d3.timeYear(date) < date) {
                    if (d3.timeMonth(date) < date) {
                        return d3.timeFormat('%b-%d')(date);
                    } else {
                        return d3.timeFormat('%b')(date);
                    }
                } else {
                    return d3.timeFormat('%Y')(date);
                }
            })).append('text').text('Years').attr('x', this.canvas.node().getBoundingClientRect().width / 2).attr('y', function () {
                return (that.margin.bottom + this.getBBox().height) / 2;
            }).attr('dy', '1em').attr('fill', '#000').attr('class', 'axis-name');

            // Add the Y Axis
            this.canvas.append("g").attr('class', 'y-axis').call(d3.axisLeft(this.scaleY)).append('text').attr('transform', 'rotate(-90)').text(that.graphType == 'event' ? 'No. of events ' : 'No. of fatalities').attr('x', 0).attr('y', 0).attr('dy', '1em').attr('fill', '#000').attr('class', 'axis-name');
        }
    }]);

    return MainPageGraphs;
}(Element);
//# sourceMappingURL=MainPageGraphs.js.map