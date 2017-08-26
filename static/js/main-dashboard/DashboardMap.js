class DashboardMap extends Element {
    constructor() {
        super('<div class="map-container"></div>');
        this.mapElement = new Element('<div id="world-map"></div>');
        this.mapLegend = new MapLegend();
        this.childElements.push(this.mapElement);
        this.childElements.push(this.mapLegend);
         
        this.mapScale = null; 
        this.conditionalLayer = null;
    }
     
    process() {
        let that = this;

        L.mapbox.accessToken = 'pk.eyJ1IjoiZnJvemVuaGVsaXVtIiwiYSI6ImNqMWxvNDIzNDAwMGgzM2xwczZldWx1MmgifQ.s3yNCS5b1f6DgcTH9di3zw';
        this.map = L.map('world-map', { preferCanvas: false }).setView([0, 10], 3);
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
     
    processData(data) {
        this.locationGroupedData = d3.nest()
            .key((d) => d.latitude + ' ' + d.longitude)
            .key((d) => d.event_type)
            .entries(data);
    }

    init() {
        let that = this;

        this.mapLegend.fillAcledEvents('worldmap');
         
        let geoJsonLayer = null;
        let countries = Object.keys(acledCountries);
        $.getJSON('https://raw.githubusercontent.com/toggle-corp/world-map/master/countries.geo.json', function(data) {
            geoJsonLayer = L.geoJson(data, {
                onEachFeature: function(feature, layer) {
                    layer.setStyle({
                        fillColor: '#ccc',
                        fillOpacity: 0,
                        stroke: false,
                    });

                    let data = countries.find(c => compareCountryNames(c, feature.properties.geounit));
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
     
    refreshMap(data) {
        let that = this;
        let maxEventCount = 0;

        if (this.conditionalLayer) {
            this.map.removeLayer(this.conditionalLayer);
        }
        
        this.conditionalLayer = L.conditionalMarkers([], {maxMarkers: 2000, DisplaySort: function(a, b){ return b._mRadius-a._mRadius; } });
         
        for (let location in data) {
            let cld = data[location]; // current location data 
             
            for (let event in cld) {
                let cr = cld[event]; 
                let cd = cr[0];
                let radius = getMapCircleRadius(cr.length);
                let color = getEventColor(cd.event_type);
                 
                this.conditionalLayer.addLayer(L.circle([cd.latitude, cd.longitude], radius, {
                    fillColor: color,
                    stroke: false,
                    fillOpacity: 0.7,
                    //interactive: false,
                }).bindPopup(String(`${cr.length} <strong>${event.capitalize()}<strong>`)));
            }
        }

        this.conditionalLayer.addTo(this.map);
    }
}
