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
        return _this;
    }

    _createClass(CountryMap, [{
        key: 'process',
        value: function process() {
            // this.mapLegend.setTitle('Event types');

            L.mapbox.accessToken = 'pk.eyJ1IjoiZnJvemVuaGVsaXVtIiwiYSI6ImNqMWxvNDIzNDAwMGgzM2xwczZldWx1MmgifQ.s3yNCS5b1f6DgcTH9di3zw';
            this.map = L.map('country-map', { preferCanvas: true }).setView([0, 10], 3);
            L.tileLayer('https://api.mapbox.com/styles/v1/frozenhelium/cj1lpbp1g000l2rmr9kwg12b3/tiles/256/{z}/{x}/{y}?access_token=' + L.mapbox.accessToken, {
                attribution: '© <a href="https://www.mapbox.com/map-feedback/">Mapbox</a> © <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            }).addTo(this.map);

            // Toggle scroll-zoom by clicking on and outside map
            this.map.scrollWheelZoom.disable();
            this.map.on('focus', function () {
                this.scrollWheelZoom.enable();
            });
            this.map.on('blur', function () {
                this.scrollWheelZoom.disable();
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
            //this.map.invalidateSize();

            if (this.circles) {
                for (var i = 0; i < this.circles.length; i++) {
                    this.map.removeLayer(this.circles[i]);
                }
            }
        }
    }, {
        key: 'load',
        value: function load(country, countryData) {
            this.reset();
            var that = this;
            var currentLayer = null;

            $.getJSON('https://raw.githubusercontent.com/toggle-corp/world-map/master/countries.geo.json', function (data) {
                that.geoJsonLayer = L.geoJson(data, {
                    onEachFeature: function onEachFeature(feature, layer) {
                        if (compareCountryNames(country, feature.properties.admin)) {
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
                that.map.invalidateSize();
                that.map.fitBounds(currentLayer.getBounds());
            });

            var locationGroupedData = [];
            var currentLocation = { 'latitude': '', 'longitude': '' };
            var currentData = null;
            var currentEvent = { 'name': '', 'count': 0 };

            for (var i = 0; i < countryData.length; i++) {
                var cr = countryData[i]; // current row
                if (currentLocation.latitude != cr.latitude || currentLocation.longitude != cr.longitude) {
                    currentLocation = { 'latitude': cr.latitude, 'longitude': cr.longitude };
                    currentData = { 'location': currentLocation, 'events': [] };
                    locationGroupedData.push(currentData);

                    currentEvent = { 'name': cr.event_type, 'count': 0 };
                    currentData.events.push(currentEvent);
                } else if (currentEvent.name != cr.event_type) {
                    currentEvent = { 'name': cr.event_type, 'count': 0 };
                    currentData.events.push(currentEvent);
                }
                ++currentEvent.count;
            }

            this.circles = [];

            for (var _i = 0; _i < locationGroupedData.length; _i++) {
                for (var j = 0; j < locationGroupedData[_i].events.length; j++) {
                    var cd = locationGroupedData[_i].events[j]; // current data
                    var radius = Math.sqrt(cd.count) * 10000;
                    var color = getEventColor(cd.name);
                    var circle = L.circle([locationGroupedData[_i].location.latitude, locationGroupedData[_i].location.longitude], radius, {
                        fillColor: color,
                        stroke: false,
                        fillOpacity: 0.6
                    });
                    circle.addTo(this.map);
                    this.circles.push(circle);
                }
            }

            this.mapLegend.fillAcledEvents();
        }
    }]);

    return CountryMap;
}(Element);
//# sourceMappingURL=CountryMap.js.map