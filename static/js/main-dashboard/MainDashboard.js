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
            </div>
            `
        );
        this.leftSection.childElements.push(this.carousel);
        let imgContainer = this.carousel.element.find('.carousel');
        if(carouselData) {
            for(let imgSrc in carouselData) {
                if(carouselData[imgSrc]) {
                    $('<img src="'+ carouselData[imgSrc] +'" hidden>').appendTo(imgContainer);
                }
            }
        }
        imgContainer.find('img').eq(0).addClass('active').show();
        // $('<img class="active" src="'+ pluginDir +'/static/img/chart1.png">').appendTo(imgContainer);
        // $('<img src="'+ pluginDir +'/static/img/chart2.png" hidden>').appendTo(imgContainer);
        // $('<img src="'+ pluginDir +'/static/img/chart3.png" hidden>').appendTo(imgContainer);

        let leftButton = this.carousel.element.find('#carousel-left');
        let rightButton = this.carousel.element.find('#carousel-right');

        let skipSlide = false;

        rightButton.on('click', function() {
            let parent = $(this).closest('#carousel-container');

            parent.find('img.active').fadeOut(function(){
                $(this).removeClass('active');
                if( $(this).is(parent.find('img').last()) ){
                    parent.find('img').first().fadeIn().addClass('active');
                } else {
                    $(this).next().fadeIn().addClass('active');
                }
            });

            skipSlide = true;
        });

        leftButton.on('click', function() {
            let parent = $(this).closest('#carousel-container');

            parent.find('img.active').fadeOut(function(){
                $(this).removeClass('active');
                if( $(this).is(parent.find('img').first()) ){
                    parent.find('img').last().fadeIn().addClass('active');
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
}
