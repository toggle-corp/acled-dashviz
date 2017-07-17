class MainDashboard extends Element {
    constructor() {
        super('<div id="main-dashboard"></div>');
        this.leftSection = new Element('<div id="left-section"></div>');
        this.rightSection = new Element('<div id="right-section"></div>');

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
    }
     
    loadMap() {
        this.dashboardMap.loadDataToMap();
    }

    load() {
        this.crisisProfile.load();
    }
}
