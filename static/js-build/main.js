'use strict';

var dashboard = null;

jQ3(document).ready(function () {
    jQ3('#main').empty();
    var root = new Element();
    root.element = jQ3('#main');

    dashboard = new Dashboard();
    dashboard.initDomAll(root);
    dashboard.processAll();

    var dashboardFields = ['iso', 'country', 'event_type', 'event_date', 'latitude', 'longitude', 'fatalities', 'interaction'];

    var urlForDashboardData = createUrlForAPI({
        limit: '0',
        fields: dashboardFields.join('|')
    });

    d3.csv(urlForDashboardData, function (data) {
        data.forEach(function (row) {
            row.event_type = getAcledEventName(row.event_type.toLowerCase());
            row.iso = row.iso.padStart(3, '0');

            addEvent(row.event_type);
            addCountryISO(row.iso, row.country);
            addFatalities(row.fatalities);
        });

        acledData = data;
        dashboard.loadData(data);
    });

    jQ3(window).scroll(function () {
        jQ3('#country-profile')[0].scrollTop = jQ3(window).scrollTop();
    });

    jQ3('#close-browser-warning').on('click', function () {
        jQ3(this).closest('.browser-warning').hide();
        window.localStorage.setItem('browser-warning-dismissed', true);
    });

    if (window.localStorage && !window.localStorage.getItem('browser-warning-dismissed')) {
        // Opera 8.0+
        var isOpera = !!window.opr && !!opr.addons || !!window.opera || navigator.userAgent.indexOf(' OPR/') >= 0;

        // Firefox 1.0+
        var isFirefox = typeof InstallTrigger !== 'undefined';

        // Safari 3.0+ "[object HTMLElementConstructor]"
        var isSafari = /constructor/i.test(window.HTMLElement) || function (p) {
            return p.toString() === "[object SafariRemoteNotification]";
        }(!window['safari'] || typeof safari !== 'undefined' && safari.pushNotification);

        // Internet Explorer 6-11
        var isIE = /*@cc_on!@*/false || !!document.documentMode;

        // Edge 20+
        var isEdge = !isIE && !!window.StyleMedia;

        // Chrome 1+
        var isChrome = !!window.chrome && !!window.chrome.webstore;

        if (!isChrome && !isEdge && !isIE && !isSafari) {
            jQ3('.browser-warning')[0].style.display = 'flex';
        }
    }
});

var prevSetup = Selectize.prototype.setup;
Selectize.prototype.setup = function () {
    prevSetup.call(this);
    this.$control_input.prop('readonly', true);
};
//# sourceMappingURL=main.js.map