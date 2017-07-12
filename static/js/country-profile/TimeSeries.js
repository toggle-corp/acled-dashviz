class TimeSeries extends Element {
    constructor() {
        super('<div id="time-series-container"></div>');
        this.header = new Element('<header><h4>Events over year</h4></header>');
        this.timeSeries = new Element('<div id="time-series"></div>');

        this.childElements.push(this.header);
        this.childElements.push(this.timeSeries);
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
            .curve(d3.curveMonotoneX)
            .x(function(d) { return that.scaleX(d.year); })
            .y(function(d) { return that.scaleY(d.events); });

         this.tip = d3.select("body").append("div")
            .attr("class", "tooltip")
            .style("display", 'none');
    }
     
/*
    loadData(country) {
        let that = this;
         
        return $.ajax({
            method: 'GET',
            url: 'https://api.acleddata.com/acled/read',
            data: {'limit': 0, 'country': country, 'fields': 'year|event_type|interaction|fatalities' },
            dataType: 'json',
            crossDomain: true,
            success: function(response) {
                that.data = response.data;
                that.data.forEach(function(d){
                    // Ensure proper formatting
                    d.year = that.parseTime(d.year);
                    d.event_type = d.event_type;
                    d.interaction = +d.interaction;
                    d.fatalities = +d.fatalities;
                });
                 
                // sort by year 
                that.data.sort(function(a, b){ return (new Date(a.year)).getFullYear() - (new Date(b.year)).getFullYear(); });

                // create copy by value
                that.filteredData = that.data.slice();
            }

        });
    }

    */

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
         
        let riotData = this.filteredData.slice();
        let otherData = this.filteredData.slice();
         
        let currentYear = 0;
        let currentData = null;


        riotData = riotData.filter(x => x.event_type.toLowerCase().includes('riots'));
        otherData = otherData.filter(x => !x.event_type.toLowerCase().includes('riots'));
         
         
        for (let i=0; i<this.filteredData.length; i++) {
            let current = this.filteredData[i];
             
            if((new Date(currentYear)).getFullYear() != (new Date(current.year)).getFullYear()){
                currentYear = current.year;
                currentData = {'year': current.year, 'events': 0};
                 
                yearGroupedData.push(currentData);
            }

            if (currentData) {
                ++currentData.events;
            }
        }

        currentYear = 0;
        currentData = null;
        let yearGroupedRiotData = [];

        for (let i=0; i<riotData.length; i++) {
            let current = riotData[i];
             
            if((new Date(currentYear)).getFullYear() != (new Date(current.year)).getFullYear()){
                currentYear = current.year;
                currentData = {'year': current.year, 'events': 0};
                 
                yearGroupedRiotData.push(currentData);
            }
             
            if (currentData) {
                ++currentData.events;
            }
        }
         
        currentYear = 0;
        currentData = null;
        let yearGroupedOtherData = [];
 
        for (let i=0; i<otherData.length; i++) {
            let current = otherData[i];
             
            if((new Date(currentYear)).getFullYear() != (new Date(current.year)).getFullYear()){
                currentYear = current.year;
                currentData = {'year': current.year, 'events': 0};
                 
                yearGroupedOtherData.push(currentData);
            }
               
           if (currentData) { 
               ++currentData.events;
           }
        }

        this.scaleX.domain(d3.extent(yearGroupedData, function(d) { return d.year; }));
        this.scaleY.domain([0, d3.max(yearGroupedData, function(d) { return d.events; })]);

        this.canvas.selectAll("*").remove(); 
        this.canvas.append("path")
            .data([yearGroupedRiotData])
            .attr("class", "riot-line")
            .attr("d", this.lineFunction)
            .attr("stroke-dasharray", function(){ return this.getTotalLength(); }) 
            .attr("stroke-dashoffset", function(){ return this.getTotalLength(); })
            .transition()
            .duration(500)
            .attr("stroke-dashoffset", 0);

        this.canvas.append("path")
            .data([yearGroupedOtherData])
            .attr("class", "other-line")
            .attr("d", this.lineFunction)
            .attr("stroke-dasharray", function(){ return this.getTotalLength(); }) 
            .attr("stroke-dashoffset", function(){ return this.getTotalLength(); })
            .transition()
            .delay(200)
            .duration(500)
            .attr("stroke-dashoffset", 0);


        let riotCircles = this.canvas.selectAll("circle.riot").data(yearGroupedRiotData).enter().append('circle').attr('class', 'riot');
        let otherCircles = this.canvas.selectAll("circle.other").data(yearGroupedOtherData).enter().append('circle').attr('class', 'other');


        let riotCircleAttributes = riotCircles.attr("cx", function (d) { return that.scaleX(d.year); })
            .attr("cy", function (d) { return that.scaleY(d.events); })
            .style("fill", function(d) { return '#e67e22'; })
            .attr("r", 0)
            .transition()
            .duration(500)
            .delay((d, i) => 500.0*that.scaleX(d.year)/that.width)
            .attr("r", function (d) { return 4; });

 

        let otherCircleAttributes = otherCircles.attr("cx", function (d) { return that.scaleX(d.year); })
            .style("fill", function(d) { return '#2c3e50'; })
            .attr("cy", function (d) { return that.scaleY(d.events); })
            .attr("r", 0)
            .transition()
            .duration(500)
            .delay((d, i) => 500.0*that.scaleX(d.year)/that.width)
            .attr("r", function (d) { return 4; });


        riotCircles.on('mouseenter', function(d) {
            that.tip.style('display', 'block');
            that.tip.html('<div><label>Year</label><span>'+new Date(d.year).getFullYear()+'</span></div><div><label>No. of events</label><span>'+d.events+'</span></div>')
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
     
    load (country){
        let that = this;
        this.init();
    }
}
