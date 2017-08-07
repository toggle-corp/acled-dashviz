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

        _this.keyFigureTemplate = $('<div class="key-figure"><label></label><span class="number"><i class="fa fa-spinner fa-spin fa-fw"></i></span></div>');

        return _this;
    }

    _createClass(KeyFigures, [{
        key: 'load',
        value: function load(country, startDate, endDate) {
            //let countryData = acledData.filter(x => compareCountryNames(x.country, country));

            var numberOfEvents = this.keyFigureTemplate.clone();
            numberOfEvents.prop('id', 'number-of-events');
            numberOfEvents.find('label').text('Number of events:');

            var fatalities = this.keyFigureTemplate.clone();
            fatalities.prop('id', 'total-fatalities');
            fatalities.find('label').text('fatalities:');

            var numberOfCivilianDeaths = this.keyFigureTemplate.clone();
            numberOfCivilianDeaths.prop('id', 'number-of-civilian-deaths');
            numberOfCivilianDeaths.find('label').text('Number of civilian deaths:');

            var numberOfArmedActiveAgents = this.keyFigureTemplate.clone();
            numberOfArmedActiveAgents.prop('id', 'number-of-armed-active-agents');
            numberOfArmedActiveAgents.find('label').text('Number of armed active agents:');

            startDate = new Date(startDate ? startDate : 0);
            endDate = endDate ? new Date(endDate) : new Date();

            $.ajax({
                method: 'GET',
                url: 'https://api.acleddata.com/acled/read',
                data: {
                    'limit': '0',
                    'country': country,
                    'fields': 'fatalities|country|event_date'
                },
                success: function success(response) {
                    if (response && response.data) {
                        response.data = response.data.filter(function (x) {
                            return compareCountryNames(x.country, country) && startDate <= new Date(x.event_date) && endDate >= new Date(x.event_date);
                        });

                        numberOfEvents.find('.number').text(response.data.length.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","));

                        fatalities.find('.number').text(response.data.length === 0 ? '0' : response.data.reduce(function (a, b) {
                            return { 'fatalities': +a.fatalities + +b.fatalities };
                        }).fatalities.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","));
                    }
                }
            });

            $.ajax({
                method: 'GET',
                url: 'https://api.acleddata.com/acled/read',
                data: {
                    'limit': '0',
                    'INTER1': '7:OR:INTER2=7',
                    'country': country,
                    'fields': 'fatalities|actor1|actor2|country|event_date'
                },
                success: function success(response) {
                    if (response && response.data) {
                        response.data = response.data.filter(function (x) {
                            return compareCountryNames(x.country, country) && startDate <= new Date(x.event_date) && endDate >= new Date(x.event_date);
                        });

                        var totalCivilianDeaths = 0;
                        var armedActiveAgents = {};

                        for (var i = 0; i < response.data.length; i++) {
                            var cd = response.data[i];

                            totalCivilianDeaths += +cd.fatalities;

                            if (cd.actor1) {
                                if (!armedActiveAgents[cd.actor1]) {
                                    armedActiveAgents[cd.actor1] = 0;
                                }

                                ++armedActiveAgents[cd.actor1];
                            }

                            if (cd.actor2) {
                                if (!armedActiveAgents[cd.actor2]) {
                                    armedActiveAgents[cd.actor2] = 0;
                                }
                                ++armedActiveAgents[cd.actor2];
                            }
                        }

                        numberOfCivilianDeaths.find('.number').text(totalCivilianDeaths.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","));
                        numberOfArmedActiveAgents.find('.number').text(Object.keys(armedActiveAgents).length.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","));
                    } else {
                        numberOfCivilianDeaths.find('.number').text('N/A');
                        numberOfArmedActiveAgents.find('.number').text('N/A');
                    }
                },
                error: function error(_error) {
                    console.log(_error);
                    numberOfCivilianDeaths.find('.number').text('N/A');
                    numberOfArmedActiveAgents.find('.number').text('N/A');
                }
            });

            this.keyFigureList.element.empty();

            numberOfEvents.appendTo(this.keyFigureList.element);
            fatalities.appendTo(this.keyFigureList.element);
            numberOfCivilianDeaths.appendTo(this.keyFigureList.element);
            numberOfArmedActiveAgents.appendTo(this.keyFigureList.element);
            //this.keyFigureList.element
        }
    }]);

    return KeyFigures;
}(Element);
//# sourceMappingURL=KeyFigures.js.map