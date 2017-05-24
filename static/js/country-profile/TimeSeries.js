class TimeSeries extends Element {
    constructor() {
        super('<div id="time-series-container"></div>');
        this.header = new Element('<header><h4>Events over year</h4></header>')
        this.timeSeries = new Element('<div id="time-series"></div>');

        this.childElements.push(this.header);
        this.childElements.push(this.timeSeries);
    }
    load(country){
        $("#time-series svg").remove();

        let parseTime = d3.timeParse("%Y");
        let svg = d3.select("#time-series").append('svg');

        let width = $('#time-series svg').width();
        let height = $('#time-series svg').height();

        let margin = {top: 24, right: 10, bottom: 48, left: 48};

        let scaleX = d3.scaleTime().range([0, (width - margin.left - margin.right)]);
        let scaleY = d3.scaleLinear().range([(height - margin.top - margin.bottom), 0]);

        let canvas = svg.append('g').attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

        let lineFunction = d3.line()
            .curve(d3.curveLinear)
            .x(function(d) { return scaleX(d.year) })
            .y(function(d) { return scaleY(d.events) });

        $.ajax({
            method: 'GET',
            url: 'https://api.acleddata.com/acled/read',
            data: {'limit': 0, 'country': country, 'fields': 'year|event_type' },
            dataType: 'json',
            crossDomain: true,
            success: function(response) {
                response.data.forEach(function(d){
                    // Ensure proper formatting
                    d.year = parseTime(d.year);
                    d.event_type = d.event_type;
                });
                response.data.sort(function(a, b){ return (a.year < b.year)? -1: (a.year > b.year)? 1: 0; });

                let yearGroupedData = [];
                let riotData = [];
                let otherData = [];
                let currentYear = null;
                let currentData = null;

                for (let i=0; i<response.data.length; i++) {
                    let current = response.data[i];
                    if((new Date(currentYear)).getFullYear() != (new Date(current.year)).getFullYear()){
                        currentYear = current.year;
                        currentData = {'year': current.year, 'events': 0}
                        if (current.event_type.toLowerCase().includes('riot')) {
                            riotData.push(currentData);
                        } else {
                            otherData.push(currentData);
                        }
                        yearGroupedData.push(currentData);
                    }
                    ++currentData.events;
                }

                scaleX.domain(d3.extent(yearGroupedData, function(d) { return d.year; }));
                scaleY.domain([0, d3.max(yearGroupedData, function(d) { return d.events; })]);

                //let circles = canvas.selectAll("circle").data(yearGroupedData).enter().append('circle');
                let riotCircles = canvas.selectAll("circle.riot").data(riotData).enter().append('circle').attr('class', 'riot');
                let otherCircles = canvas.selectAll("circle.other").data(otherData).enter().append('circle').attr('class', 'other');


                let riotCircleAttributes = riotCircles.attr("cx", function (d) { return scaleX(d.year) })
                    .attr("cy", function (d) { return scaleY(d.events) })
                    .attr("r", function (d) { return 5; })
                    .style("fill", function(d) { return '#e67e22'; });

                let otherCircleAttributes = otherCircles.attr("cx", function (d) { return scaleX(d.year) })
                    .attr("cy", function (d) { return scaleY(d.events) })
                    .attr("r", function (d) { return 5; })
                    .style("fill", function(d) { return '#2c3e50'; });

                canvas.append("path")
                    .data([riotData])
                    .attr("class", "riot-line")
                    .attr("d", lineFunction);

                canvas.append("path")
                    .data([otherData])
                    .attr("class", "other-line")
                    .attr("d", lineFunction);

                // Add the X Axis
                canvas.append('g')
                    .attr('transform', 'translate(0,' + (height - margin.top - margin.bottom) + ')')
                    .attr('class', 'x-axis')
                    .call(d3.axisBottom(scaleX));

                // Add the Y Axis
                canvas.append("g")
                    .call(d3.axisLeft(scaleY));

                let legend = svg.append("g");
                legend.attr("class", "legend")
                    .attr("x", 0)
                    .attr("y", 0)
                    .attr("height", 10)
                    .attr("width", width);

                legend.append("rect").attr("x", margin.left).attr("y", 0).attr("width", 10).attr("height", 10).style("fill", '#e67e22');
                legend.append("text").attr("x", margin.left+18).attr("y", 5).attr("dy", ".35em").text("Riots/Protests");

                legend.append("rect").attr("x", (width)/2).attr("y", 0).attr("width", 10).attr("height", 10).style("fill", '#2c3e50');
                legend.append("text").attr("x", (width)/2 + 18).attr("y", 5).attr("dy", ".35em").text("Others");
            }
        });
    }
}
