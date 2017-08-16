class Dashboard extends Element {
    constructor() {
        super('<div id="dashboard-container"></div>');
        this.mainDashboard = new MainDashboard();
        this.childElements.push(this.mainDashboard);
        this.countryProfile = new CountryProfile();
        this.childElements.push(this.countryProfile);
    }
     
    loadMainMap(data) {
        this.childElements[0].loadMap(data);
    }
     
    show(country) {
        this.countryProfile.show(country);
    }

    load() {
        this.mainDashboard.load();
    }
}
