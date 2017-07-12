class KeyFigures extends Element {
    constructor () {
        super('<div id="key-figures-section"></div>');
        this.header = new Element('<header><h5>Key Events</h5></header>');
        this.keyFigureList = new Element('<div id="key-figures"></div>');
        this.childElements.push(this.header);
        this.childElements.push(this.keyFigureList);

        this.keyFigureTemplate = $('<div class="key-figure"><label></label><span class="number"><i class="fa fa-spinner fa-spin fa-fw"></i></span></div>');

    }

    load (country) {
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
         
        $.ajax({
            method: 'GET',
            url: 'https://api.acleddata.com/acled/read',
            data: {
                'limit': '0',
                'country': country,
                'fields': 'fatalities'
            },
            success: function(response) {
                if(response && response.data) {
                    numberOfEvents.find('.number').text(response.data.length);
                     
                    fatalities.find('.number').text(response.data.length===0? '0': response.data.reduce(function(a, b){
                        return {'fatalities': +a.fatalities + (+b.fatalities)};
                    }).fatalities);
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
                'fields': 'fatalities|actor1|actor2'
            },
            success: function(response) {
                if(response && response.data) {
                    let totalCivilianDeaths = 0;
                    let armedActiveAgents = {};

                    for (let i=0; i<response.data.length; i++) {
                        let cd = response.data[i];
                         
                        totalCivilianDeaths += +cd.fatalities;

                        if(cd.actor1) {
                            if(!armedActiveAgents[cd.actor1]) {
                                armedActiveAgents[cd.actor1] = 0;
                            }

                            ++armedActiveAgents[cd.actor1];
                        }

                        if(cd.actor2) {
                            if(!armedActiveAgents[cd.actor2]) {
                                armedActiveAgents[cd.actor2] = 0;
                            }
                            ++armedActiveAgents[cd.actor2];
                        }
                    }
                    numberOfCivilianDeaths.find('.number').text(totalCivilianDeaths);
                    numberOfArmedActiveAgents.find('.number').text(Object.keys(armedActiveAgents).length);
                } else {
                    numberOfCivilianDeaths.find('.number').text('N/A');
                }

            },
            error: function(error) {
                console.log(error);
                numberOfCivilianDeaths.find('.number').text('N/A');
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
