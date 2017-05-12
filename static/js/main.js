let acledData = [];
let acledColors = ['#16a085', '#27ae60', '#2980b9', '#8e44ad', '#2c3e50', '#f39c12', '#d35400', '#c0392b', '#7f8c8d', '#bdc3c7'];

// pads the string s to right with c upto n length
function padRight(s, c, n) {
    if (! s || ! c || s.length >= n) {
        return s;
    }

    var max = (n - s.length)/c.length;
    for (var i = 0; i < max; i++) {
        s += c;
    }
    s = s.substring(0, s.length - s.length%n);
    return s;
}

// hashes the sring to a 32-bit hex number (string)
String.prototype.hash32 = function() {
    let hash = 0, i, chr;
    str = padRight(this, '1234567abcdef', 128);

    for (let i = 0; i < str.length; i++) {
        chr   = str.charCodeAt(i);
        hash  = ((hash << 5) - hash) + chr;
        hash |= 0;
    }
    return hash;
}

String.prototype.toPastelColor = function() {
    let hash = this.hash32();
    let h = (hash>>>0)/0xffffffff;
    let s = '66%';
    let l = '55%';
    h = Math.pow(h, -4);
    return 'hsl(' + Math.ceil(h*360) + ', '+ s + ', ' + l + ')';
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
        let locationGroupedData = [];
        // let currentLocation = {'latitude': '', 'longitude': ''};
        // let currentData = null;
        // for (let i=0; i<acledData.length; i++) {
        //     let cr = acledData[i];  // current row
        //     if(currentLocation.latitude != cr.latitude || currentLocation.longitude != cr.longitude) {
        //         currentLocation = {'latitude': cr.latitude, 'longitude': cr.longitude};
        //         currentData = {'location': currentLocation, 'events': []};
        //         locationGroupedData.push(currentData);
        //     }
        //     currentData.events.push(cr.event_type);
        // }
        this.refreshMap(locationGroupedData);
    }
    refreshMap(data) {
        // function compareCountryNames(name1, name2) {
        //     name1 = name1.toLowerCase().replace(/\b((the)|(a)|(an)|(of))\b/g, '').replace(/\s\s+/g, ' ');
        //     name2 = name2.toLowerCase().replace(/\b((the)|(a)|(an)|(of))\b/g, '').replace(/\s\s+/g, ' ');
        //     return (name1 == name2);
        // }

        let markerClusters = L.markerClusterGroup({maxClusterRadius: '50'});
        for (let i=0; i<acledData.length; i++) {
            let id = acledData[i].data_id;
            let m = L.marker( [acledData[i].latitude, acledData[i].longitude] );
            m.bindPopup('Loading...');
            m.on('click', function(e){
                let popup = e.target.getPopup();
                $.ajax({
                    method: 'GET',
                    url: 'https://api.acleddata.com/acled/read',
                    data: {'data_id': id},
                    success: function(data){
                        popup.setContent('<div><label>Event type:</label><span>' + data.data[0].event_type + '</span></div><div><label>Source: </label><span>' + data.data[0].source + '</span></div>');
                    }
                });
            });
            markerClusters.addLayer(m);
        }

        this.map.addLayer(markerClusters);

        // for (let i=0; i<data.length; i++) {
        //     let cd = data[i];   // current data
        //     let radius = Math.sqrt(cd.events.length)*1000;
        //     let color = 'blue';
        //     L.circle([cd.location.latitude, cd.location.longitude], radius, {
        //         fillColor: color,
        //         stroke: false,
        //         fillOpacity: 0.7,
        //     }).addTo(this.map);
        // }

        // for (let i=0; i<acledData.length; i++) {
        //     let data = acledData[i];
        //     let radius = Math.sqrt((data.fatalities + 50) * 5000)*50;
        //     let color = (data.event_type.toLowerCase().startsWith('battle')? 'battle'.toPastelColor() : data.event_type.toLowerCase().toPastelColor());
        //     L.circle([data.latitude, data.longitude], radius, {
        //         fillColor: color,
        //         stroke: false,
        //         fillOpacity: 0.7,
        //     }).addTo(this.map);
        // }

        // let geoJsonLayer = null;
        // let that = this;
        // $.getJSON('https://raw.githubusercontent.com/toggle-corp/world-map/master/countries.geo.json', function(data) {
        //     geoJsonLayer = L.geoJson(data, {
        //         onEachFeature: function(feature, layer) {
        //             layer.setStyle({
        //                 fillColor: '#ccc',
        //                 fillOpacity: 0,
        //                 stroke: false,
        //             });
        //
        //             let data = acledData.find(d => compareCountryNames(d.country, feature.properties.admin));
        //             if (data) {
        //                 layer.on('mouseover', function() { layer.setStyle({ fillOpacity: 0.5, }); });
        //                 layer.on('mouseout', function() { layer.setStyle({ fillOpacity: 0, }); });
        //                 layer.on('click', function(){});
        //             }
        //         },
        //     });
        //     geoJsonLayer.addTo(that.map);
        // });
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
    }
    loadMap() {
        this.dashboardMap.loadDataToMap();
    }
}

class Dashboard extends Element {
    constructor() {
        super();
        this.element = $('<div id="dashboard"></div>');
        this.childElements.push(new MainDashboard);
    }
    loadMainMap() {
        this.childElements[0].loadMap();
    }
}

$(document).ready(function(){
    $('#main').empty();
    let root = new Element();
    root.element = $('#main');
    let dashboard = new Dashboard();
    dashboard.initDomAll(root);
    dashboard.processAll();

    $.ajax({
        url: 'https://api.acleddata.com/acled/read.csv',
        data: {'limit': '0', 'fields': 'data_id|event_type|latitude|longitude'},
        success: function(data){
            let rows = data.split('\n');
            let keys = rows[0].split(',');

            // 1st row is list of keys, last is blank
            for (let i=1; i<rows.length-1; i++) {
                let currentRow = rows[i].split(',');
                let currentData = {};
                for (let j=0; j<keys.length; j++) {
                    currentData[keys[j]] = currentRow[j];
                }
                acledData.push(currentData);
            }

            dashboard.loadMainMap();
            // acledData.sort(function(a, b){
            //     return (a.latitude != b.latitude)? a.latitude - b.latitude : a.longitude - b.longitude;
            // });

        }
    });
});
