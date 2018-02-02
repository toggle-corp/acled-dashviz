'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var DashboardMap = function (_Element) {
    _inherits(DashboardMap, _Element);

    function DashboardMap() {
        _classCallCheck(this, DashboardMap);

        var _this = _possibleConstructorReturn(this, (DashboardMap.__proto__ || Object.getPrototypeOf(DashboardMap)).call(this, '<div class="map-container"></div>'));

        _this.header = new Element('\n            <div class="info-container">\n                <div class="info">\n                    <i class="fa fa-info-circle"></i><p>Click on a country to view detailed information.</p>\n                </div>\n            </div>\n        ');
        _this.mapElement = new Element('<div id="world-map"></div>');
        _this.mapLegend = new MapLegend();
        _this.mapInfo = new Element('\n            <div class="info-container">\n                <div class="info">\n                    <i class="fa fa-info-circle"></i><p>The map above groups conflict events by location and is limited to the largest 4,000 events in view.</p>\n                </div>\n            </div>\n        ');
        _this.loadingAnimation = new LoadingAnimation();

        _this.childElements.push(_this.header);
        _this.childElements.push(_this.mapElement);
        _this.childElements.push(_this.mapLegend);
        _this.childElements.push(_this.mapInfo);
        _this.childElements.push(_this.loadingAnimation);

        _this.mapScale = null;
        _this.conditionalLayer = null;
        return _this;
    }

    _createClass(DashboardMap, [{
        key: 'process',
        value: function process() {
            var that = this;

            this.map = L.map('world-map', { preferCanvas: false }).setView([0, 10], 3);
            this.map.addLayer(new L.TileLayer('http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', {
                attribution: 'Map tiles by Carto, under CC BY 3.0. Data by OpenStreetMap, under ODbL.'
            }));

            this.mapScale = new MapScale(this.map);

            // Toggle scroll-zoom by clicking on and outside map
            this.map.scrollWheelZoom.disable();
            this.map.on('focus', function () {
                this.scrollWheelZoom.enable();
            });
            this.map.on('blur', function () {
                this.scrollWheelZoom.disable();
            });

            // this.map.on('zoomend ', () => { this.mapScale.updateControl(); });
        }
    }, {
        key: 'processData',
        value: function processData(data) {
            this.locationGroupedData = d3.nest().key(function (d) {
                return d.latitude + ' ' + d.longitude;
            }).key(function (d) {
                return d.event_type;
            }).entries(data);
        }
    }, {
        key: 'init',
        value: function init() {
            var that = this;
            this.mapLegend.fillAcledEvents('worldmap');
            var defaultLayerStyle = {
                fillColor: '#ccc',
                fillOpacity: 0,
                stroke: false
            };

            this.loadingAnimation.show();

            var geoJsonLayer = null;
            jQ3.getJSON('https://raw.githubusercontent.com/toggle-corp/world-map/master/countries.geo.json', function (data) {
                geoJsonLayer = L.geoJson(data, {
                    onEachFeature: function onEachFeature(feature, layer) {
                        layer.setStyle(defaultLayerStyle);

                        var isAcledCountry = !!acledCountriesISO[feature.properties.iso_n3];

                        if (isAcledCountry) {
                            layer.on('mouseover', function () {
                                layer.setStyle({ fillOpacity: 0.5 });
                            });
                            layer.on('mouseout', function () {
                                layer.setStyle({ fillOpacity: 0 });
                            });
                            layer.on('click', function () {
                                dashboard.show(feature.properties.iso_n3);
                            });
                        }
                    }
                });
                geoJsonLayer.addTo(that.map);
                geoJsonLayer.bringToBack();
                that.loadingAnimation.hide();
            });
        }
    }, {
        key: 'refreshMap',
        value: function refreshMap(data) {
            var that = this;
            var maxEventCount = 0;

            if (this.conditionalLayer) {
                this.map.removeLayer(this.conditionalLayer);
            }

            this.conditionalLayer = L.conditionalMarkers([], { maxMarkers: 4000, DisplaySort: function DisplaySort(a, b) {
                    return b._mRadius - a._mRadius;
                } });

            for (var location in data) {
                var cld = data[location]; // current location data 

                for (var event in cld) {
                    var cr = cld[event];
                    var cd = cr[0];
                    var radius = getMapCircleRadius(cr.length);
                    var color = getEventColor(cd.event_type);

                    this.conditionalLayer.addLayer(L.circleMarker([cd.latitude, cd.longitude], {
                        radius: radius,
                        fillColor: color,
                        stroke: false,
                        fillOpacity: 0.7
                        //interactive: false,
                    }).on('mouseover', function () {
                        this.openPopup();
                    }).on('mouseout', function () {
                        this.closePopup();
                    }).bindPopup(String('<strong class="number">' + cr.length + '</strong> <span>' + event.capitalize() + '<span>')));
                }
            }

            this.conditionalLayer.addTo(this.map);
        }
    }]);

    return DashboardMap;
}(Element);
//# sourceMappingURL=DashboardMap.js.map