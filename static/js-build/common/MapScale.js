'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var MapScale = function () {
    function MapScale(map) {
        _classCallCheck(this, MapScale);

        var that = this;
        this.control = L.control({ 'position': 'bottomright' });

        this.control.onAdd = function () {
            this.container = L.DomUtil.create('div', 'info map-scale');
            this.container.style.backgroundColor = 'rgba(255, 255, 255, 0.8)';
            this.container.style.padding = '0 10px';
            this.container.style.border = '1px solid rgba(0, 0, 0, 0.1)';
            that.updateControl(this);
            return this.container;
        };

        this.map = map;
        this.control.addTo(map);
    }

    _createClass(MapScale, [{
        key: 'updateControl',
        value: function updateControl() {
            var circleRadii = [9, 16, 22, 26];
            // let zoomLevel = this.map.getZoom();
            var scaleLabels = circleRadii.map(function (d) {
                return getEventCountFromMapCircleRadius(d / 2);
            });

            this.control.container.innerHTML = '';
            for (var i = 0; i < circleRadii.length; i++) {
                this.control.container.innerHTML += '<div><label>' + scaleLabels[i] + '</label><span style="width: ' + circleRadii[i] + 'px; height: ' + circleRadii[i] + 'px;"></span></div>';
            }
        }
    }]);

    return MapScale;
}();
//# sourceMappingURL=MapScale.js.map