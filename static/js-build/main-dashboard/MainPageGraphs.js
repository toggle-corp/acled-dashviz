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

        _this.header = new Element('<header><h4>Events over year</h4></header>');
        _this.graph = new Element('<div id="graph"></div>');

        _this.mapLegend = new MapLegend();

        _this.childElements.push(_this.header);
        _this.childElements.push(_this.graph);
        _this.childElements.push(_this.mapLegend);
        return _this;
    }

    _createClass(MainPageGraphs, [{
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

            this.data = d3.nest().key(function (d) {
                return d.event_type;
            }).key(function (d) {
                return d.event_date.split("-")[0];
            }).rollup(function (v) {
                return v.length;
            }).object(data);

            //console.log(this.data);
            var eventType = this.canvas.selectAll('.event').data(this.data).enter().append('g').attr('class', 'event');

            eventType.append('path').attr('fill', 'none').attr('stroke', function (e) {
                return getEventColor(e);
            }).attr('stroke-width', 2).attr('d', function (e) {
                return _this2.lineFunction(e.data);
            }).attr('stroke-dasharray', function () {
                return this.getTotalLength();
            }).attr('stroke-dashoffset', function () {
                return this.getTotalLength();
            }).transition().delay(function (e, i) {
                return i * 200 + 100;
            }).duration(500).attr('stroke-dashoffset', 0);
        }
    }]);

    return MainPageGraphs;
}(Element);
//# sourceMappingURL=MainPageGraphs.js.map