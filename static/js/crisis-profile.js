let crisisProfile = {
    init: function(){
        this.selectElement = $('<select id="country-search" placeholder="Search for crisis"><option value="">Search for crisis</option></select>');
        this.selectElement.appendTo($('#search-input-container'));
        this.selectElement.selectize({
            valueField: 'country',
            labelField: 'country',
            searchField: 'country',
            create: false,
            render: {
                option: function(item, escape) {
                    return '<div>'+ item.country +'</div>';
                }
            },
            load: function(query, callback) {
                if (!query.length) return callback();
                $.ajax({
                    url: 'https://api.acleddata.com/acled/read?country='+query+'&limit=5',
                    type: 'GET',
                    dataType: 'json',
                    error: function() {
                        callback();
                    },
                    success: function(res) {
                        callback(res.data);
                    }
                });
            },
        });

        let that = this;
        this.selectElement.on('change', function(){
            that.selectCountry($(this).val());
        });
    },

    selectCountry: function(country){
        $.ajax({
            url: 'https://api.acleddata.com/acled/read?country='+country+'&limit=0',
            type: 'GET',
            dataType: 'json',
            error: function() {
            },
            success: function(data) {
                $('#crisis-details #number-of-events .number').text(data.count);

                let fatalities = 0;
                for(let i=0; i<data.count; i++){
                    fatalities += parseInt(data.data[i].fatalities);
                }

                $('#crisis-details #fatalities .number').text(fatalities);
            }
        });
    }
};
