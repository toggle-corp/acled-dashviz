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

        this.map = L.map('country-map', {preferCanvas: false}).setView([0, 10], 3);
        this.map.addLayer(new L.TileLayer('http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', {
            attribution: 'Map tiles by Carto, under CC BY 3.0. Data by OpenStreetMap, under ODbL.',
        }));
         
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

    load(iso, countryData) {
        this.reset();
        let that = this;
        let currentLayer = null;

        jQ3.getJSON('https://raw.githubusercontent.com/toggle-corp/world-map/master/countries.geo.json', function(data) {
            that.geoJsonLayer = L.geoJson(data, {
                onEachFeature: function(feature, layer) {
                    if (feature.properties.iso_n3 === iso) {
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
                 
                let circle = L.circleMarker([cd.latitude, cd.longitude], {
                    radius: radius,
                    fillColor: color,
                    stroke: false,
                    fillOpacity: 0.7,
                    //interactive: false,
                });
                circle.addTo(this.map)
                    .on('mouseover', function() { this.openPopup(); })
                    .on('mouseout', function() { this.closePopup(); })
                    .bindPopup(String(`<strong class="number">${cr.length}</strong> <span>${event.capitalize()}<span>`))
                this.circles.push(circle);
            }
        }

    }
}
