'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var CountryMap = function (_Element) {
    _inherits(CountryMap, _Element);

    function CountryMap() {
        _classCallCheck(this, CountryMap);

        var _this = _possibleConstructorReturn(this, (CountryMap.__proto__ || Object.getPrototypeOf(CountryMap)).call(this, '<div id="country-map-container"></div>'));

        _this.mapElement = new Element('<div id="country-map"></div>');
        _this.mapLegend = new MapLegend();
        _this.childElements.push(_this.mapElement);
        _this.childElements.push(_this.mapLegend);

        _this.mapScale = null;
        return _this;
    }

    _createClass(CountryMap, [{
        key: 'process',
        value: function process() {
            var _this2 = this;

            var that = this;
            // this.mapLegend.setTitle('Event types');

            this.map = L.map('country-map', { preferCanvas: false }).setView([0, 10], 3);
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

            this.map.on('zoomend ', function () {
                _this2.mapScale.updateControl();
            });
        }
    }, {
        key: 'reset',
        value: function reset() {
            var resetView = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

            if (this.geoJsonLayer) {
                this.geoJsonLayer.clearLayers();
                this.map.removeLayer(this.geoJsonLayer);
            }

            if (resetView) {
                this.map.setView([0, 10], 3);
            }

            this.geoJsonLayer = null;

            if (this.circles) {
                for (var i = 0; i < this.circles.length; i++) {
                    this.map.removeLayer(this.circles[i]);
                }
            }
        }
    }, {
        key: 'load',
        value: function load(iso, countryData) {
            this.reset();
            var that = this;
            var currentLayer = null;

            $.getJSON('https://raw.githubusercontent.com/toggle-corp/world-map/master/countries.geo.json', function (data) {
                that.geoJsonLayer = L.geoJson(data, {
                    onEachFeature: function onEachFeature(feature, layer) {
                        if (feature.properties.iso_n3 === iso) {
                            layer.setStyle({
                                fillOpacity: 0,
                                stroke: true,
                                color: '#2c3e50'
                            });
                            currentLayer = layer;
                        } else {
                            layer.setStyle({
                                fillOpacity: 0,
                                stroke: false
                            });
                        }
                    }
                });
                that.geoJsonLayer.addTo(that.map);
                that.geoJsonLayer.bringToBack();
                that.map.invalidateSize();
                that.map.fitBounds(currentLayer.getBounds());
            });

            var locationGroupedData = d3.nest().key(function (d) {
                return d.latitude + ' ' + d.longitude;
            }).key(function (d) {
                return d.event_type;
            }).object(countryData);

            this.circles = [];

            for (var location in locationGroupedData) {
                var cld = locationGroupedData[location]; // current location data 

                for (var event in cld) {
                    var cr = cld[event];
                    var cd = cr[0];
                    var radius = getMapCircleRadius(cr.length);
                    var color = getEventColor(cd.event_type);

                    var circle = L.circleMarker([cd.latitude, cd.longitude], {
                        radius: radius,
                        fillColor: color,
                        stroke: false,
                        fillOpacity: 0.7
                        //interactive: false,
                    });
                    circle.addTo(this.map).on('mouseover', function () {
                        this.openPopup();
                    }).on('mouseout', function () {
                        this.closePopup();
                    }).bindPopup(String('<strong class="number">' + cr.length + '</strong> <span>' + event.capitalize() + '<span>'));
                    this.circles.push(circle);
                }
            }
        }
    }]);

    return CountryMap;
}(Element);
//# sourceMappingURL=CountryMap.js.map