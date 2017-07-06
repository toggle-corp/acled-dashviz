class Dashboard extends Element {
    constructor() {
        super('<div id="dashboard"></div>');
        this.mainDashboard = new MainDashboard();
        this.childElements.push(this.mainDashboard);
        this.countryProfile = new CountryProfile();
        this.childElements.push(this.countryProfile);
    }
     
    loadMainMap() {
        this.childElements[0].loadMap();
    }
     
    show(country) {
        this.countryProfile.show(country);
    }

    load() {
        this.mainDashboard.load();
    }
}
