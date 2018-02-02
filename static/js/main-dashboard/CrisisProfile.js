class CrisisProfile extends Element {
    constructor() {
        super('<div id="crisis-profile-container"></div>');
        $('<header><h4>Crisis profile</h4></header>').appendTo(this.element);
        this.reportSection = new Element('<div id="report-section"></div>');
        this.keyFiguresSection = new KeyFigures();
        this.recentEventsSection = new Element(
            `
            <div id="recent-events-section">
                <header></header>
                <a hidden><img alt="Report image"></a>
                <div id="report-image-empty">Not available</div>
            </div>
            `
        );
        if(recentEvent) {

        }

        this.reportSelectContainer = new Element(
            `
            <div class="select-wrapper">
                <i class="fa fa-search"></i>
                <select id="report-search" placeholder="Select an event"></select>
            </div>
            `
        );

        this.reportDetailContainer = new Element(
            `
            <div id="report">
                <div class="detail">
                    <h5 class="title"></h5>
                    <date></date>
                    <div class="description"></div>
                </div>
                <div class="map">
                </div>
            <div>
            `
        );

        this.crisisProfileMap = new CrisisProfileMap();

        this.childElements.push(this.reportSelectContainer);
        this.reportSection.childElements.push(this.reportDetailContainer);

        this.childElements.push(this.reportSection);
        this.childElements.push(this.keyFiguresSection);
        this.childElements.push(this.recentEventsSection);

        this.crisisProfileMap.element.appendTo(this.reportDetailContainer.element.find('.map'));
    }

    loadCrisisProfile(cp) {
        this.reportDetailContainer.element.find('.title').text(cp.title).prop('title', cp.title);
        if (cp['end-date'] ) {
            this.reportDetailContainer.element.find('date').text(cp.date + ' to ' + cp['end-date']);
        } else {
            this.reportDetailContainer.element.find('date').text(cp.date + ' (ongoing)');
        }
        this.reportDetailContainer.element.find('.description').text(cp.description);
        this.crisisProfileMap.load(cp.country);
    }

    process() {
        let that = this;
        this.crisisProfileMap.process();

        for(let i=0; i<crisisProfiles.length; i++) {
            crisisProfiles[i].id = i;
        }

        $('#report-search').selectize({
            valueField: 'id',
            labelField: 'title',
            searchField: ['title', 'country'],
            maxOptions: 5,
            options: crisisProfiles,
            create: false,
            closeAfterSelect: true,
            //openOnFocus: false,
            render: {
                option: function(item, escape) {
                    return `
                        <div class="crisis-profile-select-item">
                            <div class="title">${escape(item.title)}</div>
                            <div class="country">${escape(acledCountriesISO[item.country])}</div>
                        </div>
                    `;
                }
            },
            onChange: function(val) {
                if(val) {
                    that.renderData(val);
                }
            }
        });

    }

    renderData(index) {
        let cp = crisisProfiles[index];
         
        this.loadCrisisProfile(cp);
        // this.keyFiguresSection.load(cp.country, cp.date, cp['end-date']);
        this.keyFiguresSection.load(cp);
         
        if(cp['recent-event-url']) {
            this.recentEventsSection.element.find('a').prop('href', cp['recent-event-url']).css('display', 'block');
        } else {
            this.recentEventsSection.element.find('a').prop('href', '#').css('display', 'none');
        }

        if(cp['recent-event-img']) {
            this.recentEventsSection.element.find('img').prop('src', cp['recent-event-img']).removeClass('no-img');
            this.recentEventsSection.element.find('#report-image-empty').css('display', 'none');
            this.recentEventsSection.element.find('a').css('display', 'block');
        } else {
            this.recentEventsSection.element.find('img').prop('src', '').addClass('no-img');
            this.recentEventsSection.element.find('a').css('display', 'none');
            this.recentEventsSection.element.find('#report-image-empty').css('display', 'flex');
        }
    }

    load() {
        if(crisisProfiles.length > 0) {
            this.renderData(0);
        }
    }
}
