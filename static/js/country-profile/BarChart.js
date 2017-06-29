class BarChart extends Element {
    constructor() {
        super('<div id="bar-chart-container"></div>');

        this.header = new Element('<header><h4>Top actors</h4></header>');
        this.barChart = new Element('<div id="bar-chart"></div>');

        this.childElements.push(this.header);
        this.childElements.push(this.barChart);
    }
     
    load(country) {
        $("#bar-chart svg").remove();

        let svg = d3.select("#bar-chart").append('svg');

        let width = $('#bar-chart svg').width();
        let height = $('#bar-chart svg').height();

        let margin = {top: 10, right: 10, bottom: 48, left: 10};

        let scaleX = d3.scaleLinear().range([0, (width - margin.left - margin.right)]);
        let scaleY = d3.scaleLinear().range([(height - margin.top - margin.bottom), 0]);

        // 10 sections, 8px margin
        let barHeight = ((height - margin.top - margin.bottom) / 10) - 8;

        let canvas = svg.append('g').attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

        $.ajax({
            method: 'GET',
            url: 'https://api.acleddata.com/acled/read',
            data: {'limit': 0, 'country': country, 'fields': 'actor1' },
            dataType: 'json',
            crossDomain: true,
            success: function(response) {
                let data = response.data.map(function(x) {
                    return x.actor1;
                });
                data.sort();
                let actors = [];
                let currentActor = "";
                let currentData = null;
                for (let i=0; i<data.length; i++) {
                    if (currentActor != data[i]) {
                        currentActor = data[i];
                        currentData = {'name': data[i], 'count': 0};
                        actors.push(currentData);
                    }
                    ++currentData.count;
                }
                actors.sort(function(a, b) { return b.count - a.count; });
                actors.splice(Math.min(10, actors.length));

                scaleX.domain([0, d3.max(actors, function(d) { return d.count; })]);


                let bar = canvas.selectAll("g")
                    .data(actors)
                    .enter()
                    .append("g")
                    .attr("transform", function(d, i) { return "translate(0," + (i * (barHeight + 8)) + ")"; });

                bar.append("rect")
                    .attr("width", function(d) { return scaleX(d.count); })
                    .attr("height", barHeight);

                bar.append("text")
                    .attr("x", 2 )
                    .attr("y", barHeight / 2)
                    .attr("dy", ".35em")
                    .attr("class", "label")
                    .text(function(d) { return d.name; });

                // Add the X Axis
                canvas.append('g')
                    .attr('transform', 'translate(0,' + (height - margin.top - margin.bottom) + ')')
                    .attr('class', 'x-axis')
                    .call(d3.axisBottom(scaleX));
            }
        });

    }
}
