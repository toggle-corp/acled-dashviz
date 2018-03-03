'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var MapLegend = function (_Element) {
    _inherits(MapLegend, _Element);

    function MapLegend() {
        _classCallCheck(this, MapLegend);

        var _this = _possibleConstructorReturn(this, (MapLegend.__proto__ || Object.getPrototypeOf(MapLegend)).call(this, '<div class="legend"></div>'));

        _this.element.append('<div class="legend-elements"></div>');
        _this.legendElementTemplate = jQ3('<label class="legend-element checked"><input type="checkbox" checked><span class="color-box"></span><span class="name"><span/></label>');
        return _this;
    }

    _createClass(MapLegend, [{
        key: 'addLegendElement',
        value: function addLegendElement(color, label) {
            var legendElementsContainer = this.element.find('.legend-elements');
            var legendElement = this.legendElementTemplate.clone();
            legendElement.find('.color-box').css('background-color', color);
            legendElement.find('input').attr('data-target', label);
            legendElement.find('.name').text(label);
            legendElement.appendTo(legendElementsContainer);
        }
    }, {
        key: 'clearLegendElements',
        value: function clearLegendElements() {
            this.element.find('.legend-elements').empty();
        }
    }, {
        key: 'fillAcledEvents',
        value: function fillAcledEvents() {
            var name = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "legend";

            this.name = name;
            this.clearLegendElements();

            var orderedAcledEvents = getSortedAcledEvents();
            for (var i = 0; i < orderedAcledEvents.length; i++) {
                this.addLegendElement(getEventColor(orderedAcledEvents[i]), orderedAcledEvents[i]);
            }

            var that = this;
            this.element.find('input').on('click', function () {
                that.element.trigger(that.name + ':filterclick');

                if (jQ3(this).prop('checked')) {
                    jQ3(this).closest('.legend-element').addClass('checked');
                } else {
                    jQ3(this).closest('.legend-element').removeClass('checked');
                }
            });

            this.element.find('input').on('synccheck', function () {
                if (jQ3(this).prop('checked')) {
                    jQ3(this).closest('.legend-element').addClass('checked');
                } else {
                    jQ3(this).closest('.legend-element').removeClass('checked');
                }
            });
        }
    }]);

    return MapLegend;
}(Element);
//# sourceMappingURL=MapLegend.js.map