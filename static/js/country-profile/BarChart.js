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
    }

    loadData(country){
        let that = this;

        return $.ajax({
            method: 'GET',
            url: 'https://api.acleddata.com/acled/read',
            data: {'limit': 0, 'country': country, 'fields': 'actor1|year|event_type|interaction|fatalities' },
            dataType: 'json',
            crossDomain: true,
            success: function(response) {
                that.data = response.data;
                that.data.sort(function(a, b) {
                    return b.actor1.localeCompare(a.actor1);
                });
                that.filteredData = that.data.slice();
            }
        });
    }

    applyFilters() {
        this.filteredData = this.data.slice();
        this.filterByEvents();
        this.filterByInteraction();
        this.filterByFatalities();
        this.filterByYear();
        this.filterWrapper.element.hide();
        this.render();
    }

    filterByEvents() {
        let container = this.filterWrapper.element.find('.filter-event-type .content');
        let requiredEvents = container.find('input[type="checkbox"]:checked').map(function() {
            return $(this).data('target');
        }).get();

        this.filteredData = this.filteredData.filter(x => requiredEvents.find(y => compareEvents(x.event_type, y)));
    }

    filterByInteraction() {
        let container = this.filterWrapper.element.find('.filter-interaction .content');
        let lowerLimit = 0;
        let upperLimit = 0;

        switch(container.find('input[type="radio"]:checked').data('value')) {
            case 'less than 100':
                lowerLimit = 0;
                upperLimit = 100;
                break;
            case '100 - 1000':
                lowerLimit = 100;
                upperLimit = 1000;
                break;
            case '1000 - 10000':
                lowerLimit = 1000;
                upperLimit = 10000;
                break;
            case 'more than 10000':
                lowerLimit = 1000;
                upperLimit = Infinity;
                break;
            case 'all':
                lowerLimit = 0;
                upperLimit = Infinity;
                break;
        }

        this.filteredData = this.filteredData.filter(x => x.interaction >= lowerLimit && x.interaction < upperLimit);

    }

    filterByFatalities() {
        let container = this.filterWrapper.element.find('.filter-fatalities .content');
        let lowerLimit = 0;
        let upperLimit = 0;

        switch(container.find('input[type="radio"]:checked').data('value')) {
            case 'less than 100':
                lowerLimit = 0;
                upperLimit = 100;
                break;
            case '100 - 1000':
                lowerLimit = 100;
                upperLimit = 1000;
                break;
            case '1000 - 10000':
                lowerLimit = 1000;
                upperLimit = 10000;
                break;
            case '10000 - 100000':
                lowerLimit = 10000;
                upperLimit = 100000;
                break;
            case 'more than 10000':
                lowerLimit = 1000;
                upperLimit = Infinity;
                break;
            case 'all':
                lowerLimit = 0;
                upperLimit = Infinity;
                break;
        }

        this.filteredData = this.filteredData.filter(x => x.fatalities >= lowerLimit && x.fatalities < upperLimit);

    }

    filterByYear() {
        let container = this.filterWrapper.element.find('.filter-year');

        let startYear = container.find('.start-year').val();
        startYear = startYear? (new Date(startYear)) : (new Date(0));

        let endYear = container.find('.end-year').val();
        endYear = endYear? (new Date(endYear)) : (new Date());

        function isDateYearInRange(d, d1, d2) {
            return d.getFullYear() >= d1.getFullYear() && d.getFullYear() <= d2.getFullYear();
        }

        this.filteredData = this.filteredData.filter(x => {
            return isDateYearInRange((new Date(x.year)), startYear, endYear);
        });

    }
    render(data) {
        if(data) {
            this.filteredData = data;
        }

        let that = this;

        let actors = [];
        let currentActor = "";
        let currentData = null;

        this.filteredData.sort((a, b) => (a.actor1||'').localeCompare((b.actor1) || ''));

        for (let i=0; i<this.filteredData.length; i++) {
            let cfd = this.filteredData[i].actor1;

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
            .attr("height", this.barHeight / 1.5)
            .attr("width", 0)
            .transition()
            .duration(500)
            .delay((d, i) => i*50)
            .attr("width", function(d) { return that.scaleX(d.count); });

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
