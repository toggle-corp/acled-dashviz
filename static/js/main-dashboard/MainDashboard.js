class MainDashboard extends Element {
    constructor() {
        super('<div id="main-dashboard"></div>');
         
        this.header = new Element('<header><h2>Acled Dashboard</h2><button id="apply-filter-main-btn"><i class="fa fa-filter"></i>Apply filters</button></header>');
         
        this.leftSection = new Element('<div id="left-section"></div>');
        this.rightSection = new Element('<div id="right-section"></div>');

        this.childElements.push(this.header);
        this.childElements.push(this.leftSection);
        this.childElements.push(this.rightSection);

        this.dashboardMap = new DashboardMap();
        this.leftSection.childElements.push(this.dashboardMap);
        this.carousel = new Element(
            `
            <div id="carousel-container">
                <button id="carousel-left"><i class="fa fa-chevron-left"></i></button>
                <button id="carousel-right"><i class="fa fa-chevron-right"></i></button>
                <div class="carousel">
                </div>
                <div class="loader"><i class="fa fa-circle-o-notch fa-spin"></i></div>
            </div>
            `
        );
         
        this.leftSection.childElements.push(this.carousel);
        let imgContainer = this.carousel.element.find('.carousel');
         
        if (carouselImage1) {
            $('<a href="'+carouselUrl1+'" hidden><img src="'+ carouselImage1 +'"></a>').appendTo(imgContainer);
        }
        if (carouselImage2) {
            $('<a href="'+carouselUrl2+'" hidden><img src="'+ carouselImage2 +'"></a>').appendTo(imgContainer);
        }
        if (carouselImage3) {
            $('<a href="'+carouselUrl3+'" hidden><img src="'+ carouselImage3 +'"></a>').appendTo(imgContainer);
        }
        
        setTimeout(() => { imgContainer.find('a').eq(0).addClass('active').show(); }, 0);
        let leftButton = this.carousel.element.find('#carousel-left');
        let rightButton = this.carousel.element.find('#carousel-right');

        this.carousel.element.find('.loader').hide();

        let skipSlide = false;

        rightButton.on('click', function(e) {
            e.stopPropagation();

            let parent = $(this).closest('#carousel-container');

            parent.find('a.active').fadeOut(function(){
                $(this).removeClass('active');
                if( $(this).is(parent.find('a').last()) ){
                    parent.find('a').first().fadeIn().addClass('active');
                } else {
                    $(this).next().fadeIn().addClass('active');
                }
            });

            skipSlide = true;
        });

        leftButton.on('click', function(e) {
            e.stopPropagation();

            let parent = $(this).closest('#carousel-container');

            parent.find('a.active').fadeOut(function(){
                $(this).removeClass('active');
                if( $(this).is(parent.find('a').first()) ){
                    parent.find('a').last().fadeIn().addClass('active');
                } else {
                    $(this).prev().fadeIn().addClass('active');
                }
            });

            skipSlide = true;
        });

        // set carousel to automatically change in 5sec
        setInterval(function() {
            if(skipSlide) {
                skipSlide = false;
            } else {
                rightButton.click();
            }
        }, 5000);

        this.crisisProfile = new CrisisProfile();
        this.rightSection.childElements.push(this.crisisProfile);
         
        this.filterWrapper = new FilterWrapper('main');
        this.childElements.push(this.filterWrapper);
    }

    process() {
        let that = this;
         
        this.filterWrapper.init();
         
        this.header.element.find('#apply-filter-main-btn').on('click', function() {
            that.filterWrapper.show();
        });
         
        this.filterWrapper.element.find('.btn-apply-filter').on('click', function(){
            that.applyFilters();
            that.filterWrapper.hide();
        });
         
        this.filterWrapper.element.find('.btn-cancel').on('click', function(){
            that.filterWrapper.hide();
        });
         
        this.filterWrapper.element.find('.btn-reset').on('click', function(){
            that.filterWrapper.init();
        });

    }
     

    applyFilters() {
        this.filteredData = $.extend(true, {}, this.data);
    }
     
    filterByEvents() {
        let container = this.filterWrapper.element.find('.filter-event-type .content');
        let requiredEvents = container.find('input[type="checkbox"]:checked').map(function() {
            return $(this).data('target');
        }).get();

        this.filteredData = this.filteredData.filter(x => requiredEvents.find(y => compareEvents(x.event_type, y)));
    }

    filterByInteraction() {
        let container = this.filterWrapper.element.find('.filter-interaction .content');
        let lowerLimit = 0;
        let upperLimit = 0;

        switch(container.find('input[type="radio"]:checked').data('value')) {
            case 'less than 100':
                lowerLimit = 0;
                upperLimit = 100;
                break;
            case '100 - 1000':
                lowerLimit = 100;
                upperLimit = 1000;
                break;
            case '1000 - 10000':
                lowerLimit = 1000;
                upperLimit = 10000;
                break;
            case 'more than 10000':
                lowerLimit = 1000;
                upperLimit = Infinity;
                break;
            case 'all':
                lowerLimit = 0;
                upperLimit = Infinity;
                break;
        }

        this.filteredData = this.filteredData.filter(x => x.interaction >= lowerLimit && x.interaction < upperLimit);

    }

    filterByFatalities() {
        let container = this.filterWrapper.element.find('.filter-fatalities .content');
        let lowerLimit = 0;
        let upperLimit = 0;

        switch(container.find('input[type="radio"]:checked').data('value')) {
            case 'less than 100':
                lowerLimit = 0;
                upperLimit = 100;
                break;
            case '100 - 1000':
                lowerLimit = 100;
                upperLimit = 1000;
                break;
            case '1000 - 10000':
                lowerLimit = 1000;
                upperLimit = 10000;
                break;
            case '10000 - 100000':
                lowerLimit = 10000;
                upperLimit = 100000;
                break;
            case 'more than 10000':
                lowerLimit = 1000;
                upperLimit = Infinity;
                break;
            case 'all':
                lowerLimit = 0;
                upperLimit = Infinity;
                break;
        }

        this.filteredData = this.filteredData.filter(x => x.fatalities >= lowerLimit && x.fatalities < upperLimit);

    }

    filterByYear() {
        let container = this.filterWrapper.element.find('.filter-year');

        let startYear = container.find('.start-year').val(); 
        startYear = startYear? (new Date(startYear)) : (new Date(0));

        let endYear = container.find('.end-year').val();
        endYear = endYear? (new Date(endYear)) : (new Date());

        function isDateYearInRange(d, d1, d2) {
            return d.getFullYear() >= d1.getFullYear() && d.getFullYear() <= d2.getFullYear();
        }

        this.filteredData = this.filteredData.filter(x => {
            return isDateYearInRange((new Date(x.year)), startYear, endYear);
        });
    }    

    loadMap() {
        this.dashboardMap.loadDataToMap();
    }

    load() {
        this.crisisProfile.load();
    }
}
