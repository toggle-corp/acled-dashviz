class TimeSeries extends Element {
    constructor() {
        super('<div id="time-series-container"></div>');
        this.header = new Element('<header><h4>Events over year</h4><button id="time-series-filter"><i class="fa fa-filter"></i></button></header>');
        this.timeSeries = new Element('<div id="time-series"></div>');

        this.childElements.push(this.header);
        this.childElements.push(this.timeSeries);
    }

    process() {
        let that = this;
        this.element.find('#time-series-filter').on('click', function(){
            that.render();
        });
    }

    init() {
        $("#time-series svg").remove();

        this.parseTime = d3.timeParse("%Y");
        this.svg = d3.select("#time-series").append('svg');

        this.width = $('#time-series svg').width();
        this.height = $('#time-series svg').height();

        this.margin = {top: 24, right: 24, bottom: 56, left: 56};

        this.scaleX = d3.scaleTime().range([0, (this.width - this.margin.left - this.margin.right)]);
        this.scaleY = d3.scaleLinear().range([(this.height - this.margin.top - this.margin.bottom), 0]);

        this.canvas = this.svg.append('g').attr('transform', 'translate(' + this.margin.left + ',' + this.margin.top + ')');

        let that = this;

        this.lineFunction = d3.line()
            .curve(d3.curveLinear)
            .x(function(d) { return that.scaleX(d.year); })
            .y(function(d) { return that.scaleY(d.events); });

         this.tip = d3.select("body").append("div")
            .attr("class", "tooltip")
            .style("display", 'none');
    }

    loadData(country) {
        let that = this;
         
        return $.ajax({
            method: 'GET',
            url: 'https://api.acleddata.com/acled/read',
            data: {'limit': 0, 'country': country, 'fields': 'year|event_type' },
            dataType: 'json',
            crossDomain: true,
            success: function(response) {
                that.data = response.data;
                that.data.forEach(function(d){
                    // Ensure proper formatting
                    d.year = that.parseTime(d.year);
                    d.event_type = d.event_type;
                });
                 
                // sort by year 
                that.data.sort(function(a, b){ return (a.year < b.year)? -1: (a.year > b.year)? 1: 0; });
                that.filteredData = that.data;
            }

        });
    }

    render() {
         
        let yearGroupedData = [];
        let riotData = [];
        let otherData = [];
        let currentYear = null;
        let currentData = null;

        for (let i=0; i<this.filteredData.length; i++) {
            let current = this.filteredData[i];
            if((new Date(currentYear)).getFullYear() != (new Date(current.year)).getFullYear()){
                currentYear = current.year;
                currentData = {'year': current.year, 'events': 0};
                if (current.event_type.toLowerCase().includes('riot')) {
                    riotData.push(currentData);
                } else {
                    otherData.push(currentData);
                }
                yearGroupedData.push(currentData);
            }
            ++currentData.events;
        }

        this.scaleX.domain(d3.extent(yearGroupedData, function(d) { return d.year; }));
        this.scaleY.domain([0, d3.max(yearGroupedData, function(d) { return d.events; })]);

        this.canvas.selectAll("*").remove(); 
        this.canvas.append("path")
            .data([riotData])
            .attr("class", "riot-line")
            .attr("d", this.lineFunction);

        this.canvas.append("path")
            .data([otherData])
            .attr("class", "other-line")
            .attr("d", this.lineFunction);

        let riotCircles = this.canvas.selectAll("circle.riot").data(riotData).enter().append('circle').attr('class', 'riot');
        let otherCircles = this.canvas.selectAll("circle.other").data(otherData).enter().append('circle').attr('class', 'other');


        let that = this;
        let riotCircleAttributes = riotCircles.attr("cx", function (d) { return that.scaleX(d.year); })
            .attr("cy", function (d) { return that.scaleY(d.events); })
            .attr("r", function (d) { return 4; })
            .style("fill", function(d) { return '#e67e22'; });

        let otherCircleAttributes = otherCircles.attr("cx", function (d) { return that.scaleX(d.year); })
            .attr("cy", function (d) { return that.scaleY(d.events); })
            .attr("r", function (d) { return 4; })
            .style("fill", function(d) { return '#2c3e50'; });

        riotCircles.on('mouseenter', function(d) {
            that.tip.style('display', 'block');
            that.tip.html('<div><label>Year</label><span>'+d.year.getFullYear()+'</span></div><div><label>No. of events</label><span>'+d.events+'</span></div>')
                .style("left", (d3.event.pageX + 10) + "px")		
                .style("top", (d3.event.pageY - 10) + "px"); 
        });
        riotCircles.on('mouseleave', function(d) { that.tip.style('display', 'none'); } );

        otherCircles.on('mouseenter', function(d) {
            that.tip.style('display', 'block');
            that.tip.html('<div><label>Year</label><span>'+d.year.getFullYear()+'</span></div><div><label>No. of events</label><span>'+d.events+'</span></div>')
                .style("left", (d3.event.pageX + 10) + "px")		
                .style("top", (d3.event.pageY - 10) + "px"); 
        });
        otherCircles.on('mouseleave', function(d) { that.tip.style('display', 'none'); } );

        // Add the X Axis
        this.canvas.append('g')
            .attr('transform', 'translate(0,' + (this.height - this.margin.top - this.margin.bottom) + ')')
            .attr('class', 'x-axis')
            .call(d3.axisBottom(this.scaleX));

        // Add the Y Axis
        this.canvas.append("g")
            .attr('class', 'y-axis')
            .call(d3.axisLeft(this.scaleY));


        this.svg.selectAll(".legend").remove();
        let legend = this.svg.append("g");
        legend.attr("class", "legend")
            .attr("x", 0)
            .attr("y", 0)
            .attr("height", 10)
            .attr("width", this.width);

        legend.append("rect").attr("x", this.margin.left).attr("y", 0).attr("width", 10).attr("height", 10).style("fill", '#e67e22');
        legend.append("text").attr("x", this.margin.left+18).attr("y", 5).attr("dy", ".35em").text("Riots/Protests");

        legend.append("rect").attr("x", (this.width)/2).attr("y", 0).attr("width", 10).attr("height", 10).style("fill", '#2c3e50');
        legend.append("text").attr("x", (this.width)/2 + 18).attr("y", 5).attr("dy", ".35em").text("Others"); 
    }
     
    load(country){
        let that = this;
        this.init();
        this.loadData(country).then(function() {
            that.render();
        });
   }
}
