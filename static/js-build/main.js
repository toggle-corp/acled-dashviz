'use strict';

var dashboard = null;

$(document).ready(function () {
    $('#main').empty();
    var root = new Element();
    root.element = $('#main');

    dashboard = new Dashboard();
    dashboard.initDomAll(root);
    dashboard.processAll();

    $.ajax({
        method: 'GET',
        url: 'https://api.acleddata.com/acled/read.csv',
        data: { 'limit': '0', 'fields': 'country|event_type|latitude|longitude' },
        success: function success(data) {
            var rows = data.split('\n');
            var keys = rows[0].split(',');

            // 1st row is list of keys, last is blank
            for (var i = 1; i < rows.length - 1; i++) {
                var currentRow = rows[i].split(',');
                var currentData = {};

                for (var j = 0; j < keys.length; j++) {
                    if (keys[j] == 'event_type') {
                        currentData[keys[j]] = getAcledEventName(currentRow[j].replace(/^"(.*)"$/, '$1').trim().toLowerCase());
                    } else if (keys[j] == 'country') {
                        currentData[keys[j]] = currentRow[j].replace(/^"(.*)"$/, '$1').trim().toLowerCase();
                    } else {
                        currentData[keys[j]] = currentRow[j];
                    }
                }

                acledData.push(currentData);
            }

            acledData.sort(function (a, b) {
                return a.latitude != b.latitude ? a.latitude - b.latitude : a.longitude != b.longitude ? a.longitude - b.longitude : a.event_type - b.event_type;
            });

            dashboard.loadMainMap();

            dashboard.load();
        }
    });

    $(window).scroll(function () {
        $('#country-profile')[0].scrollTop = $(window).scrollTop();
    });
});
//# sourceMappingURL=main.js.map