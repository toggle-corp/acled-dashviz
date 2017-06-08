class CrisisProfileMap extends Element {
    constructor() {
        super('<div id="crisis-profile-map"></div>');
    }
     
    process() {
        L.mapbox.accessToken = 'pk.eyJ1IjoiZnJvemVuaGVsaXVtIiwiYSI6ImNqMWxvNDIzNDAwMGgzM2xwczZldWx1MmgifQ.s3yNCS5b1f6DgcTH9di3zw';
        this.map = L.map('crisis-profile-map', { preferCanvas: true, zoomControl: false}).setView([0, 10], 3);
        L.tileLayer('https://api.mapbox.com/styles/v1/frozenhelium/cj1lpbp1g000l2rmr9kwg12b3/tiles/256/{z}/{x}/{y}?access_token=' + L.mapbox.accessToken, {
            attribution: ''
        }).addTo(this.map);

        this.map.scrollWheelZoom.disable();
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
