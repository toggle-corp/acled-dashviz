class CountryProfile extends Element {
    constructor() {
        super('<div id="country-profile"></div>');
        this.scrollWrapper = new Element('<div class="scroll-wrapper"></div>');
        this.childElements.push(this.scrollWrapper);

        this.header = new Element(`
            <header>
                <h3>
                    <a id="back-btn" class="fa fa-arrow-left"></a>
                    <span id="country-name">country_name</span>
                </h3>
                <div class="filter-btn-container">
                    <button id="filter-btn">
                        <i class="fa fa-filter"></i><span>Click to add filters</span>
                    </button>
                    <div class="filter-info-wrapper"></div>
                </div>
            </header>
        `);
        this.scrollWrapper.childElements.push(this.header);

        this.countryMap = new CountryMap();
        this.scrollWrapper.childElements.push(this.countryMap);

        this.countryReport = new CountryReport();
        this.scrollWrapper.childElements.push(this.countryReport);

        this.timeSeries = new TimeSeries();
        this.scrollWrapper.childElements.push(this.timeSeries);

        this.barChart = new BarChart();
        this.scrollWrapper.childElements.push(this.barChart);

        this.timeline = new Timeline();
        this.scrollWrapper.childElements.push(this.timeline);

        let that = this;
        this.header.element.find('a').on('click', function() {
            that.hide();
        });

        this.filterWrapper = new FilterWrapper('country');
        this.childElements.push(this.filterWrapper);
    }

    process() {
        let that = this;
         
        this.element.find('#filter-btn').on('click', function() {
            that.filterWrapper.show();
        });

        this.filterWrapper.element.find('.btn-apply-filter').on('click', function(){
            syncCheckboxes(that.filterWrapper.element.find('.filter-event-type .content'), that.countryMap.mapLegend.element, true);
            syncCheckboxes(that.filterWrapper.element.find('.filter-event-type .content'), that.timeSeries.mapLegend.element, true);
            that.applyFilters();
            that.filterWrapper.hide();
        });
         
        this.filterWrapper.element.find('.btn-cancel').on('click', function(){
            that.filterWrapper.hide();
        });
         
        this.filterWrapper.element.find('.btn-reset').on('click', function(){
            that.filterWrapper.init(that.admin1s);
        });
         
        this.countryMap.element.on('countrymap:filterclick', function() {
            syncCheckboxes(that.countryMap.mapLegend.element, that.filterWrapper.element.find('.filter-event-type .content'));
            syncCheckboxes(that.countryMap.mapLegend.element, that.timeSeries.mapLegend.element, true);
            that.applyFilters();
        });
         
        this.timeSeries.element.on('timeseries:filterclick', function() {
            syncCheckboxes(that.timeSeries.mapLegend.element, that.filterWrapper.element.find('.filter-event-type .content'));
            syncCheckboxes(that.timeSeries.mapLegend.element, that.countryMap.mapLegend.element, true);
            that.applyFilters();
        });
    }
     
    applyFilters() {
        this.filteredData = $.extend(true, [], this.data);
         
        this.filterByEvents();
        this.filterByInteraction();
        this.filterByFatalities();
        this.filterByYear();
        this.filterByAdmin1s();
        this.filterWrapper.element.hide();
         
        this.render();

        let filterInfoWrapper = this.header.element.find('.filter-info-wrapper');
        filterInfoWrapper.empty();
        $((new FilterInfo(this.filterWrapper.getAppliedFilters())).html).appendTo(filterInfoWrapper);
    }

    filterByEvents() {
        let container = this.filterWrapper.element.find('.filter-event-type .content');
        let requiredEvents = container.find('input[type="checkbox"]:checked').map(function() {
            return $(this).data('target');
        }).get();

        this.filteredData = this.filteredData.filter(x => requiredEvents.find(y => compareEvents(x.event_type, y)));
    }

    filterByAdmin1s() {
        let container = this.filterWrapper.element.find('.filter-admin1 .selected-admin1s');
        let requiredAdmin1s = container.find('.selected-admin1').map(function() {
            return $(this).find('.name').text();
        }).get();

        if (requiredAdmin1s.length > 0) {
            this.filteredData = this.filteredData.filter(x => requiredAdmin1s.find(y => x.admin1 == y));
        }

    }

    filterByInteraction() {
        let container = this.filterWrapper.element.find('.filter-interaction .content');
        let requiredActors = container.find('input[type="checkbox"]:checked').map(function() {
            return $(this).data('target');
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
        endYear = new Date(endYear.getFullYear(), endYear.getMonth()+1, 0);

        function isDateYearInRange(d, d1, d2) {
            return d >= d1 && d <= d2;
        }

        this.filteredData = this.filteredData.filter(x => {
            return isDateYearInRange((new Date(x.event_date)), startYear, endYear);
        });
    }    

    loadData(country) {
        let deferred = $.Deferred();
        let that = this;
        this.data = [];
        this.filteredData = [];


         
        d3.csv(`https://api.acleddata.com/acled/read.csv?country=${country}&limit=0&fields=actor1|actor2|year|event_date|event_type|interaction|fatalities|latitude|longitude|admin1|country`, function(data) {
            data.forEach((row) => {
                row.event_type = getAcledEventName(row.event_type.toLowerCase());
                row.country = row.country.toLowerCase();
            });
            that.data = data;
            that.data = that.data.filter(x => compareCountryNames(x.country, country));
            that.admin1s = that.data.map(x => x.admin1 || '').sort().filter((item, pos, array) => !pos || item != array[pos - 1]); 

            // remove the empty ones 
            that.admin1s = that.admin1s.filter(x => x);

            that.filteredData = that.data.slice();

            deferred.resolve();
        });


        return deferred.promise();
        /*
        return $.ajax({
            method: 'GET',
            url: 'https://api.acleddata.com/acled/read.csv',
            data: {'limit': 0, 'country': country, 'fields': 'actor1|year|event_type|interaction|fatalities|latitude|longitude|admin1|country' },
            crossDomain: true,
            success: function(data) {
                let rows = data.split('\n');
                let keys = rows[0].split(',');

                // 1st row is list of keys, last is blank
                for (let i=1; i<rows.length-1; i++) {
                    let currentRow = rows[i].split(',');
                    let currentData = {};
                     
                    for (let j=0; j<keys.length; j++) {
                         
                        // such "formatted data", much proccessing, -_- 
                        if(keys[j] == 'event_type') {
                            currentData[keys[j]] = getAcledEventName((currentRow[j] || '').replace(/^"(.*)"$/, '$1').trim().toLowerCase());
                        } else if(keys[j] == 'country') {
                            currentData[keys[j]] = (currentRow[j] || '').replace(/^"(.*)"$/, '$1').trim().toLowerCase();
                        } else if(keys[j] == 'actor1' || keys[j] == 'admin1') {
                            currentData[keys[j]] = (currentRow[j] || '').replace(/^"(.*)"$/, '$1').trim();
                        } else {
                            currentData[keys[j]] = currentRow[j];
                        }
                    } 
                     
                    that.data.push(currentData);
                }

                that.data = that.data.filter(x => compareCountryNames(x.country, country));
                that.admin1s = that.data.map(x => x.admin1 || '').sort().filter((item, pos, array) => !pos || item != array[pos - 1]); 
                 
                // remove the empty ones 
                that.admin1s = that.admin1s.filter(x => x);
                 
                that.filteredData = that.data.slice();
            }, 
        }); 
        */
    }

    render() {
        this.timeSeries.render(this.filteredData);
        this.barChart.render(this.filteredData);
        this.countryMap.load(this.country, this.filteredData);
    }
     
    show (country, geoJSON) {
        this.country = country;
        $('html').css('overflow', 'hidden');
         
        let that = this;
         
        this.element.fadeIn('fast', function() {
            that.header.element.find('#country-name').text(country);
            that.countryReport.load(country);
            that.timeSeries.load(country);
            that.barChart.load(country);
            that.timeline.load(country);
             
            that.loadData(country).then(function() {
                that.filterWrapper.init(that.admin1s);
                that.render();
                 
                that.countryMap.mapLegend.fillAcledEvents('countrymap');
                that.timeSeries.mapLegend.fillAcledEvents('timeseries');
            });
        });
         
        setTimeout( () => { this.scrollWrapper.element.scrollTop(0); }, 0);
    }
     
    hide() {
        $('html').css('overflow', 'auto');
        this.countryMap.reset(true);
        this.countryMap.mapLegend.clearLegendElements();
        this.timeSeries.mapLegend.clearLegendElements();
        this.element.fadeOut();
    }
}
