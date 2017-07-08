class BarChart extends Element {
    constructor() {
        super('<div id="bar-chart-container"></div>');

        this.header = new Element('<header><h4>Top actors</h4><button id="bar-chart-filter"><i class="fa fa-filter"></i></button></header>');
        this.barChart = new Element('<div id="bar-chart"></div>');

        this.childElements.push(this.header);
        this.childElements.push(this.barChart);
    }
    
    process() {
        let that = this;
        this.element.find('#bar-chart-filter').on('click', function(){
            that.render();
        });
    }

    init() {
        $("#bar-chart svg").remove();

        this.svg = d3.select("#bar-chart").append('svg');

        this.width = $('#bar-chart svg').width();
        this.height = $('#bar-chart svg').height();

        this.margin = {top: 10, right: 24, bottom: 56, left: 24};

        this.scaleX = d3.scaleLinear().range([0, (this.width - this.margin.left - this.margin.right)]);
        this.scaleY = d3.scaleLinear().range([(this.height - this.margin.top - this.margin.bottom), 0]);

        // 10 sections, 8px margin
        this.barHeight = ((this.height - this.margin.top - this.margin.bottom) / 10) - 8;

        this.canvas = this.svg.append('g').attr('transform', 'translate(' + this.margin.left + ',' + this.margin.top + ')'); 
    }

    loadData(country){
        let that = this;

        return $.ajax({
            method: 'GET',
            url: 'https://api.acleddata.com/acled/read',
            data: {'limit': 0, 'country': country, 'fields': 'actor1' },
            dataType: 'json',
            crossDomain: true,
            success: function(response) {
                that.data = response.data.map(function(x) {
                    return x.actor1;
                });
                that.data.sort(); 
                that.filteredData = that.data;
            }
        });
    }

    render() {
        let that = this;

        let actors = [];
        let currentActor = "";
        let currentData = null;
        for (let i=0; i<this.filteredData.length; i++) {
            let cfd = this.filteredData[i];
            if (currentActor != cfd) {
                currentActor = cfd;
                currentData = {'name': cfd, 'count': 0};
                actors.push(currentData);
            }
            ++currentData.count;
        }
        actors.sort(function(a, b) { return b.count - a.count; });
        actors.splice(Math.min(10, actors.length));

        this.scaleX.domain([0, d3.max(actors, function(d) { return d.count; })]);

        this.canvas.selectAll("*").remove(); 
        let bar = this.canvas.selectAll("g")
            .data(actors)
            .enter()
            .append("g")
            .attr("transform", function(d, i) { return "translate(0," + (i * (that.barHeight + 8)) + ")"; });

        bar.append("rect")
            .attr("width", function(d) { return that.scaleX(d.count); })
            .attr("height", this.barHeight);

        bar.append("text")
            .attr("x", 2 )
            .attr("y", this.barHeight / 2)
            .attr("dy", ".35em")
            .attr("class", "label")
            .text(function(d) { return d.name; });

        // Add the X Axis
        this.canvas.append('g')
            .attr('transform', 'translate(0,' + (this.height - this.margin.top - this.margin.bottom) + ')')
            .attr('class', 'x-axis')
            .call(d3.axisBottom(this.scaleX));

    }
     
    load(country) {
        let that = this;
         
        this.init();
        this.loadData(country).then(function() {
            that.render();
        });
        return;
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
