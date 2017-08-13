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

        _this.mapElement = new Element('<div id="world-map"></div>');
        _this.mapLegend = new MapLegend();
        _this.childElements.push(_this.mapElement);
        _this.childElements.push(_this.mapLegend);

        _this.mapScale = null;
        return _this;
    }

    _createClass(DashboardMap, [{
        key: 'process',
        value: function process() {
            var _this2 = this;

            var that = this;

            //this.mapLegend.setTitle('Event types');

            L.mapbox.accessToken = 'pk.eyJ1IjoiZnJvemVuaGVsaXVtIiwiYSI6ImNqMWxvNDIzNDAwMGgzM2xwczZldWx1MmgifQ.s3yNCS5b1f6DgcTH9di3zw';
            this.map = L.map('world-map', { preferCanvas: false }).setView([0, 10], 3);
            L.tileLayer('https://api.mapbox.com/styles/v1/frozenhelium/cj1lpbp1g000l2rmr9kwg12b3/tiles/256/{z}/{x}/{y}?access_token=' + L.mapbox.accessToken, {
                attribution: '© <a href="https://www.mapbox.com/map-feedback/">Mapbox</a> © <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            }).addTo(this.map);

            this.conditionalLayer = L.conditionalMarkers([], { maxMarkers: 4000, DisplaySort: function DisplaySort(a, b) {
                    return b._mRadius - a._mRadius;
                } });

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
        key: 'loadDataToMap',
        value: function loadDataToMap() {
            var _this3 = this;

            var locationGroupedData = [];
            var currentLocation = { 'latitude': '', 'longitude': '' };
            var currentData = null;
            var currentEvent = { 'name': '', 'count': 0 };
            for (var i = 0; i < acledData.length; i++) {
                var cr = acledData[i]; // current row
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
                addEvent(cr.event_type);
                addCountry(cr.country);
                addFatalities(cr.fatalities);
            }

            this.mapLegend.fillAcledEvents();

            setTimeout(function () {
                _this3.refreshMap(locationGroupedData);
            }, 0);
        }
    }, {
        key: 'getScaledRadius',
        value: function getScaledRadius(num) {
            return Math.sqrt(num);
        }
    }, {
        key: 'refreshMap',
        value: function refreshMap(data) {
            var that = this;
            var maxEventCount = 0;

            for (var i = 0; i < data.length; i++) {
                for (var j = 0; j < data[i].events.length; j++) {
                    var cd = data[i].events[j]; // current data
                    var radius = getMapCircleRadius(cd.count);
                    var color = getEventColor(cd.name);

                    this.conditionalLayer.addLayer(L.circle([data[i].location.latitude, data[i].location.longitude], radius, {
                        fillColor: color,
                        stroke: false,
                        fillOpacity: 0.8,
                        interactive: false
                    })
                    //.bindPopup(String(`No. of Events: ${(cd.count)}`))
                    );
                }
            }

            this.conditionalLayer.addTo(this.map);

            var geoJsonLayer = null;
            var countries = Object.keys(acledCountries);
            $.getJSON('https://raw.githubusercontent.com/toggle-corp/world-map/master/countries.geo.json', function (data) {
                geoJsonLayer = L.geoJson(data, {
                    onEachFeature: function onEachFeature(feature, layer) {
                        layer.setStyle({
                            fillColor: '#ccc',
                            fillOpacity: 0,
                            stroke: false
                        });

                        var data = countries.find(function (c) {
                            return compareCountryNames(c, feature.properties.admin);
                        });
                        if (data) {
                            layer.on('mouseover', function () {
                                layer.setStyle({ fillOpacity: 0.5 });
                            });
                            layer.on('mouseout', function () {
                                layer.setStyle({ fillOpacity: 0 });
                            });
                            layer.on('click', function () {
                                dashboard.show(data);
                            });
                        }
                    }
                });
                geoJsonLayer.addTo(that.map);
            });
        }
    }]);

    return DashboardMap;
}(Element);
//# sourceMappingURL=DashboardMap.js.map