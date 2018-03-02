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
        this.loadingAnimation = new LoadingAnimation();

        this.childElements.push(this.header);
        this.childElements.push(this.mapElement);
        this.childElements.push(this.mapLegend);
        this.childElements.push(this.mapInfo);
        this.childElements.push(this.loadingAnimation);
         
        // this.mapScale = null; 
        this.conditionalLayer = null;
    }
     
    process() {
        let that = this;

        this.map = L.map(
            'world-map',
            {
                preferCanvas: true,
                zoomSnap: 0.25,
            },
        ).setView([0, 0], 2);
        this.map.addLayer(new L.TileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', {
            attribution: 'Map tiles by Carto, under CC BY 3.0. Data by OpenStreetMap, under ODbL.',
        }));

        // this.mapScale = new MapScale(this.map);

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

        this.loadingAnimation.show();
         
        let geoJsonLayer = null;
        jQ3.getJSON('https://raw.githubusercontent.com/toggle-corp/world-map/master/countries.geo.json', function(data) {
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
            that.loadingAnimation.hide();
        });
    }
     
    refreshMap(data) {
        const that = this;

        const markers = [];
        for (let location in data) {
            let cld = data[location]; // current location data 
             
            for (let event in cld) {
                const cr = cld[event]; 
                const cd = cr[0];
                const radius = getMapCircleRadius(cr.length);
                const color = getEventColor(cd.event_type);
                if (cd.latitude < -90 || cd.latitude > 90) {
                    continue;
                }
                if (cd.longitude < -180 || cd.longitude > 180) {
                    continue;
                }

                const marker = L.circleMarker([cd.latitude, cd.longitude], {
                    radius: radius,
                    fillColor: color,
                    stroke: false,
                    fillOpacity: 0.7,
                });

                marker.on('mouseover', function() { this.openPopup(); });
                marker.on('mouseout', function() { this.closePopup(); });
                marker.bindPopup(`
                    <strong class="number">
                        ${cr.length}
                    </strong>
                    <span class="label">
                        ${event.capitalize()}
                    <span>
                `);
                 
                markers.push(marker);
                // this.conditionalLayer.addLayer(marker)
            }
        }

        if (this.conditionalLayer) {
            this.map.removeLayer(this.conditionalLayer);
        }
        
        this.conditionalLayer = L.conditionalMarkers(
            markers,
            {
                maxMarkers: 4000,
                DisplaySort: (a, b) => ( b._mRadius - a._mRadius),
            },
        );
        this.conditionalLayer.addTo(this.map);

        const group = new L.featureGroup(markers);
        const bounds = group.getBounds();

        this.map.fitBounds(bounds);
    }
}
