class Timeline extends Element {
    constructor() {
        super('<div id="timeline-container"></div>')
        this.timelineElementTemplate = $('<div class="timeline-element"><div class="number"><span></span></div><div class="description"><h5></h5><p></p></div><img></div>');
    }

    getTimelineElement(num, title, descText, imgUri) {
        let elem = this.timelineElementTemplate.clone();
        elem.find('.number > span').text(num);
        elem.find('h5').text(title);
        elem.find('p').text(descText);
        elem.find('img').prop('src', imgUri);
        return elem;
    }

    process() {
        this.getTimelineElement("01", "Hello World", "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut",  pluginDir +'/static/img/chart2.png').appendTo(this.element);
        this.getTimelineElement("02", "Item 2", "sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",  pluginDir +'/static/img/chart1.png').appendTo(this.element);
        this.getTimelineElement("03", "Item 3", "dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.",  pluginDir +'/static/img/chart3.png').appendTo(this.element);

    }
}
