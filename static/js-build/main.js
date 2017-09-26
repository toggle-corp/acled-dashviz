'use strict';

var dashboard = null;

$(document).ready(function () {
    $('#main').empty();
    var root = new Element();
    root.element = $('#main');

    dashboard = new Dashboard();
    dashboard.initDomAll(root);
    dashboard.processAll();

    d3.csv("https://api.acleddata.com/acled/read.csv?limit=0&fields=country|event_type|latitude|longitude|interaction|event_date|fatalities", function (data) {
        data.forEach(function (row) {
            row.event_type = getAcledEventName(row.event_type.toLowerCase());
            row.country = row.country.toLowerCase();

            addEvent(row.event_type);
            addCountry(row.country);
            addFatalities(row.fatalities);
        });

        acledData = data;
        dashboard.loadData(data);
    });

    $(window).scroll(function () {
        $('#country-profile')[0].scrollTop = $(window).scrollTop();
    });
});

var prevSetup = Selectize.prototype.setup;
Selectize.prototype.setup = function () {
    prevSetup.call(this);
    this.$control_input.prop('readonly', true);
};
//# sourceMappingURL=main.js.map