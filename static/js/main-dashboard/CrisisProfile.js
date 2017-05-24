class CrisisProfile extends Element {
    constructor() {
        super('<div id="crisis-profile-container"></div>');
        $('<header><h4>Crisis profile</h4></header>').appendTo(this.element);
        this.reportSection = new Element('<div id="report-section"></div>');
        this.keyFiguresSection = new KeyFigures();
        this.recentEventsSection = new Element(
            `
            <div id="recent-events-section">
                <header><h5>Recent events</h5></header>
                <a><img alt="Report image"></a>
            </div>
            `
        );

        this.reportSelectContainer = new Element(
            `
            <div class="select-wrapper">
                <i class="fa fa-search"></i>
                <select id="report-search" placeholder="Search for an event"></select>
            </div>
            `
        );

        this.reportDetailContainer = new Element(
            `
            <div id="report">
                <div class="detail">
                    <h5 class="title">Report Title</h5>
                    <date>July 25, 2017</date>
                    <div class="description">Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Lorem ipsum dolor sit amet, consectetur adipisicing elit</div>
                </div>
                <div class="map">
                </div>
            <div>
            `
        );

        this.reportSection.childElements.push(this.reportSelectContainer);
        this.reportSection.childElements.push(this.reportDetailContainer);

        this.childElements.push(this.reportSection);
        this.childElements.push(this.keyFiguresSection);
        this.childElements.push(this.recentEventsSection);

    }

    process() {
        $("#report-search").selectize();
    }
}
