class Timeline extends Element {
    constructor() {
        super('<div id="timeline-container"></div>');
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

    load(country) {
        this.element.empty();

        let that = this;
        $.ajax({
            type: 'GET',
            url: homeUrl+'/?pagename=timeline_country__'+country,
            success: function(response) {
                let timeElements = JSON.parse(response);

                for(let i=0; i<timeElements.length; i++) {
                    let cd = timeElements[i];
                    that.getTimelineElement(cd.num, cd.title, cd.description, cd.img).appendTo(that.element);
                }
            }
        });
    }
}
