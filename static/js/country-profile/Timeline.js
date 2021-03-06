class Timeline extends Element {
    constructor() {
        super('<div id="timeline-container"></div>');

        this.header = new Element('<header><h4>Timeline</h4></header>');

        this.staticImage = new Element('<img id="timeline-static-image" hidden>');
        this.timelineElements = new Element('<div id="timeline-elements" hidden></div>');
        this.emptyElement = new Element('<div id="timeline-empty">Not available</div>');

        this.timelineElementTemplate = jQ3('<div class="timeline-element"><div class="number"><span></span></div><div class="description"><h5></h5><p></p></div><img></div>');

        this.childElements.push(this.header);
        this.childElements.push(this.staticImage);
        this.childElements.push(this.timelineElements);
        this.childElements.push(this.emptyElement);
    }

    getTimelineElement(num, title, descText, imgUri) {
        let elem = this.timelineElementTemplate.clone();
        elem.find('.number > span').text(num);
        elem.find('h5').text(title);
        elem.find('p').text(descText);

        if(imgUri && imgUri.length > 0) {
            elem.find('img').prop('src', imgUri);
        } else {
            elem.addClass('no-img');
        }
        return elem;
    }

    load(iso) {
        const that = this;

        jQ3.get({
            url: `${homeUrl}/?pagename=timeline_country__${iso}`,
            success: function(response) {
                let timelineData = JSON.parse(response);

                if (jQ3.isArray(timelineData) ) {
                    timelineData = {'staticImage': false, 'timelineElements': timelineData};
                }

                if (timelineData.staticImage) {
                    that.element.show();
                    that.staticImage.element.prop('src', timelineData.img);
                     
                    that.timelineElements.element[0].style.display = 'none';
                    that.emptyElement.element[0].style.display = 'none';
                    that.staticImage.element.show();
                    that.header.element[0].style.display = 'none';

                } else if(timelineData.timelineElements) {
                    that.element.show();
                    that.staticImage.element.prop('src', timelineData.img);
                    that.timelineElements.element.empty();
                    let timeElements = timelineData.timelineElements;
                    that.header.element[0].style.display = 'flex';


                    for(let i=0; i<timeElements.length; i++) {
                        let cd = timeElements[i];
                        that.getTimelineElement(cd.num, cd.title, cd.description, cd.img).appendTo(that.timelineElements.element);
                    }
                     
                    if (timeElements.length === 0) {
                        that.element.hide();
                        that.timelineElements.element[0].style.display = 'none';
                        that.staticImage.element.hide();
                        that.emptyElement.element[0].style.display = 'flex';
                    } else {
                        that.element.show();
                        that.staticImage.element.hide();
                        that.emptyElement.element[0].style.display = 'none';
                        that.timelineElements.element[0].style.display = 'flex';
                    }
                } else {
                    that.element.hide();
                    that.header.element[0].style.display = 'flex';
                    that.timelineElements.element[0].style.display = 'none';
                    that.staticImage.element.hide();
                    that.emptyElement.element[0].style.display = 'flex';
                }
            }
        });
    }
}
