class CountryReport extends Element {
    constructor() {
        super('<div id="country-report-container"></div>');

        this.header = new Element('<header><h4>Report</h4></header>');
        this.content = new Element(`
            <div class="content">
                <div class="preview">
                    <img>
                </div>
                <div class="details">
                    <h5></h5>
                    <date></date>
                    <p></p>
                    <a>Go to report</a>
                </div>
            </div>
            `);

        this.childElements.push(this.header);
        this.childElements.push(this.content);

    }

    load(country) {
        let re = this.content.element;

        re.find('h5').text('');
        re.find('p').text('');
        re.find('date').text('');
        re.find('img')[0].src = '';
        re.find('a')[0].href = '';

        $.ajax({
            type: 'GET',
            url: homeUrl+'/?pagename=report_country__'+country,
            success: function(response) {
                let report = JSON.parse(response);

                if (report && report.title) {
                    re.find('h5').text(report.title);
                    re.find('p').text(report.summary);
                    re.find('date').text(report.date);
                    re.find('img').prop('src', report.img);
                    re.find('a').prop('href', report.url);
                }
            }
        });
    }
}
