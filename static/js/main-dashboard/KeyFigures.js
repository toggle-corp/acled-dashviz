class KeyFigures extends Element {
    constructor () {
        super('<div id="key-figures-section"></div>');
        this.header = new Element('<header><h5>Key Figures</h5></header>');
        this.keyFigureList = new Element('<div id="key-figures"></div>');
        this.childElements.push(this.header);
        this.childElements.push(this.keyFigureList);

        this.keyFigureTemplate = $('<div class="key-figure"><label></label><span class="number"><i class="fa fa-spinner fa-spin fa-fw"></i></span></div>');
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
    load (cp) {
        let numberOfEvents = this.keyFigureTemplate.clone();
        numberOfEvents.prop('id', 'number-of-events');
        numberOfEvents.find('label').text('Number of events:');
        numberOfEvents.find('.number').text(cp['number-of-events'] || '');

        let fatalities = this.keyFigureTemplate.clone();
        fatalities.prop('id', 'total-fatalities');
        fatalities.find('label').text('fatalities:');
        fatalities.find('.number').text(cp.fatalities || '');

        let numberOfCivilianDeaths = this.keyFigureTemplate.clone();
        numberOfCivilianDeaths.prop('id', 'number-of-civilian-deaths');
        numberOfCivilianDeaths.find('label').text('Number of civilian deaths:');
        numberOfCivilianDeaths.find('.number').text(cp['number-of-civilian-deaths'] || '');
         
        let numberOfArmedActiveAgents = this.keyFigureTemplate.clone();
        numberOfArmedActiveAgents.prop('id', 'number-of-armed-active-agents');
        numberOfArmedActiveAgents.find('label').text('Number of armed active agents:');
        numberOfArmedActiveAgents.find('.number').text(cp['number-of-armed-active-agents'] || '');

                
        this.keyFigureList.element.empty();
        numberOfEvents.appendTo(this.keyFigureList.element);
        fatalities.appendTo(this.keyFigureList.element);
        numberOfCivilianDeaths.appendTo(this.keyFigureList.element);
        numberOfArmedActiveAgents.appendTo(this.keyFigureList.element);
    }
}
