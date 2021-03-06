class MainDashboard extends Element {
    constructor() {
        super('<div id="main-dashboard"></div>');
         
        this.header = new Element(`
            <header>
                <div class="browser-warning">
                    <p>We've noticed that you're using an unsupported browser. The dashboard is best viewed with the latest version of Chrome, Safari or Internet Explorer/Edge.</p>
                    <a class="fa fa-times" id="close-browser-warning"></a>
                </div>
                <div class="filter-btn-container">
                    <button id="apply-filter-main-btn"><i class="fa fa-filter"></i>Click to add filters</button>
                    <div class="filter-info-wrapper"></div>
                </div>
            </header>`
        );
         
        this.leftSection = new Element('<div id="left-section"></div>');
        this.rightSection = new Element('<div id="right-section"></div>');

        this.childElements.push(this.header);
        this.childElements.push(this.leftSection);
        this.childElements.push(this.rightSection);

        this.dashboardMap = new DashboardMap();
        this.leftSection.childElements.push(this.dashboardMap);

        this.graphs = new MainPageGraphs();
        this.leftSection.childElements.push(this.graphs);
         
        this.crisisProfile = new CrisisProfile();
        this.rightSection.childElements.push(this.crisisProfile);
         
        this.filterWrapper = new FilterWrapper('main');
        this.childElements.push(this.filterWrapper);
    }

    process() {
        let that = this;
         
        this.filterWrapper.init();
        this.graphs.init();
         
        this.header.element.find('#apply-filter-main-btn').on('click', function() {
            that.filterWrapper.show();
        });
         
        this.filterWrapper.element.find('.btn-apply-filter').on('click', function(){
            syncCheckboxes(that.filterWrapper.element.find('.filter-event-type .content'), that.dashboardMap.mapLegend.element, true);
            syncCheckboxes(that.filterWrapper.element.find('.filter-event-type .content'), that.graphs.mapLegend.element, true);
            that.applyFilters();
            that.filterWrapper.hide();
        });
         
        this.filterWrapper.element.find('.btn-cancel').on('click', function(){
            that.filterWrapper.hide();
        });
         
        this.filterWrapper.element.find('.btn-reset').on('click', function(){
            that.filterWrapper.init();
        });

        this.dashboardMap.element.on('worldmap:filterclick', function() {
            syncCheckboxes(that.dashboardMap.mapLegend.element, that.filterWrapper.element.find('.filter-event-type .content'));
            syncCheckboxes(that.dashboardMap.mapLegend.element, that.graphs.mapLegend.element, true);
            that.applyFilters();
        });

        this.graphs.element.on('graphs:filterclick', function() {
            syncCheckboxes(that.graphs.mapLegend.element, that.filterWrapper.element.find('.filter-event-type .content'));
            syncCheckboxes(that.graphs.mapLegend.element, that.dashboardMap.mapLegend.element, true);
            that.applyFilters();
        });

    }

    applyFilters() {
        // this.filteredData = $.extend(true, [], this.data);
        this.filteredData = [];
        this.filterByEvents();
        this.filterByInteraction();
        this.filterByYear();
        this.filterByFatalities();

        this.render();
         
        let filterInfoWrapper = this.header.element.find('.filter-info-wrapper');
        filterInfoWrapper.empty();
        jQ3((new FilterInfo(this.filterWrapper.getAppliedFilters())).html).appendTo(filterInfoWrapper);
    }
     
    filterByEvents() {
        let container = this.filterWrapper.element.find('.filter-event-type .content');
        let requiredEvents = container.find('input[type="checkbox"]:checked').map(function() {
            return jQ3(this).data('target');
        }).get();

        for (let i=0; i<requiredEvents.length; i++) {
            this.filteredData = this.filteredData.concat(this.eventGroupedData[requiredEvents[i]]);
        }
    }

    filterByInteraction() {
        let container = this.filterWrapper.element.find('.filter-interaction .content');
        let requiredActors = container.find('input[type="checkbox"]:checked').map(function() {
            return jQ3(this).data('target');
        }).get();
         
        this.filteredData = this.filteredData.filter(x => requiredActors.find(y => x.interaction.includes(y)));
    }

    filterByFatalities() {
        let container = this.filterWrapper.element.find('.filter-fatalities .content');
        let input = container.find('input[type="radio"]:checked');
         
        let lowerLimit = input.data('lowerlimit');
        let upperLimit = input.data('upperlimit');

        this.filteredData = this.filteredData.filter(x => x.fatalities >= lowerLimit && x.fatalities < upperLimit);
    }

    filterByYear() {
        let container = this.filterWrapper.element.find('.filter-year');

        let startYear = container.find('.start-year').val(); 
        startYear = startYear? (new Date(startYear)) : (new Date(0));

        let endYear = container.find('.end-year').val();
        endYear = endYear? (new Date(endYear)) : (new Date());

        function isDateYearInRange(d, d1, d2) {
            return d >= d1 && d <= d2;
        }

        this.filteredData = this.filteredData.filter(x => {
            return isDateYearInRange((new Date(x.event_date)), startYear, endYear);
        });
    }    
     
    render() {
        let mapData = d3.nest()
            .key((d) => d.latitude + ' ' + d.longitude)
            .key((d) => d.event_type )
            .object(this.filteredData);
         
        setTimeout(() => this.dashboardMap.refreshMap(mapData), 0);
        setTimeout(() => this.graphs.render(this.filteredData), 0);
    }

    loadData(data) {
        this.data = data;

        this.eventGroupedData = d3.nest()
            .key((d) => d.event_type)
            .object(data);

        this.loadMap(data);
        this.loadCrisisProfile();
    }

    loadMap(data) {
        this.dashboardMap.init();
        this.applyFilters();
    }

    loadCrisisProfile() {
        this.crisisProfile.load();
    }
     
    processRawData(data) {
        this.dashboardMap.processData(data);
    }
}
