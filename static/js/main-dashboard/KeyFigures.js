class KeyFigures extends Element {
    constructor() {
        super('<div id="key-figures-section"></div>');
        this.header = new Element('<header><h5>Key Events</h5></header>');
        this.keyFigureList = new Element('<div id="key-figures"></div>');
        this.childElements.push(this.header);
        this.childElements.push(this.keyFigureList);

        this.keyFigureTemplate = $('<div class="key-figure"><label></label><span class="number"><i class="fa fa-spinner fa-spin fa-fw"></i></span></div>');

    }
    process() {
        let numberOfEvents = this.keyFigureTemplate.clone();
        numberOfEvents.prop('id', 'number-of-events')
        numberOfEvents.find('label').text('Number of events:');
        //numberOfEvents.find('.number').text('0');

        let fatalities = this.keyFigureTemplate.clone();
        fatalities.prop('id', 'total-fatalities');
        fatalities.find('label').text('fatalities:');

        let numberOfCivilianDeaths = this.keyFigureTemplate.clone();
        numberOfCivilianDeaths.prop('id', 'number-of-civilian-deaths')
        numberOfCivilianDeaths.find('label').text('Number of civilian deaths:');

        let numberOfArmedActiveAgents = this.keyFigureTemplate.clone();
        numberOfArmedActiveAgents.prop('id', 'number-of-armed-active-agents');
        numberOfArmedActiveAgents.find('label').text('Number of armed active agents:');

        numberOfEvents.appendTo(this.keyFigureList.element);
        fatalities.appendTo(this.keyFigureList.element);
        numberOfCivilianDeaths.appendTo(this.keyFigureList.element);
        numberOfArmedActiveAgents.appendTo(this.keyFigureList.element);
        //this.keyFigureList.element
    }
}
