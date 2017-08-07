'use strict';

var crisisProfile = {
    init: function init() {
        this.selectElement = $('<select id="country-search" placeholder="Search for crisis"><option value="">Search for crisis</option></select>');
        this.selectElement.appendTo($('#search-input-container'));
        this.selectElement.selectize({
            valueField: 'country',
            labelField: 'country',
            searchField: 'country',
            create: false,
            render: {
                option: function option(item, escape) {
                    return '<div>' + item.country + '</div>';
                }
            },
            load: function load(query, callback) {
                if (!query.length) return callback();
                $.ajax({
                    url: 'https://api.acleddata.com/acled/read?country=' + query + '&limit=5',
                    type: 'GET',
                    dataType: 'json',
                    error: function error() {
                        callback();
                    },
                    success: function success(res) {
                        callback(res.data);
                    }
                });
            }
        });

        var that = this;
        this.selectElement.on('change', function () {
            that.selectCountry($(this).val());
        });
    },

    selectCountry: function selectCountry(country) {
        $.ajax({
            url: 'https://api.acleddata.com/acled/read?country=' + country + '&limit=0',
            type: 'GET',
            dataType: 'json',
            error: function error() {},
            success: function success(data) {
                $('#crisis-details #number-of-events .number').text(data.count);

                var fatalities = 0;
                for (var i = 0; i < data.count; i++) {
                    fatalities += parseInt(data.data[i].fatalities);
                }

                $('#crisis-details #fatalities .number').text(fatalities);
            }
        });
    }
};
//# sourceMappingURL=crisis-profile.js.map