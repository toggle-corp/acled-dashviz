class CountryMap extends Element {
    constructor() {
        super('<div id="country-map-container"></div>');
        this.mapElement = new Element('<div id="country-map"></div>');
        this.mapLegend = new MapLegend();
        this.childElements.push(this.mapElement);
        this.childElements.push(this.mapLegend);
         
        this.mapScale = null; 
    }

    process() {
        let that = this;
        // this.mapLegend.setTitle('Event types');

        L.mapbox.accessToken = 'pk.eyJ1IjoiZnJvemVuaGVsaXVtIiwiYSI6ImNqMWxvNDIzNDAwMGgzM2xwczZldWx1MmgifQ.s3yNCS5b1f6DgcTH9di3zw';
        this.map = L.map('country-map', {preferCanvas: false}).setView([0, 10], 3);
        L.tileLayer('https://api.mapbox.com/styles/v1/frozenhelium/cj1lpbp1g000l2rmr9kwg12b3/tiles/256/{z}/{x}/{y}?access_token=' + L.mapbox.accessToken, {
            attribution: '© <a href="https://www.mapbox.com/map-feedback/">Mapbox</a> © <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        }).addTo(this.map);
         
        this.mapScale = new MapScale(this.map);

        // Toggle scroll-zoom by clicking on and outside map
        this.map.scrollWheelZoom.disable();
        this.map.on('focus', function() { this.scrollWheelZoom.enable(); });
        this.map.on('blur', function() { this.scrollWheelZoom.disable(); });
         
        this.map.on('zoomend ', () => { this.mapScale.updateControl(); });
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
                    if (compareCountryNames(country, feature.properties.geounit)) {
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
            that.geoJsonLayer.bringToBack();
            that.map.invalidateSize();
            that.map.fitBounds(currentLayer.getBounds());
        });
         
        let locationGroupedData = d3.nest()
            .key((d) => d.latitude + ' ' + d.longitude)
            .key((d) => d.event_type )
            .object(countryData);

        this.circles = [];
         
        for (let location in locationGroupedData) {
            let cld = locationGroupedData[location]; // current location data 
             
            for (let event in cld) {
                let cr = cld[event]; 
                let cd = cr[0];
                let radius = getMapCircleRadius(cr.length);
                let color = getEventColor(cd.event_type);
                 
                let circle = L.circle([cd.latitude, cd.longitude], radius, {
                    fillColor: color,
                    stroke: false,
                    fillOpacity: 0.7,
                    //interactive: false,
                });
                circle.addTo(this.map).bindPopup(String(`${cr.length} <strong>${event.capitalize()}</strong>`));
                this.circles.push(circle);
            }
        }

    }
}
