let acledData = [];
let dashboard = null
// let acledColors = ['#16a085', '#27ae60', '#2980b9', '#8e44ad', '#2c3e50', '#f39c12', '#d35400', '#c0392b', '#7f8c8d', '#bdc3c7'];

let acledEvents = {};
function addEvent(eventName) {
    eventName = eventName.includes('battle')? 'battle' : eventName;
    if (!acledEvents[eventName]) {
        acledEvents[eventName] = 0;
    }
    ++acledEvents[eventName];
}

let totalFatalities = 0;
function addFatalities(fatalities) {
    totalFatalities += (fatalities >> 0);
}

eventColors = {
    'battle': '#e74c3c',
    'headquarters or base established': '#008080',
    'non-violent transfer of territory': '#27ae60',
    'remote violence': '#2c3e50',
    'riots/protests': '#e67e22',
    'strategic development': '#2980b9',
    'violence against civilians': '#8e44ad',

};

function getEventColor(eventName) {
    if(eventName.includes('battle')) {
        return eventColors['battle'];
    }
    return eventColors[eventName];
}

function compareCountryNames(name1, name2) {
    name1 = name1.toLowerCase().replace(/\b((the)|(a)|(an)|(of))\b/g, '').replace(/\s\s+/g, ' ');
    name2 = name2.toLowerCase().replace(/\b((the)|(a)|(an)|(of))\b/g, '').replace(/\s\s+/g, ' ');
    return (name1 == name2);
}

class Element {
    constructor(element=null) {
        this.childElements = [];
        this.element = $(element);
    }
    initDom(parent) {
        if(this.element && parent && parent.element ){
            this.element.appendTo(parent.element);
        }
    }
    initDomAll(parent) {
        if(this.element == null) {
            return;
        }
        this.initDom(parent);

        for (let i=0; i<this.childElements.length; i++) {
            this.childElements[i].initDomAll(this);
        }
    }
    process(){}
    processAll(){
        this.process();

        for (let i=0; i<this.childElements.length; i++) {
            this.childElements[i].processAll();
        }
    }
    render(){}
}

class MapLegend extends Element {
    constructor() {
        super('<div class="legend"></div>');
        this.element.append('<header><h4></h4></header><div class="legend-elements"></div>');
        this.legendElementTemplate = $('<div class="legend-element"><div class="color-box"></div><label></label></div>')
    }
    setTitle(title){
        this.element.find('h4').text(title);
    }
    addLegendElement(color, label){
        let legendElementsContainer = this.element.find('.legend-elements');
        let legendElement = this.legendElementTemplate.clone();
        legendElement.find('.color-box').css('background-color', color)
        legendElement.find('label').text(label)
        legendElement.appendTo(legendElementsContainer);
    }
}

class DashboardMap extends Element {
    constructor() {
        super('<div class="map-container"></div>');
        this.mapElement = new Element('<div id="world-map"></div>');
        this.mapLegend = new MapLegend();
        this.childElements.push(this.mapElement);
        this.childElements.push(this.mapLegend);
    }
    process() {
        this.mapLegend.setTitle('Event types');

        L.mapbox.accessToken = 'pk.eyJ1IjoiZnJvemVuaGVsaXVtIiwiYSI6ImNqMWxvNDIzNDAwMGgzM2xwczZldWx1MmgifQ.s3yNCS5b1f6DgcTH9di3zw';
        this.map = L.map('world-map', { preferCanvas: true }).setView([0, 10], 3);
        L.tileLayer('https://api.mapbox.com/styles/v1/frozenhelium/cj1lpbp1g000l2rmr9kwg12b3/tiles/256/{z}/{x}/{y}?access_token=' + L.mapbox.accessToken, {
            attribution: '© <a href="https://www.mapbox.com/map-feedback/">Mapbox</a> © <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        }).addTo(this.map);

        // Toggle scroll-zoom by clicking on and outside map
        this.map.scrollWheelZoom.disable();
        this.map.on('focus', function() { this.scrollWheelZoom.enable(); });
        this.map.on('blur', function() { this.scrollWheelZoom.disable(); });
    }
    loadDataToMap() {
        acledData.sort(function(a, b){
            return (a.latitude != b.latitude)? a.latitude - b.latitude : ((a.longitude != b.longitude)?  a.longitude - b.longitude : a.event_type - b.event_type);
        });

        let locationGroupedData = [];
        let currentLocation = {'latitude': '', 'longitude': ''};
        let currentData = null;
        let currentEvent = {'name': '', 'count': 0};
        for (let i=0; i<acledData.length; i++) {
            let cr = acledData[i];  // current row
            if(currentLocation.latitude != cr.latitude || currentLocation.longitude != cr.longitude) {
                currentLocation = {'latitude': cr.latitude, 'longitude': cr.longitude};
                currentData = {'location': currentLocation, 'events': []};
                locationGroupedData.push(currentData);

                currentEvent = {'name': cr.event_type, 'count': 0};
                currentData.events.push(currentEvent);
            } else if(currentEvent.name != cr.event_type) {
                currentEvent = {'name': cr.event_type, 'count': 0};
                currentData.events.push(currentEvent);
            }
            ++currentEvent.count;
            addEvent(cr.event_type);
            addFatalities(cr.fatalities);
        }
        for (let event in acledEvents) {
            this.mapLegend.addLegendElement(getEventColor(event), event + ' (' + acledEvents[event] + ')');
        }
        this.refreshMap(locationGroupedData);
    }
    refreshMap(data) {



        // let markerClusters = L.markerClusterGroup({maxClusterRadius: '50'});
        // for (let i=0; i<acledData.length; i++) {
        //     let id = acledData[i].data_id;
        //     let m = L.marker( [acledData[i].latitude, acledData[i].longitude] );
        //     m.bindPopup('Loading...');
        //     m.on('click', function(e){
        //         let popup = e.target.getPopup();
        //         $.ajax({
        //             method: 'GET',
        //             url: 'https://api.acleddata.com/acled/read',
        //             data: {'data_id': id},
        //             success: function(data){
        //                 popup.setContent('<div><label>Event type:</label><span>' + data.data[0].event_type + '</span></div><div><label>Source: </label><span>' + data.data[0].source + '</span></div>');
        //             }
        //         });
        //     });
        //     markerClusters.addLayer(m);
        // }
        //
        // this.map.addLayer(markerClusters);

        //console.log(data);

        for (let i=0; i<data.length; i++) {
            for (let j=0; j<data[i].events.length; j++) {
                let cd = data[i].events[j];   // current data
                let radius = Math.sqrt(cd.count)*24000;
                let color = getEventColor(cd.name);
                L.circle([data[i].location.latitude, data[i].location.longitude], radius, {
                    fillColor: color,
                    stroke: false,
                    fillOpacity: 0.6,
                }).addTo(this.map);
            }
        }


        let geoJsonLayer = null;
        let that = this;
        $.getJSON('https://raw.githubusercontent.com/toggle-corp/world-map/master/countries.geo.json', function(data) {
            geoJsonLayer = L.geoJson(data, {
                onEachFeature: function(feature, layer) {
                    layer.setStyle({
                        fillColor: '#ccc',
                        fillOpacity: 0,
                        stroke: false,
                    });

                    let data = acledData.find(d => compareCountryNames(d.country, feature.properties.admin));
                    if (data) {
                        layer.on('mouseover', function() { layer.setStyle({ fillOpacity: 0.5, }); });
                        layer.on('mouseout', function() { layer.setStyle({ fillOpacity: 0, }); });
                        layer.on('click', function(){
                            dashboard.show(data.country);
                        });
                    }
                },
            });
            geoJsonLayer.addTo(that.map);
        });
    }
}

class KeyFigures extends Element {
    constructor() {
        super('<div id="key-figures-section"></div>');
        this.header = new Element('<header><h5>Key Events</h5></header>');
        this.keyFigureList = new Element('<div id="key-figures"></div>');
        this.childElements.push(this.header);
        this.childElements.push(this.keyFigureList);

        this.keyFigureTemplate = $('<div class="key-figure"><label></label><span class="number"><i class="fa fa-spinner fa-spin fa-fw"></i></span></div>');

    }
    process() {
        let numberOfEvents = this.keyFigureTemplate.clone();
        numberOfEvents.prop('id', 'number-of-events')
        numberOfEvents.find('label').text('Number of events:');
        //numberOfEvents.find('.number').text('0');

        let fatalities = this.keyFigureTemplate.clone();
        fatalities.prop('id', 'total-fatalities');
        fatalities.find('label').text('fatalities:');

        let numberOfCivilianDeaths = this.keyFigureTemplate.clone();
        numberOfCivilianDeaths.prop('id', 'number-of-civilian-deaths')
        numberOfCivilianDeaths.find('label').text('Number of civilian deaths:');

        let numberOfArmedActiveAgents = this.keyFigureTemplate.clone();
        numberOfArmedActiveAgents.prop('id', 'number-of-armed-active-agents');
        numberOfArmedActiveAgents.find('label').text('Number of armed active agents:');

        numberOfEvents.appendTo(this.keyFigureList.element);
        fatalities.appendTo(this.keyFigureList.element);
        numberOfCivilianDeaths.appendTo(this.keyFigureList.element);
        numberOfArmedActiveAgents.appendTo(this.keyFigureList.element);
        //this.keyFigureList.element
    }
}

class CrisisProfile extends Element {
    constructor() {
        super('<div id="crisis-profile-container"></div>');
        $('<header><h4>Crisis profile</h4></header>').appendTo(this.element);
        this.reportSection = new Element('<div id="report-section"></div>');
        this.keyFiguresSection = new KeyFigures();
        this.recentEventsSection = new Element(
            `
            <div id="recent-events-section">
                <header><h5>Recent events</h5></header>
                <a><img alt="Report image"></a>
            </div>
            `
        );

        this.reportSelectContainer = new Element(
            `
            <div class="select-wrapper">
                <i class="fa fa-search"></i>
                <select id="report-search" placeholder="Search for an event"></select>
            </div>
            `
        );

        this.reportDetailContainer = new Element(
            `
            <div id="report">
                <div class="detail">
                    <h5 class="title">Report Title</h5>
                    <date>July 25, 2017</date>
                    <div class="description">Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Lorem ipsum dolor sit amet, consectetur adipisicing elit</div>
                </div>
                <div class="map">
                </div>
            <div>
            `
        );

        this.reportSection.childElements.push(this.reportSelectContainer);
        this.reportSection.childElements.push(this.reportDetailContainer);

        this.childElements.push(this.reportSection);
        this.childElements.push(this.keyFiguresSection);
        this.childElements.push(this.recentEventsSection);

    }

    process() {
        $("#report-search").selectize();
    }
}

class MainDashboard extends Element {
    constructor() {
        super('<div id="main-dashboard"></div>');
        this.leftSection = new Element('<div id="left-section"></div>');
        this.rightSection = new Element('<div id="right-section"></div>');

        this.childElements.push(this.leftSection);
        this.childElements.push(this.rightSection);

        this.dashboardMap = new DashboardMap();
        this.leftSection.childElements.push(this.dashboardMap);
        this.carousel = new Element(
            `
            <div id="carousel-container">
                <button id="carousel-left"><i class="fa fa-chevron-left"></i></button>
                <button id="carousel-right"><i class="fa fa-chevron-right"></i></button>
                <div class="carousel">
                </div>
            </div>
            `
        );
        this.leftSection.childElements.push(this.carousel);
        let imgContainer = this.carousel.element.find('.carousel');
        $('<img class="active" src="'+ pluginDir +'/static/img/chart1.png">').appendTo(imgContainer);
        $('<img src="'+ pluginDir +'/static/img/chart2.png" hidden>').appendTo(imgContainer);
        $('<img src="'+ pluginDir +'/static/img/chart3.png" hidden>').appendTo(imgContainer);

        let leftButton = this.carousel.element.find('#carousel-left');
        let rightButton = this.carousel.element.find('#carousel-right');

        let skipSlide = false;

        rightButton.on('click', function() {
            let parent = $(this).closest('#carousel-container');

            parent.find('img.active').fadeOut(function(){
                $(this).removeClass('active');
                if( $(this).is(parent.find('img').last()) ){
                    parent.find('img').first().fadeIn().addClass('active');
                } else {
                    $(this).next().fadeIn().addClass('active');
                }
            });

            skipSlide = true;
        });

        leftButton.on('click', function() {
            let parent = $(this).closest('#carousel-container');

            parent.find('img.active').fadeOut(function(){
                $(this).removeClass('active');
                if( $(this).is(parent.find('img').first()) ){
                    parent.find('img').last().fadeIn().addClass('active');
                } else {
                    $(this).prev().fadeIn().addClass('active');
                }
            });

            skipSlide = true;
        });

        // set carousel to automatically change in 5sec
        setInterval(function() {
            if(skipSlide) {
                skipSlide = false;
            } else {
                rightButton.click();
            }
        }, 5000);

        this.crisisProfile = new CrisisProfile();
        this.rightSection.childElements.push(this.crisisProfile);
    }
    loadMap() {
        this.dashboardMap.loadDataToMap();
    }
}

class CountryMap extends Element {
    constructor() {
        super('<div id="country-map-container"></div>');
        this.mapElement = new Element('<div id="country-map"></div>');
        // this.mapLegend = new MapLegend();
        this.childElements.push(this.mapElement);
        // this.childElements.push(this.mapLegend);
    }
    process() {
        //this.mapLegend.setTitle('Event types');

        L.mapbox.accessToken = 'pk.eyJ1IjoiZnJvemVuaGVsaXVtIiwiYSI6ImNqMWxvNDIzNDAwMGgzM2xwczZldWx1MmgifQ.s3yNCS5b1f6DgcTH9di3zw';
        this.map = L.map('country-map', { preferCanvas: true }).setView([0, 10], 3);
        L.tileLayer('https://api.mapbox.com/styles/v1/frozenhelium/cj1lpbp1g000l2rmr9kwg12b3/tiles/256/{z}/{x}/{y}?access_token=' + L.mapbox.accessToken, {
            attribution: '© <a href="https://www.mapbox.com/map-feedback/">Mapbox</a> © <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        }).addTo(this.map);

        // Toggle scroll-zoom by clicking on and outside map
        this.map.scrollWheelZoom.disable();
        this.map.on('focus', function() { this.scrollWheelZoom.enable(); });
        this.map.on('blur', function() { this.scrollWheelZoom.disable(); });
    }
    load(country) {
        if(this.geoJsonLayer) {
            this.map.removeLayer(this.geoJsonLayer);
        }
        this.geoJsonLayer = null;
        let that = this;
        let currentLayer = null;
        $.getJSON('https://raw.githubusercontent.com/toggle-corp/world-map/master/countries.geo.json', function(data) {
            that.geoJsonLayer = L.geoJson(data, {
                onEachFeature: function(feature, layer) {
                    if (compareCountryNames(country, feature.properties.admin)) {
                        layer.setStyle({
                            fillColor: '#2c3e50',
                            fillOpacity: 0,
                            stroke: true,
                            color: '#2c3e50',
                        });
                        currentLayer = layer;
                    } else {
                        layer.setStyle({
                            fillColor: '#000',
                            fillOpacity: 0,
                            stroke: false,
                        });
                    }
                },
            });
            that.geoJsonLayer.addTo(that.map);
            that.map.invalidateSize();
            that.map.fitBounds(currentLayer.getBounds());
        });
    }
}

class CountryReport extends Element {
    constructor() {
        super('<div id="country-report-container"></div>');

        this.header = new Element('<header><h4>Reports</h4></header>')

        this.childElements.push(this.header);
    }
}

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

        let margin = {top: 16, right: 10, bottom: 48, left: 48};

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
            }
        });
    }
}

class BarChart extends Element {
    constructor() {
        super('<div id="bar-chart-container"></div>')

        this.header = new Element('<header><h4>Top actors</h4></header>')
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
                    ++currentData.count;;
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

class Timeline extends Element {
    constructor() {
        super('<div id="timeline-container"></div>')
    }
}

class CountryProfile extends Element {
    constructor() {
        super('<div id="country-profile"></div>');
        this.header = new Element('<header><h3><a id="back-btn" class="fa fa-arrow-left"></a><span id="country-name">Country_name</span></h3></header>');
        this.childElements.push(this.header);

        this.countryMap = new CountryMap;
        this.childElements.push(this.countryMap);

        this.childElements.push(new CountryReport);

        this.childElements.push(new Timeline);

        this.timeSeries = new TimeSeries;
        this.childElements.push(this.timeSeries);

        this.barChart = new BarChart;
        this.childElements.push(this.barChart);

        let that = this;
        this.header.element.find('a').on('click', function() {
            that.hide();
        });
    }
    show(country) {
        this.element.css('display', 'flex');
        this.header.element.find('#country-name').text(country);
        this.timeSeries.load(country);
        this.barChart.load(country);
        this.countryMap.load(country);
    }
    hide() {
        this.element.css('display', 'none');
    }
}

class Dashboard extends Element {
    constructor() {
        super('<div id="dashboard"></div>');
        this.childElements.push(new MainDashboard);
        this.countryProfile = new CountryProfile;
        this.childElements.push(this.countryProfile);
    }
    loadMainMap() {
        this.childElements[0].loadMap();
    }
    show(country) {
        this.countryProfile.show(country);
    }
}


$(document).ready(function(){
    $('#main').empty();
    let root = new Element();
    root.element = $('#main');
    dashboard = new Dashboard();
    dashboard.initDomAll(root);
    dashboard.processAll();

    $.ajax({
        method: 'GET',
        url: 'https://api.acleddata.com/acled/read.csv',
        data: {'limit': '10000', 'fields': 'country|event_type|latitude|longitude|fatalities'},
        success: function(data){
            let rows = data.split('\n');
            let keys = rows[0].split(',');

            // 1st row is list of keys, last is blank
            for (let i=1; i<rows.length-1; i++) {
                let currentRow = rows[i].split(',');
                let currentData = {};
                for (let j=0; j<keys.length; j++) {
                    if(keys[j] == 'event_type' || keys[j] == 'country') {
                        currentData[keys[j]] = currentRow[j].replace(/^"(.*)"$/, '$1').trim().toLowerCase();
                    } else {
                        currentData[keys[j]] = currentRow[j];
                    }
                }
                acledData.push(currentData);
            }

            dashboard.loadMainMap();

            // fill in key figures
            $('#number-of-events').find('.number').html(acledData.length);
            $('#total-fatalities').find('.number').html(totalFatalities);
        }
    });
});
