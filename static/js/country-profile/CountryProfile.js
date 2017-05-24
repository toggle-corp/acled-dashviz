class CountryProfile extends Element {
    constructor() {
        super('<div id="country-profile"></div>');
        this.header = new Element('<header><h3><a id="back-btn" class="fa fa-arrow-left"></a><span id="country-name">Country_name</span></h3></header>');
        this.childElements.push(this.header);

        this.countryMap = new CountryMap;
        this.childElements.push(this.countryMap);

        this.childElements.push(new CountryReport);

        this.childElements.push(new Timeline);

        this.timeSeries = new TimeSeries;
        this.childElements.push(this.timeSeries);

        this.barChart = new BarChart;
        this.childElements.push(this.barChart);

        let that = this;
        this.header.element.find('a').on('click', function() {
            that.hide();
        });
    }
    show(country) {
        this.element.css('display', 'flex');
        this.header.element.find('#country-name').text(country);
        this.timeSeries.load(country);
        this.barChart.load(country);
        this.countryMap.load(country);
    }
    hide() {
        this.element.css('display', 'none');
    }
}
