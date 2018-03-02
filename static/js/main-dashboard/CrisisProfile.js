class CrisisProfile extends Element {
    constructor() {
        super('<div id="crisis-profile-container"></div>');
        jQ3('<header><h4>Crisis profile</h4></header>').appendTo(this.element);
        this.reportSection = new Element('<div id="report-section"></div>');
        this.keyFiguresSection = new KeyFigures();

        this.reportSelectContainer = new Element(`
            <div class="select-wrapper">
                <i class="fa fa-search"></i>
                <select id="report-search" placeholder="Select an event"></select>
            </div>
        `);

        this.reportDetailContainer = new Element(`
            <div id="report">
                <div class="report-header">
                    <h5 class="title"></h5>
                    <date></date>
                </div>
                <div class="description"></div>
            <div>
        `);

        this.recentEventsSection = new Element(`
            <div id="recent-events-section">
                <a hidden><img alt="Profile image"></a>
                <div id="report-image-empty">Profile image not available</div>
            </div>
        `);

        // this.crisisProfileMap = new CrisisProfileMap();
        this.loadingAnimation = new LoadingAnimation();

        this.childElements.push(this.reportSelectContainer);
        this.reportSection.childElements.push(this.reportDetailContainer);

        this.childElements.push(this.reportSection);
        this.childElements.push(this.keyFiguresSection);
        this.childElements.push(this.recentEventsSection);

        // this.crisisProfileMap.element.appendTo(this.reportDetailContainer.element.find('.map'));
        this.childElements.push(this.loadingAnimation);
    }

    loadCrisisProfile(cp) {
        this.reportDetailContainer.element.find('.title').text(cp.title).prop('title', cp.title);
        if (cp['end-date'] ) {
            this.reportDetailContainer.element.find('date').text(cp.date + ' to ' + cp['end-date']);
        } else {
            this.reportDetailContainer.element.find('date').text(cp.date + ' (ongoing)');
        }
        this.reportDetailContainer.element.find('.description').text(cp.description);
        // this.crisisProfileMap.load(cp.country);
    }

    process() {
        let that = this;
        // this.crisisProfileMap.process();

        for(let i=0; i<crisisProfiles.length; i++) {
            crisisProfiles[i].id = i;
        }

        jQ3('#report-search').selectize({
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
                            <div class="country">${escape(acledCountriesISO[item.country] || '-')}</div>
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

        this.loadingAnimation.show();
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
            this.recentEventsSection.element.find('a').css('display', 'flex');
        } else {
            this.recentEventsSection.element.find('img').prop('src', '').addClass('no-img');
            this.recentEventsSection.element.find('a').css('display', 'none');
            this.recentEventsSection.element.find('#report-image-empty').css('display', 'flex');
        }
    }

    load() {
        this.loadingAnimation.hide();

        if(crisisProfiles.length > 0) {
            this.renderData(0);
        }
    }
}
