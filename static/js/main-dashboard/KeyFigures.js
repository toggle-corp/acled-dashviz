class KeyFigures extends Element {
    constructor () {
        super('<div id="key-figures-section"></div>');
        this.header = new Element('<header><h5>Key Figures</h5></header>');
        this.keyFigureList = new Element('<div id="key-figures"></div>');
        this.childElements.push(this.header);
        this.childElements.push(this.keyFigureList);

        this.keyFigureTemplate = $('<div class="key-figure"><label></label><span class="number"><i class="fa fa-spinner fa-spin fa-fw"></i></span></div>');

    }

    load (country, startDate, endDate) {
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
         
        $.ajax({
            method: 'GET',
            url: 'https://api.acleddata.com/acled/read',
            data: {
                'limit': '0',
                'country': country,
                'fields': 'fatalities|country|event_date'
            },
            success: function(response) {
                if(response && response.data) {
                    response.data = response.data.filter(x => compareCountryNames(x.country, country) && startDate <= (new Date(x.event_date)) && endDate >= (new Date(x.event_date)));
                     
                    numberOfEvents.find('.number').text(response.data.length.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","));
                     
                    fatalities.find('.number').text(response.data.length===0? '0': response.data.reduce(function(a, b){
                        return {'fatalities': +a.fatalities + (+b.fatalities)};
                    }).fatalities.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","));
                }
            }
        });
                
         
        $.ajax({
            method: 'GET',
            url: 'https://api.acleddata.com/acled/read',
            data: {
                'limit': '0',
                'country': country,
                'fields': 'inter1|inter2|fatalities|actor1|actor2|country|event_date'
            },
            success: function(response) {
                function isArmedActiveAgentCode(interCode) {
                    const armedActiveAgents = [1, 2, 3, 4, 8];
                    return (armedActiveAgents.indexOf(interCode) > -1);
                }

                if(response && response.data) {
                    const events = response.data.filter(x => compareCountryNames(x.country, country) && startDate <= (new Date(x.event_date)) && endDate >= (new Date(x.event_date)));
                    const civilianEvents = events.filter(x => x.inter1 == 7 || x.inter2 == 7);
                    const armedActiveAgentEvents = events.filter(x => {
                        return isArmedActiveAgentCode(+x.inter1) || isArmedActiveAgentCode(+x.inter2);
                    });

                    let totalCivilianDeaths = 0;
                    let armedActiveAgents = {};

                    for (let i=0; i<civilianEvents.length; i++) {
                        totalCivilianDeaths += +civilianEvents[i].fatalities;
                    }

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
                     
                    numberOfCivilianDeaths.find('.number').text(totalCivilianDeaths.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","));
                    numberOfArmedActiveAgents.find('.number').text(Object.keys(armedActiveAgents).length.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","));
                } else {
                    numberOfCivilianDeaths.find('.number').text('N/A');
                    numberOfArmedActiveAgents.find('.number').text('N/A');
                }

            },
            error: function(error) {
                console.log(error);
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

}
