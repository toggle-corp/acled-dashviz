class CountryMap extends Element {
    constructor() {
        super('<div id="country-map-container"></div>');
        this.mapElement = new Element('<div id="country-map"></div>');
        this.mapLegend = new MapLegend();
        this.childElements.push(this.mapElement);
        this.childElements.push(this.mapLegend);
    }

    process() {
        // this.mapLegend.setTitle('Event types');

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


    reset(resetView=false) {
        if(this.geoJsonLayer) {
            this.geoJsonLayer.clearLayers();
            this.map.removeLayer(this.geoJsonLayer);
        }

        if (resetView) {
            this.map.setView([0, 10], 3);
        }

        this.geoJsonLayer = null;
        //this.map.invalidateSize();

        if (this.circles) {
            for (let i=0; i<this.circles.length; i++) {
                this.map.removeLayer(this.circles[i]);
            }
        }

    }

    load(country, countryData) {
        this.reset();
        let that = this;
        let currentLayer = null;

        $.getJSON('https://raw.githubusercontent.com/toggle-corp/world-map/master/countries.geo.json', function(data) {
            that.geoJsonLayer = L.geoJson(data, {
                onEachFeature: function(feature, layer) {
                    if (compareCountryNames(country, feature.properties.admin)) {
                        layer.setStyle({
                            fillOpacity: 0,
                            stroke: true,
                            color: '#2c3e50',
                        });
                        currentLayer = layer;
                    } else {
                        layer.setStyle({
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

        let locationGroupedData = [];
        let currentLocation = {'latitude': '', 'longitude': ''};
        let currentData = null;
        let currentEvent = {'name': '', 'count': 0};

        for (let i=0; i<countryData.length; i++) {
            let cr = countryData[i];  // current row
            if (currentLocation.latitude != cr.latitude || currentLocation.longitude != cr.longitude) {
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
        }

        this.circles = [];

        for (let i=0; i<locationGroupedData.length; i++) {
            for (let j=0; j<locationGroupedData[i].events.length; j++) {
                let cd = locationGroupedData[i].events[j];   // current data
                let radius = Math.sqrt(cd.count)*10000;
                let color = getEventColor(cd.name);
                let circle = L.circle([locationGroupedData[i].location.latitude, locationGroupedData[i].location.longitude], radius, {
                    fillColor: color,
                    stroke: false,
                    fillOpacity: 0.6,
                });
                circle.addTo(this.map);
                this.circles.push(circle);
            }
        }

        this.mapLegend.clearLegendElements();


        let acledEventKeys = getSortedAcledEventKeys();
        for (let i in acledEventKeys) {
            this.mapLegend.addLegendElement(getEventColor(acledEventKeys[i]), acledEventKeys[i]);
        }
    }
}
