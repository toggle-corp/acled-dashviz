'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var CrisisProfileMap = function (_Element) {
    _inherits(CrisisProfileMap, _Element);

    function CrisisProfileMap() {
        _classCallCheck(this, CrisisProfileMap);

        return _possibleConstructorReturn(this, (CrisisProfileMap.__proto__ || Object.getPrototypeOf(CrisisProfileMap)).call(this, '<div id="crisis-profile-map"></div>'));
    }

    _createClass(CrisisProfileMap, [{
        key: 'process',
        value: function process() {
            this.map = L.map('crisis-profile-map', { preferCanvas: true, zoomControl: false }).setView([0, 10], 5);
            this.map.addLayer(new L.TileLayer('http://{s}.api.cartocdn.com/base-light/{z}/{x}/{y}.png'));

            this.map.scrollWheelZoom.disable();
        }
    }, {
        key: 'load',
        value: function load(country) {
            if (this.geoJsonLayer) {
                this.map.removeLayer(this.geoJsonLayer);
            }
            this.geoJsonLayer = null;
            var that = this;
            var currentLayer = null;

            $.getJSON('https://raw.githubusercontent.com/toggle-corp/world-map/master/countries.geo.json', function (data) {
                that.geoJsonLayer = L.geoJson(data, {
                    onEachFeature: function onEachFeature(feature, layer) {
                        if (compareCountryNames(country, feature.properties.admin)) {
                            layer.setStyle({
                                fillColor: '#2c3e50',
                                fillOpacity: 0,
                                stroke: true,
                                color: '#2c3e50'
                            });
                            currentLayer = layer;
                        } else {
                            layer.setStyle({
                                fillColor: '#000',
                                fillOpacity: 0,
                                stroke: false
                            });
                        }
                    }
                });
                that.geoJsonLayer.addTo(that.map);
                that.map.invalidateSize();
                if (currentLayer) {
                    that.map.fitBounds(currentLayer.getBounds(), { padding: [0, 0] });
                }
            });
        }
    }]);

    return CrisisProfileMap;
}(Element);
//# sourceMappingURL=CrisisProfileMap.js.map