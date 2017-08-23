class TimeSeries extends Element {
    constructor() {
        super('<div id="time-series-container"></div>');
        this.header = new Element('<header><h4>Events over year</h4></header>');
        this.timeSeries = new Element('<div id="time-series"></div>');

        this.mapLegend = new MapLegend();

        this.childElements.push(this.header);
        this.childElements.push(this.timeSeries);
        this.childElements.push(this.mapLegend);
    }
     
    process() {
        //this.mapLegend.fillAcledEvents('timeseries');
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

        if(data) {
            this.filteredData = data.map((d) => {
                return Object.assign({}, d, {
                    year: that.parseTime(d.year),
                    event_type: d.event_type || '',
                    interaction: +d.interaction,
                    fatalities: +d.fatalities,
                });
            });

            this.filteredData = this.filteredData.filter(x => x.year);
            
            this.filteredData.sort(function(a, b) { 
                return (new Date(a.year)).getFullYear() - (new Date(b.year)).getFullYear(); 
            });
             
        }
         
        let yearGroupedData = [];
         
         
        let currentYear = 0;
        let currentData = null;

        let acledEventData = {};

        for (let e in acledEvents) {
            acledEventData[e] = this.filteredData.filter(x => x.event_type == e);
        }
         
        let acledYearlyEventCount = [];
        for (let e in acledEventData) {
            let counts = [];
            acledEventData[e].reduce((a, b) => {
                if (!a[b.year]) {
                    a[b.year] = { count: 0, year: b.year };
                    counts.push(a[b.year]);
                }

                a[b.year].count++;
                return a;
            }, {});
            acledYearlyEventCount.push({ event_type: e, data: counts, color: getEventColor(e), });
        }

        this.scaleX.domain([
            d3.min(acledYearlyEventCount, e => d3.min(e.data, d => d.year)),
            d3.max(acledYearlyEventCount, e => d3.max(e.data, d => d.year)),
        ]);
        this.scaleY.domain([0, d3.max(acledYearlyEventCount, e => d3.max(e.data, d => d.count))]);

        this.canvas.selectAll('*').remove();

        const eventType = this.canvas.selectAll('.event')
            .data(acledYearlyEventCount)
            .enter().append('g').attr('class', 'event');

        eventType.append('path')
            .attr('fill', 'none')
            .attr('stroke', e => e.color)
            .attr('stroke-width', 2)
            .attr('d', e => this.lineFunction(e.data))
            .attr('stroke-dasharray', function() { return this.getTotalLength(); })
            .attr('stroke-dashoffset', function() { return this.getTotalLength(); })
            .transition().delay((e, i) => (i*200 + 100)).duration(500).attr('stroke-dashoffset', 0);

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

        // Add the X Axis
        this.canvas.append('g')
            .attr('transform', 'translate(0,' + (this.height - this.margin.top - this.margin.bottom) + ')')
            .attr('class', 'x-axis')
            .call(d3.axisBottom(this.scaleX))
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
            .text('No. of events ')
            .attr('x', 0)
            .attr('y', 0)
            .attr('dy', '1em')
            .attr('fill', '#000')
            .attr('class', 'axis-name');
         
         
    }
     
    load (country){
        let that = this;
        this.init();
    }
}
