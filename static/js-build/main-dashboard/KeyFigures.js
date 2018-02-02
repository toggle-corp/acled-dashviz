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

    /*
    load (iso, startDate, endDate) {
        const country = acledCountriesISO[iso];
        //let countryData = acledData.filter(x => compareCountryNames(x.country, country));
        
        let numberOfEvents = this.keyFigureTemplate.clone();
        numberOfEvents.prop('id', 'number-of-events');
        numberOfEvents.find('label').text('Number of events:');
         let fatalities = this.keyFigureTemplate.clone();
        fatalities.prop('id', 'total-fatalities');
        fatalities.find('label').text('fatalities:');
         let numberOfCivilianDeaths = this.keyFigureTemplate.clone();
        numberOfCivilianDeaths.prop('id', 'number-of-civilian-deaths');
        numberOfCivilianDeaths.find('label').text('Number of civilian deaths:');
         
        let numberOfArmedActiveAgents = this.keyFigureTemplate.clone();
        numberOfArmedActiveAgents.prop('id', 'number-of-armed-active-agents');
        numberOfArmedActiveAgents.find('label').text('Number of armed active agents:');
         startDate = new Date(startDate? startDate: 0);
        endDate = endDate? (new Date(endDate)) : (new Date());
         
        const crisisProfileFields = [
            'iso',
            'actor1',
            'actor2',
            'event_date',
            'fatalities',
            'inter1',
            'inter2',
        ];
         const urlForCrisisProfileData = createUrlForAPI({
            limit: '0',
            // iso,
            country,
            fields: crisisProfileFields.join('|'),
        });
         const isDateInRange = (d, d1, d2) => (d1 <= (new Date(d)) && d2 >= (new Date(d)));
        const formatNumber = num => num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        const isArmedActiveAgentCode = (interCode) => {
            const armedActiveAgents = [1, 2, 3, 4, 8];
            return (armedActiveAgents.indexOf(interCode) > -1);
        }
         d3.csv(urlForCrisisProfileData, function(data) {
            if (data) {
                const requiredData = data.filter(
                    x => (x.iso === iso && isDateInRange(x.event_date, startDate, endDate))
                );
                 const numEvents = formatNumber(requiredData.length);
                numberOfEvents.find('.number').text(numEvents);
                 let totalFatalities = 0;
                if (requiredData.length > 0) {
                    totalFatalities = requiredData.reduce((a, b) => (
                        {'fatalities': +a.fatalities + (+b.fatalities)}
                    )).fatalities;
                }
                fatalities.find('.number').text(formatNumber(totalFatalities));
                 const civilianEvents = requiredData.filter(x => x.inter1 == 7 || x.inter2 == 7);
                let totalCivilianDeaths = 0;
                for (let i=0; i<civilianEvents.length; i++) {
                    totalCivilianDeaths += +civilianEvents[i].fatalities;
                }
                numberOfCivilianDeaths.find('.number').text(formatNumber(totalCivilianDeaths));
                 const armedActiveAgentEvents = requiredData.filter(x => (
                    isArmedActiveAgentCode(+x.inter1) || isArmedActiveAgentCode(+x.inter2)
                ));
                 let armedActiveAgents = {};
                for (let i=0; i<armedActiveAgentEvents.length; i++) {
                    let cd = armedActiveAgentEvents[i];
                     if(isArmedActiveAgentCode(+cd.inter1) && cd.actor1) {
                        if(!armedActiveAgents[cd.actor1]) {
                            armedActiveAgents[cd.actor1] = 0;
                        }
                         ++armedActiveAgents[cd.actor1];
                    }
                     if(isArmedActiveAgentCode(+cd.inter2) && cd.actor2) {
                        if(!armedActiveAgents[cd.actor2]) {
                            armedActiveAgents[cd.actor2] = 0;
                        }
                        ++armedActiveAgents[cd.actor2];
                    }
                }
                 const totalArmedActiveAgents = Object.keys(armedActiveAgents).length;
                numberOfArmedActiveAgents.find('.number').text(formatNumber(totalArmedActiveAgents));
            }
        });
                
        this.keyFigureList.element.empty();
        numberOfEvents.appendTo(this.keyFigureList.element);
        fatalities.appendTo(this.keyFigureList.element);
        numberOfCivilianDeaths.appendTo(this.keyFigureList.element);
        numberOfArmedActiveAgents.appendTo(this.keyFigureList.element);
    }
    */


    _createClass(KeyFigures, [{
        key: 'load',
        value: function load(cp) {
            var numberOfEvents = this.keyFigureTemplate.clone();
            numberOfEvents.prop('id', 'number-of-events');
            numberOfEvents.find('label').text('Number of events:');
            numberOfEvents.find('.number').text(cp['number-of-events'] || '');

            var fatalities = this.keyFigureTemplate.clone();
            fatalities.prop('id', 'total-fatalities');
            fatalities.find('label').text('fatalities:');
            fatalities.find('.number').text(cp.fatalities || '');

            var numberOfCivilianDeaths = this.keyFigureTemplate.clone();
            numberOfCivilianDeaths.prop('id', 'number-of-civilian-deaths');
            numberOfCivilianDeaths.find('label').text('Number of civilian deaths:');
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