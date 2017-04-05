$(document).ready(function(){
    // Show the map
    var map = L.map('the-map').setView([41.87, 12.6], 2);
    map.scrollWheelZoom.disable();

    // Toggle scroll-zoom by clicking on and outside map
    map.on('focus', function() { map.scrollWheelZoom.enable(); });
    map.on('blur', function() { map.scrollWheelZoom.disable(); });

    var layer;
    var mapData;
    function reloadMap() {
        if (layer) {
            layer.clearLayers();
        }

        var layer = L.geoJson(mapData, {
            style: styleMapFeature,
            onEachFeature: onEachMapFeature,
        }).addTo(map);
    }

    // Load countries geojson in the map
    $.getJSON('https://raw.githubusercontent.com/toggle-corp/world-map/master/countries.geo.json', function(data) {
        mapData = data;
        reloadMap();
    });

    function onEachMapFeature(feature, layer) {
        layer.on('click', function() {
            $('#main-content')[0].style.display = 'none';
            $('#country-profile #country-header #country-name').text(feature.properties.name);
            $('#country-profile')[0].style.display = 'flex';

            // layer.setStyle({
            //     fillColor: '#80d0d0',
            // });
            // feature.properties.iso_a3 gives iso3 code
        });
    }
    function hashCode(str) { // java String#hashCode
        var hash = 0;
        for (var i = 0; i < str.length; i++) {
            hash = str.charCodeAt(i) + ((hash << 5) - hash);
        }
        return hash;
    }
    function intToRGB(i){
        var c = (i & 0x00FFFFFF)
        .toString(16)
        .toUpperCase();

        return "00000".substring(0, 6 - c.length) + c;
    }
    function styleMapFeature(feature) {
        let event = acledData.find(x => x.country.toLowerCase() == feature.properties.name.toLowerCase());

        return {
            fillColor: event? '#' + intToRGB(hashCode(event.event_type)): '#ecf0f1',
            weight: 1.4,
            opacity: 1,
            color: '#37373b',
            dashArray: '3',
            fillOpacity: 0.9
        };
    }
    let acledData = [];

    function loadData(data){
        acledData = data.data;

        acledData.sort(function(a, b){
            var ea = a.event_type.toUpperCase();
            var eb = b.event_type.toUpperCase();
            return (ea < eb)? -1: (ea > eb)? 1: 0;
        });
        let eventGroupedData = [];
        let currentEvent = "";
        let currentData = null;
        for(let i=0; i<acledData.length; i++){
            if(i==0){
                console.log(acledData[i]);
            }
            if(currentEvent != acledData[i].event_type.toLowerCase()){
                currentEvent = acledData[i].event_type.toLowerCase();
                currentData = {'event': currentEvent, 'data': [] };
                eventGroupedData.push(currentData);
            }
            currentData.data.push(acledData[i]);
        }
        let legendElementContainer = $('#legend-elements');
        for(let i=0; i<eventGroupedData.length; i++){
            let element = $('.legend-element-template').clone();
            element.removeClass('legend-element-template');
            element.addClass('legend-element');
            element.find('span').css('background-color', '#' + intToRGB(hashCode(eventGroupedData[i].event)));
            element.find('label').text(eventGroupedData[i].event);
            element.appendTo(legendElementContainer);
            //console.log(eventGroupedData[i].data[0].country);

        }
        reloadMap();
    }

    // $.ajax({
    //     url: 'https://api.acleddata.com/acled/read?limit=0',
    //     dataType: 'json',
    //     crossDomain: true,
    //     success: function(data){
    //         loadData(data);
    //     }
    // });
    loadData(data);

    $('#back-btn').click(function(){
        $('#country-profile')[0].style.display = 'none';
        $('#main-content')[0].style.display = 'flex';
    });

});
