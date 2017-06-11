class MapLegend extends Element {
    constructor() {
        super('<div class="legend"></div>');
        this.element.append('<header><h4></h4></header><div class="legend-elements"></div>');
        this.legendElementTemplate = $('<div class="legend-element"><div class="color-box"></div><label></label></div>');
    }
    setTitle(title){
        this.element.find('h4').text(title);
    }
    addLegendElement(color, label){
        let legendElementsContainer = this.element.find('.legend-elements');
        let legendElement = this.legendElementTemplate.clone();
        legendElement.find('.color-box').css('background-color', color);
        legendElement.find('label').text(label);
        legendElement.appendTo(legendElementsContainer);
    }
    clearLegendElements() {
        this.element.find('.legend-elements').empty();
    }
}
