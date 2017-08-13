var dashboard = null;

$(document).ready(function(){
    $('#main').empty();
    let root = new Element();
    root.element = $('#main');
     
    dashboard = new Dashboard();
    dashboard.initDomAll(root);
    dashboard.processAll();

    $.ajax({
        method: 'GET',
        url: 'https://api.acleddata.com/acled/read.csv',
        data: {'limit': '0', 'fields': 'country|event_type|latitude|longitude'},
        success: function(data) {
            let rows = data.split('\n');
            let keys = rows[0].split(',');

            // 1st row is list of keys, last is blank
            for (let i=1; i<rows.length-1; i++) {
                let currentRow = rows[i].split(',');
                let currentData = {};
                 
                for (let j=0; j<keys.length; j++) {
                    if(keys[j] == 'event_type') {
                        currentData[keys[j]] = getAcledEventName(currentRow[j].replace(/^"(.*)"$/, '$1').trim().toLowerCase());
                    } else if (keys[j] == 'country') {
                        currentData[keys[j]] = currentRow[j].replace(/^"(.*)"$/, '$1').trim().toLowerCase();
                    } else {
                        currentData[keys[j]] = currentRow[j];
                    }
                }
                 
                acledData.push(currentData);
            }

            acledData.sort(function(a, b){
                return (a.latitude != b.latitude)? a.latitude - b.latitude : ((a.longitude != b.longitude)?  a.longitude - b.longitude : a.event_type - b.event_type);
            });

            dashboard.loadMainMap();

            dashboard.load();

        }
    });


    $(window).scroll(function(){
        $('#country-profile')[0].scrollTop=$(window).scrollTop();
    });
});
 
// Put this code after you've included Selectize
// but before any selectize fields are initialized
var prevSetup = Selectize.prototype.setup;

Selectize.prototype.setup = function () {
    prevSetup.call(this);

    // This property is set in native setup
    // Unless the source code changes, it should
    // work with any version
    this.$control_input.prop('readonly', true);
}; 
