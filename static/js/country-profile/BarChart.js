class BarChart extends Element {
    constructor() {
        super('<div id="bar-chart-container"></div>');

        this.header = new Element('<header><h4>Events Involving Main Actors</h4></header>');
        this.barChart = new Element('<div id="bar-chart"></div>');

        this.childElements.push(this.header);
        this.childElements.push(this.barChart);
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

        this.tip = d3.select("body").append("div")
            .attr("class", "tooltip")
            .style("display", 'none');
    }

    render(data) {
        if(data) {
            this.filteredData = data;
        }

        let that = this;

        let actors = {};
        for (const datum of this.filteredData) {
            const set = new Set([datum.actor1, datum.actor2]);
            for (const obj of set) {
                if (!obj) {
                    continue;
                }
                if (!actors[obj]) {
                    actors[obj] = 0;
                }
                actors[obj] += 1;
            }
        }

        let actorList = [];
        for(let actor in actors) {
            actorList.push({name: actor, count: actors[actor]});
        }

        actorList.sort(function(a, b) { return b.count - a.count; });
        actorList.splice(Math.min(10, actorList.length));

        this.scaleX.domain([0, d3.max(actorList, function(d) { return d.count; })]);

        this.canvas.selectAll("*").remove();
        let bar = this.canvas.selectAll("g")
            .data(actorList)
            .enter()
            .append("g")
            .attr("transform", function(d, i) { return "translate(0," + (i * (that.barHeight + 8)) + ")"; })
            .on('mouseenter', d => {
                this.tip.html(`
                    <div>
                        <p>${d.name}</p>
                        <div>${d.count} events</div>
                    </div>
                `);
                this.tip.style('left', (d3.event.pageX + 10)+'px');
                this.tip.style('top', (d3.event.pageY + 10)+'px');
                this.tip.style('display', 'block');
            })
            .on('mouseleave', d => {
                this.tip.style('display', 'none');
            });

        bar.append("rect")
            .attr("height", this.barHeight / 1.5)
            .attr("width", 0)
            .transition()
            .duration(500)
            .delay((d, i) => i*50)
            .attr("width", function(d) { return that.scaleX(d.count); })

        bar.append("text")
            .attr("x", 8)
            .attr("y", this.barHeight / 3)
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

    }
}
