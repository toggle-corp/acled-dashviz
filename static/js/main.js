var dashboard = null;

$(document).ready(function(){
    $('#main').empty();
    let root = new Element();
    root.element = $('#main');
     
    dashboard = new Dashboard();
    dashboard.initDomAll(root);
    dashboard.processAll();

    const dashboardFields = [
        'iso',
        'country',
        'event_type',
        'event_date',
        'latitude',
        'longitude',
        'fatalities',
        'interaction',
    ];

    const urlForDashboardData = createUrlForAPI({
        limit: '0',
        fields: dashboardFields.join('|'),
    });


    d3.csv(urlForDashboardData, function(data) {
        data.forEach((row) => {
            row.event_type = getAcledEventName(row.event_type.toLowerCase());
            row.iso = row.iso.padStart(3, '0');

            addEvent(row.event_type);
            addCountryISO(row.iso, row.country);
            addFatalities(row.fatalities);
        });
         
        acledData = data;
        dashboard.loadData(data);    
    });


    $(window).scroll(function(){
        $('#country-profile')[0].scrollTop=$(window).scrollTop();
    });

    $('#close-browser-warning').on('click', function() {
        $(this).closest('.browser-warning').hide();
        window.localStorage.setItem('browser-warning-dismissed', true);
    });

    if ( window.localStorage && !window.localStorage.getItem('browser-warning-dismissed') ) {
        // Opera 8.0+
        var isOpera = (!!window.opr && !!opr.addons) || !!window.opera || navigator.userAgent.indexOf(' OPR/') >= 0;

        // Firefox 1.0+
        var isFirefox = typeof InstallTrigger !== 'undefined';

        // Safari 3.0+ "[object HTMLElementConstructor]"
        var isSafari = /constructor/i.test(window.HTMLElement) || (function (p) { return p.toString() === "[object SafariRemoteNotification]"; })(!window['safari'] || (typeof safari !== 'undefined' && safari.pushNotification));

        // Internet Explorer 6-11
        var isIE = /*@cc_on!@*/false || !!document.documentMode;

        // Edge 20+
        var isEdge = !isIE && !!window.StyleMedia;

        // Chrome 1+
        var isChrome = !!window.chrome && !!window.chrome.webstore;

        if (!isChrome && !isEdge && !isIE && !isSafari) {
            $('.browser-warning')[0].style.display = 'flex';
        }
    }
});
 
var prevSetup = Selectize.prototype.setup;
Selectize.prototype.setup = function () {
    prevSetup.call(this);
    this.$control_input.prop('readonly', true);
}; 
 
