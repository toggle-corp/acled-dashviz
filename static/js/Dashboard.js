class Dashboard extends Element {
    constructor() {
        super('<div id="dashboard"></div>');
        this.childElements.push(new MainDashboard);
        this.countryProfile = new CountryProfile;
        this.childElements.push(this.countryProfile);
    }
    loadMainMap() {
        this.childElements[0].loadMap();
    }
    show(country) {
        this.countryProfile.show(country);
    }
}
