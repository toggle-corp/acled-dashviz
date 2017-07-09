class CountryProfile extends Element {
    constructor() {
        super('<div id="country-profile"></div>');
        this.scrollWrapper = new Element('<div class="scroll-wrapper"></div>');
        this.childElements.push(this.scrollWrapper);

        this.header = new Element('<header><h3><a id="back-btn" class="fa fa-arrow-left"></a><span id="country-name">Country_name</span></h3></header>');
        this.scrollWrapper.childElements.push(this.header);

        this.countryMap = new CountryMap();
        this.scrollWrapper.childElements.push(this.countryMap);

        this.countryReport = new CountryReport();
        this.scrollWrapper.childElements.push(this.countryReport);

        this.timeSeries = new TimeSeries();
        this.scrollWrapper.childElements.push(this.timeSeries);

        this.barChart = new BarChart();
        this.scrollWrapper.childElements.push(this.barChart);

        this.timeline = new Timeline();
        this.scrollWrapper.childElements.push(this.timeline);

        let that = this;
        this.header.element.find('a').on('click', function() {
            that.hide();
        });
    }
    show(country) {
        $('html').css('overflow', 'hidden');
        this.element.show();
        this.header.element.find('#country-name').text(country);
        this.countryMap.load(country);
        this.countryReport.load(country);
        this.timeSeries.load(country);
        this.barChart.load(country);
        this.timeline.load(country);
    }
    hide() {
        $('html').css('overflow', 'auto');
        this.element.hide();
    }
}
