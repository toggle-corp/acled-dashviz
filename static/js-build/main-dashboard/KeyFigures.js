'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var KeyFigures = function (_Element) {
    _inherits(KeyFigures, _Element);

    function KeyFigures() {
        _classCallCheck(this, KeyFigures);

        var _this = _possibleConstructorReturn(this, (KeyFigures.__proto__ || Object.getPrototypeOf(KeyFigures)).call(this, '<div id="key-figures-section"></div>'));

        _this.header = new Element('<header><h5>Key Figures</h5></header>');
        _this.keyFigureList = new Element('<div id="key-figures"></div>');
        _this.childElements.push(_this.header);
        _this.childElements.push(_this.keyFigureList);

        _this.keyFigureTemplate = jQ3('\n            <div class="key-figure">\n                <label></label>\n                <span class="number">\n                    <i class="fa fa-spinner fa-spin fa-fw"></i>\n                </span>\n            </div>\n        ');
        return _this;
    }

    _createClass(KeyFigures, [{
        key: 'load',
        value: function load(cp) {
            var numberOfEvents = this.keyFigureTemplate.clone();
            numberOfEvents.prop('id', 'number-of-events');
            numberOfEvents.find('label').text('Number of events:');
            numberOfEvents.find('.number').text(cp['number-of-events'] || '');

            var fatalities = this.keyFigureTemplate.clone();
            fatalities.prop('id', 'total-fatalities');
            fatalities.find('label').text('Fatalities:');
            fatalities.find('.number').text(cp.fatalities || '');

            var numberOfCivilianDeaths = this.keyFigureTemplate.clone();
            numberOfCivilianDeaths.prop('id', 'number-of-civilian-deaths');
            numberOfCivilianDeaths.find('label').text('Fatalities from civilian attacks:');
            numberOfCivilianDeaths.find('.number').text(cp['number-of-civilian-deaths'] || '');

            var numberOfArmedActiveAgents = this.keyFigureTemplate.clone();
            numberOfArmedActiveAgents.prop('id', 'number-of-armed-active-agents');
            numberOfArmedActiveAgents.find('label').text('Number of armed active agents:');
            numberOfArmedActiveAgents.find('.number').text(cp['number-of-armed-active-agents'] || '');

            this.keyFigureList.element.empty();
            numberOfEvents.appendTo(this.keyFigureList.element);
            fatalities.appendTo(this.keyFigureList.element);
            numberOfCivilianDeaths.appendTo(this.keyFigureList.element);
            numberOfArmedActiveAgents.appendTo(this.keyFigureList.element);
        }
    }]);

    return KeyFigures;
}(Element);
//# sourceMappingURL=KeyFigures.js.map