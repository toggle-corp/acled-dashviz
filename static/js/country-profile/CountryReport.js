class CountryReport extends Element {
    constructor() {
        super('<div id="country-report-container"></div>');

        this.header = new Element('<header><h4>Reports</h4></header>')

        this.childElements.push(this.header);
    }
}
