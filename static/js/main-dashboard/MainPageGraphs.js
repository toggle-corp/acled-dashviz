class MainPageGraphs extends Element {
    constructor() {
        super('<div id="main-page-graphs-container"></div>');
        this.header = new Element('<header><h4>Events over year</h4></header>');
        this.graph = new Element('<div id="graph"></div>');

        this.mapLegend = new MapLegend();

        this.childElements.push(this.header);
        this.childElements.push(this.graph);
        this.childElements.push(this.mapLegend);
    }

    init() {
        $("#time-series svg").remove();

        this.parseTime = d3.timeParse("%Y");
        this.svg = d3.select("#time-series").append('svg');

        this.width = $('#time-series svg').width();
        this.height = $('#time-series svg').height();

        this.margin = {top: 8, right: 16, bottom: 64, left: 56};

        this.scaleX = d3.scaleTime().range([0, (this.width - this.margin.left - this.margin.right)]);
        this.scaleY = d3.scaleLinear().range([(this.height - this.margin.top - this.margin.bottom), 0]);

        this.canvas = this.svg.append('g').attr('transform', 'translate(' + this.margin.left + ',' + this.margin.top + ')');

        let that = this;

        this.lineFunction = d3.line()
            .curve(d3.curveMonotoneX)
            .x(function(d) { return that.scaleX(d.year); })
            .y(function(d) { return that.scaleY(d.count); });

         this.tip = d3.select("body").append("div")
            .attr("class", "tooltip")
            .style("display", 'none');
    }
     
    render (data) {
        let that = this;

        this.data = d3.nest()
            .key((d) => d.event_type)
            .key((d) => d.event_date.split("-")[0])
            .rollup((v) => v.length)
            .object(data);

        //console.log(this.data);
        const eventType = this.canvas.selectAll('.event')
            .data(this.data)
            .enter().append('g').attr('class', 'event');

        eventType.append('path')
            .attr('fill', 'none')
            .attr('stroke', e => getEventColor(e))
            .attr('stroke-width', 2)
            .attr('d', e => this.lineFunction(e.data))
            .attr('stroke-dasharray', function() { return this.getTotalLength(); })
            .attr('stroke-dashoffset', function() { return this.getTotalLength(); })
            .transition().delay((e, i) => (i*200 + 100)).duration(500).attr('stroke-dashoffset', 0);
         
    }
}
