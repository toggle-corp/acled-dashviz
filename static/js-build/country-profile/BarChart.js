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

        _this.header = new Element('<header><h4>Actors by event frequency</h4></header>');
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

            this.margin = { top: 10, right: 24, bottom: 72, left: 24 };

            this.scaleX = d3.scaleLinear().range([0, this.width - this.margin.left - this.margin.right]);
            this.scaleY = d3.scaleLinear().range([this.height - this.margin.top - this.margin.bottom, 0]);

            // 10 sections, 8px margin
            this.barHeight = (this.height - this.margin.top - this.margin.bottom) / 10 - 8;

            this.canvas = this.svg.append('g').attr('transform', 'translate(' + this.margin.left + ',' + this.margin.top + ')');

            this.tip = d3.select("body").append("div").attr("class", "tooltip").style("display", 'none');
        }
    }, {
        key: 'render',
        value: function render(data) {
            var _this2 = this;

            if (data) {
                this.filteredData = data;
            }

            var that = this;

            var actors = {};
            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = this.filteredData[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var datum = _step.value;

                    var set = new Set([datum.actor1, datum.actor2]);
                    var _iteratorNormalCompletion2 = true;
                    var _didIteratorError2 = false;
                    var _iteratorError2 = undefined;

                    try {
                        for (var _iterator2 = set[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                            var obj = _step2.value;

                            if (!obj) {
                                continue;
                            }
                            if (!actors[obj]) {
                                actors[obj] = 0;
                            }
                            actors[obj] += 1;
                        }
                    } catch (err) {
                        _didIteratorError2 = true;
                        _iteratorError2 = err;
                    } finally {
                        try {
                            if (!_iteratorNormalCompletion2 && _iterator2.return) {
                                _iterator2.return();
                            }
                        } finally {
                            if (_didIteratorError2) {
                                throw _iteratorError2;
                            }
                        }
                    }
                }
            } catch (err) {
                _didIteratorError = true;
                _iteratorError = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion && _iterator.return) {
                        _iterator.return();
                    }
                } finally {
                    if (_didIteratorError) {
                        throw _iteratorError;
                    }
                }
            }

            var actorList = [];
            for (var actor in actors) {
                actorList.push({ name: actor, count: actors[actor] });
            }

            actorList.sort(function (a, b) {
                return b.count - a.count;
            });
            actorList.splice(Math.min(10, actorList.length));

            this.scaleX.domain([0, d3.max(actorList, function (d) {
                return d.count;
            })]);

            this.canvas.selectAll("*").remove();
            var bar = this.canvas.selectAll("g").data(actorList).enter().append("g").attr("transform", function (d, i) {
                return "translate(0," + i * (that.barHeight + 8) + ")";
            }).on('mouseenter', function (d) {
                _this2.tip.html('\n                    <div>\n                        <p>' + d.name + '</p>\n                        <div><span class="number">' + d.count + '</span>Events</div>\n                    </div>\n                ');
                _this2.tip.style('left', d3.event.pageX + 10 + 'px');
                _this2.tip.style('top', d3.event.pageY + 10 + 'px');
                _this2.tip.style('display', 'block');
            }).on('mouseleave', function (d) {
                _this2.tip.style('display', 'none');
            });

            bar.append("rect").attr("height", this.barHeight / 1.5).attr("width", 0).transition().duration(500).delay(function (d, i) {
                return i * 50;
            }).attr("width", function (d) {
                return that.scaleX(d.count);
            });

            var getTextPos = function getTextPos(el, eventCount) {
                var tw = el.getComputedTextLength(); // text width
                var bw = that.scaleX(eventCount); // bar width
                var x = bw + 8;

                if (tw + bw > that.width - that.margin.left - that.margin.right) {
                    x -= bw;
                }

                return x;
            };

            bar.append("text").attr("y", this.barHeight / 3).attr("dy", ".35em").attr("class", "label").text(function (d) {
                return d.name;
            }).attr("x", function (d) {
                return getTextPos(this, d.count);
            });

            // Add the X Axis
            this.canvas.append('g').attr('transform', 'translate(0,' + (this.height - this.margin.top - this.margin.bottom) + ')').attr('class', 'x-axis').call(d3.axisBottom(this.scaleX)).append('text').text('No. of distinct events').attr('x', this.canvas.node().getBoundingClientRect().width / 2).attr('y', function () {
                return (that.margin.bottom + this.getBBox().height) / 2;
            }).attr('dy', '1em').attr('fill', '#000').attr('class', 'axis-name');
        }
    }, {
        key: 'load',
        value: function load() {
            this.init();
        }
    }]);

    return BarChart;
}(Element);
//# sourceMappingURL=BarChart.js.map