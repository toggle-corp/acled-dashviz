class Dashboard extends Element {
    constructor() {
        super('<div id="dashboard-container"></div>');
        this.mainDashboard = new MainDashboard();
        this.childElements.push(this.mainDashboard);
        this.countryProfile = new CountryProfile();
        this.childElements.push(this.countryProfile);

        window.addEventListener('hashchange', () => {
            const hash = window.location.hash;

            if (hash) {
                const iso = hash.substr(1);
                
                if (acledCountriesISO[iso]) {
                    this.countryProfile.show(iso);
                } else {
                    window.location.hash = '';
                }
            } else {
                this.countryProfile.hide();
            }
        });
    }
     
    /*
    loadMainMap(data) {
        this.childElements[0].loadMap(data);
    }
    */
     
    show(iso) {
        window.location.hash = iso;
        // this.countryProfile.show(iso);
    }

    loadData(data) {
        this.mainDashboard.loadData(data);

        const hash = window.location.hash;
        if () {
            if (hash) {
                const iso = hash.substr(1);
                
                if (acledCountriesISO[iso]) {
                    this.countryProfile.show(iso);
                } else {
                    window.location.hash = '';
                }
            }
        }
    }
}
