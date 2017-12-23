class DashboardMap extends Element {
    constructor() {
        super('<div class="map-container"></div>');
        this.header = new Element(`
            <div class="info-container">
                <div class="info">
                    <i class="fa fa-info-circle"></i><p>Click on a country to view detailed information.</p>
                </div>
            </div>
        `);
        this.mapElement = new Element('<div id="world-map"></div>');
        this.mapLegend = new MapLegend();
        this.mapInfo = new Element(`
            <div class="info-container">
                <div class="info">
                    <i class="fa fa-info-circle"></i><p>The map above groups conflict events by location and is limited to the largest 4,000 events in view.</p>
                </div>
            </div>
        `);
        this.childElements.push(this.header);
        this.childElements.push(this.mapElement);
        this.childElements.push(this.mapLegend);
        this.childElements.push(this.mapInfo);
         
        this.mapScale = null; 
        this.conditionalLayer = null;
    }
     
    process() {
        let that = this;

        this.map = L.map('world-map', { preferCanvas: false }).setView([0, 10], 3);
        this.map.addLayer(new L.TileLayer('http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', {
            attribution: 'Map tiles by Carto, under CC BY 3.0. Data by OpenStreetMap, under ODbL.',
        }));

        this.mapScale = new MapScale(this.map);

        // Toggle scroll-zoom by clicking on and outside map
        this.map.scrollWheelZoom.disable();
        this.map.on('focus', function() { this.scrollWheelZoom.enable(); });
        this.map.on('blur', function() { this.scrollWheelZoom.disable(); }); 
         
        // this.map.on('zoomend ', () => { this.mapScale.updateControl(); });
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
        const defaultLayerStyle = {
            fillColor: '#ccc',
            fillOpacity: 0,
            stroke: false,
        };
         
        let geoJsonLayer = null;
        $.getJSON('https://raw.githubusercontent.com/toggle-corp/world-map/master/countries.geo.json', function(data) {
            geoJsonLayer = L.geoJson(data, {
                onEachFeature: function(feature, layer) {
                    layer.setStyle(defaultLayerStyle);

                    const isAcledCountry = !!acledCountriesISO[feature.properties.iso_n3];

                    if (isAcledCountry) {
                        layer.on('mouseover', function() { layer.setStyle({ fillOpacity: 0.5, }); });
                        layer.on('mouseout', function() { layer.setStyle({ fillOpacity: 0, }); });
                        layer.on('click', function(){
                            dashboard.show(feature.properties.iso_n3);
                        });
                    }
                },
            });
            geoJsonLayer.addTo(that.map);
            geoJsonLayer.bringToBack();
        });
    }
     
    refreshMap(data) {
        let that = this;
        let maxEventCount = 0;

        if (this.conditionalLayer) {
            this.map.removeLayer(this.conditionalLayer);
        }
        
        this.conditionalLayer = L.conditionalMarkers([], {maxMarkers: 4000, DisplaySort: function(a, b){ return b._mRadius-a._mRadius; } });
         
        for (let location in data) {
            let cld = data[location]; // current location data 
             
            for (let event in cld) {
                let cr = cld[event]; 
                let cd = cr[0];
                let radius = getMapCircleRadius(cr.length);
                let color = getEventColor(cd.event_type);
                 
                this.conditionalLayer.addLayer(L.circleMarker([cd.latitude, cd.longitude], {
                    radius: radius,
                    fillColor: color,
                    stroke: false,
                    fillOpacity: 0.7,
                    //interactive: false,
                })
                    .on('mouseover', function() { this.openPopup(); })
                    .on('mouseout', function() { this.closePopup(); })
                    .bindPopup(String(`<strong class="number">${cr.length}</strong> <span>${event.capitalize()}<span>`)));
            }
        }

        this.conditionalLayer.addTo(this.map);
    }
}
