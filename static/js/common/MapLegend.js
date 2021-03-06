class MapLegend extends Element {
    constructor() {
        super('<div class="legend"></div>');
        this.element.append('<div class="legend-elements"></div>');
        this.legendElementTemplate = jQ3('<label class="legend-element checked"><input type="checkbox" checked><span class="color-box"></span><span class="name"><span/></label>');
    }
     
    addLegendElement(color, label){
        let legendElementsContainer = this.element.find('.legend-elements');
        let legendElement = this.legendElementTemplate.clone();
        legendElement.find('.color-box').css('background-color', color);
        legendElement.find('input').attr('data-target', label);
        legendElement.find('.name').text(label);
        legendElement.appendTo(legendElementsContainer);
    }
     
    clearLegendElements() {
        this.element.find('.legend-elements').empty();
    }
     
    fillAcledEvents(name="legend") {
        this.name = name;
        this.clearLegendElements();
         
        let orderedAcledEvents = getSortedAcledEvents();
        for (let i=0; i<orderedAcledEvents.length; i++) {
            this.addLegendElement(getEventColor(orderedAcledEvents[i]), orderedAcledEvents[i]);
        }
         
        let that = this;
        this.element.find('input').on('click', function() {
            that.element.trigger(`${that.name}:filterclick`);

            if (jQ3(this).prop('checked')) {
                jQ3(this).closest('.legend-element').addClass('checked');
            } else {
                jQ3(this).closest('.legend-element').removeClass('checked');
            }
        });
         
        this.element.find('input').on('synccheck', function() {
            if (jQ3(this).prop('checked')) {
                jQ3(this).closest('.legend-element').addClass('checked');
            } else {
                jQ3(this).closest('.legend-element').removeClass('checked');
            }
        });
    }
}
