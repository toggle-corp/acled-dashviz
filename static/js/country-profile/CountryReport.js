class CountryReport extends Element {
    constructor() {
        super('<div id="country-report-container"></div>');

        this.header = new Element('<header><h4>Summary of Political Violence and Protest</h4></header>');
        this.emptyElement = new Element('<div id="country-report-empty">Not available</div>');
        this.content = new Element(`
            <div class="content" hidden>
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
        this.childElements.push(this.emptyElement);
        this.childElements.push(this.content);
    }

    load(iso) {
        let re = this.content.element;

        re.find('h5').text('');
        re.find('p').text('');
        re.find('date').text('');
        re.find('img')[0].src = '';
        re.find('a')[0].href = '';

        let that = this;

        $.ajax({
            type: 'GET',
            url: `${homeUrl}/?pagename=report_country__${iso}`,
            success: function(response) {
                let report = JSON.parse(response);

                if (report && report.title) {
                    re.find('h5').text(report.title);
                    re.find('p').text(report.summary);
                    re.find('date').text(report.date);
                    re.find('a').prop('href', report.url);
                    if (report.img) {
                        re.find('.preview').show();
                        re.find('img').prop('src', report.img);
                        re.removeClass('no-preview');
                    } else {
                        re.addClass('no-preview');
                        re.find('.preview').hide();
                    }
                    that.emptyElement.element[0].style.display = 'none';
                    that.content.element[0].style.display = 'flex';
                } else {
                    that.content.element[0].style.display = 'none';
                    that.emptyElement.element[0].style.display = 'flex';
                }
            }
        });
    }
}
