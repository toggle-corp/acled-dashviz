class Timeline extends Element {
    constructor() {
        super('<div id="timeline-container"></div>');

        this.staticImage = new Element('<img id="timeline-static-image" hidden>');
        this.timelineElements = new Element('<div id="timeline-elements"></div>');

        this.timelineElementTemplate = $('<div class="timeline-element"><div class="number"><span></span></div><div class="description"><h5></h5><p></p></div><img></div>');

        this.childElements.push(this.staticImage);
        this.childElements.push(this.timelineElements);
    }

    getTimelineElement(num, title, descText, imgUri) {
        let elem = this.timelineElementTemplate.clone();
        elem.find('.number > span').text(num);
        elem.find('h5').text(title);
        elem.find('p').text(descText);
        elem.find('img').prop('src', imgUri);
        return elem;
    }

    load(country) {
        let that = this;
        $.ajax({
            type: 'GET',
            url: homeUrl+'/?pagename=timeline_country__'+country,
            success: function(response) {
                let timelineData = JSON.parse(response);

                if ($.isArray(timelineData) ) {
                    timelineData = {'staticImage': false, 'timelineElements': timelineData};
                }


                if (timelineData.staticImage) {
                    that.staticImage.element.prop('src', timelineData.img);
                     
                    that.timelineElements.element[0].style.display = 'none';
                    that.staticImage.element.show();

                } else if(timelineData.timelineElements) {
                    that.timelineElements.element.empty();
                     
                    let timeElements = timelineData.timelineElements;

                    for(let i=0; i<timeElements.length; i++) {
                        let cd = timeElements[i];
                        that.getTimelineElement(cd.num, cd.title, cd.description, cd.img).appendTo(that.timelineElements.element);
                    }
                     
                    that.staticImage.element.hide();
                    that.timelineElements.element[0].style.display = 'flex';
                }
            }
        });
    }
}
