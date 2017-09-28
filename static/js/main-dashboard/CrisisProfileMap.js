class CrisisProfileMap extends Element {
    constructor() {
        super('<div id="crisis-profile-map"></div>');
    }
     
    process() {
        this.map = L.map('crisis-profile-map', { preferCanvas: true, zoomControl: false}).setView([0, 10], 5);
        this.map.addLayer(new L.TileLayer('http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png'));

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
            if(currentLayer) {
                that.map.fitBounds(currentLayer.getBounds(), {padding: [0, 0]});
            }
        });
    }
}
