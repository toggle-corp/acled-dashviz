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

        this.conditionalLayer = L.conditionalMarkers([], {maxMarkers: 1000, DisplaySort: function(a, b){ return b._mRadius-a._mRadius; } });
		//var layerControl = L.control.layers([], {"Circles" :conditionalLayer}).addTo(map);

        // Toggle scroll-zoom by clicking on and outside map
        this.map.scrollWheelZoom.disable();
        this.map.on('focus', function() { this.scrollWheelZoom.enable(); });
        this.map.on('blur', function() { this.scrollWheelZoom.disable(); });
    }
     
    loadDataToMap() {
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
            addCountry(cr.country);
            addFatalities(cr.fatalities);
        }
        for (let event in acledEvents) {
            this.mapLegend.addLegendElement(getEventColor(event), event);
        }
        setTimeout(()=>{this.refreshMap(locationGroupedData);}, 0);
    }
    refreshMap(data) {
        for (let i=0; i<data.length; i++) {
            for (let j=0; j<data[i].events.length; j++) {
                let cd = data[i].events[j];   // current data
                let radius = Math.sqrt(cd.count)*8000;
                let color = getEventColor(cd.name);
                 
                this.conditionalLayer.addLayer(L.circle([data[i].location.latitude, data[i].location.longitude], radius, {
                    fillColor: color,
                    stroke: false,
                    fillOpacity: 0.5,
                }));
                //this.map.indexLayer(circle);
            }
        }
         
        this.conditionalLayer.addTo(this.map);
        let geoJsonLayer = null;
        let that = this;
        let countries = Object.keys(acledCountries);
        $.getJSON('https://raw.githubusercontent.com/toggle-corp/world-map/master/countries.geo.json', function(data) {
            geoJsonLayer = L.geoJson(data, {
                onEachFeature: function(feature, layer) {
                    layer.setStyle({
                        fillColor: '#ccc',
                        fillOpacity: 0,
                        stroke: false,
                    });

                    let data = countries.find(c => compareCountryNames(c, feature.properties.admin));
                    if (data) {
                        layer.on('mouseover', function() { layer.setStyle({ fillOpacity: 0.5, }); });
                        layer.on('mouseout', function() { layer.setStyle({ fillOpacity: 0, }); });
                        layer.on('click', function(){
                            dashboard.show(data);
                        });
                    }
                },
            });
            geoJsonLayer.addTo(that.map);
        });
    }
}
