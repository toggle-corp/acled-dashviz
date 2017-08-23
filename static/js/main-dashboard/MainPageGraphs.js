class MainPageGraphs extends Element {
    constructor() {
        super('<div id="main-page-graphs-container"></div>');
        this.header = new Element(`
            <header>
                <div class="radio-group-container">
                <label class="radio-group active"><input type="radio" name="graph-type-radio" value="event" checked>Events</label>
                    <label class="radio-group"><input type="radio" name="graph-type-radio" value="fatalities">Fatalities</label>
                </div>
            </header>
        `);
        this.graph = new Element('<div id="graph"></div>');

        this.mapLegend = new MapLegend();

        this.childElements.push(this.header);
        this.childElements.push(this.graph);
        this.childElements.push(this.mapLegend);
    }

    process() {
        let that = this;
        this.originalData = [];
        this.graphType = this.header.element.find('input:checked').val();
         
        this.header.element.find('input').on('click', function() {
            $(this).closest('.radio-group-container').find('label.active').removeClass('active');
            $(this).closest('label').addClass('active');
            that.graphType = $(this).val();
            that.render(that.originalData);
        });

    }

    init() {
        $("#graph svg").remove();

        this.parseTime = d3.timeParse("%Y");
        this.svg = d3.select("#graph").append('svg');

        this.width = $('#graph svg').width();
        this.height = $('#graph svg').height();

        this.margin = {top: 16, right: 16, bottom: 64, left: 64};

        this.scaleX = d3.scaleTime().range([0, (this.width - this.margin.left - this.margin.right)]);
        this.scaleY = d3.scaleLinear().range([(this.height - this.margin.top - this.margin.bottom), 0]);

        this.canvas = this.svg.append('g').attr('transform', 'translate(' + this.margin.left + ',' + this.margin.top + ')');

        let that = this;

        this.lineFunction = d3.line()
            .curve(d3.curveMonotoneX)
            .x(function(d) { return that.scaleX(that.parseTime(d.key)); })
            .y(function(d) { return that.scaleY(d.value); });

        this.tip = d3.select("body").append("div")
            .attr("class", "tooltip")
            .style("display", 'none');
         
        this.mapLegend.fillAcledEvents('graphs');
    }
     
    render (data) {
        let that = this;
        this.originalData = data;

        if (this.graphType == 'event') {
            this.data = d3.nest()
                .key((d) => d.event_type)
                .key((d) => d.event_date.split("-")[0])
                .sortKeys(d3.ascending)
                .rollup((v) => ( v.length ))
                .entries(data);
        } else {
            this.data = d3.nest()
                .key((d) => d.event_type)
                .key((d) => d.event_date.split("-")[0])
                .sortKeys(d3.ascending)
                .rollup((v) => d3.sum(v, e => (+e.fatalities)))
                .entries(data);
        }

        this.scaleX.domain([
            that.parseTime(d3.min(this.data, e => d3.min(e.values, d => d.key))),
            that.parseTime(d3.max(this.data, e => d3.max(e.values, d => d.key))),
        ]);
        this.scaleY.domain([0, d3.max(this.data, e => d3.max(e.values, d => d.value))]);
         
         
        this.canvas.selectAll('*').remove();
         
        const eventType = this.canvas.selectAll('.event')
            .data(this.data)
            .enter().append('g').attr('class', 'event');

        eventType.append('path')
            .attr('class', e => 'event-graph-path')
            .attr('fill', 'none')
            .attr('stroke', e => getEventColor(e.key))
            .attr('stroke-width', 2)
            .attr('d', e => this.lineFunction(e.values))
            .attr('stroke-dasharray', function() { return this.getTotalLength(); })
            .attr('stroke-dashoffset', function() { return this.getTotalLength(); })
            /*
            .on('mouseenter', function(d){ 
                d3.selectAll('.event-graph-path').attr('opacity', '0.2');
                d3.select(this).attr('opacity', '1');
            })
            .on('mouseleave', function(d){ 
                d3.selectAll('.event-graph-path').attr('opacity', '1');
            })
            */
            .transition().delay((e, i) => (i*200 + 100)).duration(500).attr('stroke-dashoffset', 0);
         
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

        // Add the X Axis
        this.canvas.append('g')
            .attr('transform', 'translate(0,' + (this.height - this.margin.top - this.margin.bottom) + ')')
            .attr('class', 'x-axis')
            .call(d3.axisBottom(this.scaleX).ticks(d3.timeYear.every(1)))
            .append('text')
            .text('Years')
            .attr('x', (this.canvas.node().getBoundingClientRect().width)/2)
            .attr('y', function() { return (that.margin.bottom + this.getBBox().height)/2; } )
            .attr('dy', '1em')
            .attr('fill', '#000')
            .attr('class', 'axis-name');

        // Add the Y Axis
        this.canvas.append("g")
            .attr('class', 'y-axis')
            .call(d3.axisLeft(this.scaleY))
            .append('text')
            .attr('transform', 'rotate(-90)')
            .text(that.graphType == 'event'? 'No. of events ': 'No. of fatalities')
            .attr('x', 0)
            .attr('y', 0)
            .attr('dy', '1em')
            .attr('fill', '#000')
            .attr('class', 'axis-name');
         
    }
}
