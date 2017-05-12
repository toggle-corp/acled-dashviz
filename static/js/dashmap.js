let dashMap = {
    map: null,

    // layout margins
    margin: {'top': 10, 'right': 10, 'bottom': 32, 'left': 48},

    defaultFillColor: '#ccc',

    init: function(){
        // Create and show map
        L.mapbox.accessToken = 'pk.eyJ1IjoiZnJvemVuaGVsaXVtIiwiYSI6ImNqMWxvNDIzNDAwMGgzM2xwczZldWx1MmgifQ.s3yNCS5b1f6DgcTH9di3zw';
        dashMap.map = L.map('the-map', { preferCanvas: true }).setView([0, 10], 3);
        L.tileLayer('https://api.mapbox.com/styles/v1/frozenhelium/cj1lpbp1g000l2rmr9kwg12b3/tiles/256/{z}/{x}/{y}?access_token=' + L.mapbox.accessToken, {
            attribution: '© <a href="https://www.mapbox.com/map-feedback/">Mapbox</a> © <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        }).addTo(dashMap.map);

        // Toggle scroll-zoom by clicking on and outside map
        dashMap.map.scrollWheelZoom.disable();
        dashMap.map.on('focus', function() { dashMap.map.scrollWheelZoom.enable(); });
        dashMap.map.on('blur', function() { dashMap.map.scrollWheelZoom.disable(); });
    },

    loadData: function(data){
        acledData = data.data;

        acledData.sort(function(a, b){
            let ea = a.event_type.toUpperCase();
            let eb = b.event_type.toUpperCase();
            return (ea < eb)? -1: (ea > eb)? 1: 0;
        });
        let eventGroupedData = [];
        let currentEvent = "";
        let currentData = null;
        for(let i=0; i<acledData.length; i++){
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
        }
        dashMap.reloadMap();
    },

    // Reload markers on map
    reloadMap: function(){
        for (let i=0; i<acledData.length; i++) {
            let data = acledData[i];
            let radius = Math.sqrt((data.fatalities + 50) * 5000)*50;
            let color = '#' + intToRGB(hashCode(data.event_type.toLowerCase()));
            L.circle([data.latitude, data.longitude], radius, {
                fillColor: '#' + intToRGB(hashCode(data.event_type.toLowerCase())),
                stroke: false,
                fillOpacity: 0.7,
            }).addTo(dashMap.map);
        }

        let geoJsonLayer = null;
        $.getJSON('https://raw.githubusercontent.com/toggle-corp/world-map/master/countries.geo.json', function(data) {
            geoJsonLayer = L.geoJson(data, {
                onEachFeature: dashMap.onEachMapFeature,
            });
            geoJsonLayer.addTo(dashMap.map);
        });
    },

    // Edit each country feature
    onEachMapFeature: function(feature, layer){
        layer.setStyle({
            fillColor: dashMap.defaultFillColor,
            fillOpacity: 0,
            stroke: false,
        });

        let data = acledData.find(d => compareCountryNames(d.country, feature.properties.admin));
        if (data) {
            layer.on('mouseover', function() { layer.setStyle({ fillOpacity: 0.5, }); });
            layer.on('mouseout', function() { layer.setStyle({ fillOpacity: 0, }); });
            layer.on('click', function(){
                $('#country-profile #country-header #country-name').text(data.country);
                showCountryProfilePage();

                $('#fatalities-spinner').show();
                $("#time-series svg").remove();

                let parseTime = d3.timeParse("%Y");
                let svg = d3.select("#time-series").append('svg');

                let width = $('#time-series svg').width();
                let height = $('#time-series svg').height();

                let scaleX = d3.scaleTime().range([0, (width - dashMap.margin.left - dashMap.margin.right)]);
                let scaleY = d3.scaleLinear().range([(height - dashMap.margin.top - dashMap.margin.bottom), 0]);

                let canvas = svg.append('g').attr('transform', 'translate(' + dashMap.margin.left + ',' + dashMap.margin.top + ')');

                let lineFunction = d3.line()
                .curve(d3.curveLinear)
                    .x(function(d) { return scaleX(d.year) })
                    .y(function(d) { return scaleY(d.fatalities) });

                $.ajax({
                    url: 'https://api.acleddata.com/acled/read',
                    data: {'limit': 0, 'country': data.country, 'fields': 'year|fatalities' },
                    dataType: 'json',
                    crossDomain: true,
                    success: function(data) {
                        data.data.forEach(function(d){
                            // Ensure proper formatting
                            d.year = parseTime(d.year);
                            d.fatalities = +d.fatalities;
                        });
                        data.data.sort(function(a, b){ return (a.year < b.year)? -1: (a.year > b.year)? 1: 0; });

                        let yearGroupedData = [];
                        let currentYear = null;
                        let currentData = null;

                        for (let i=0; i<data.data.length; i++) {
                            let current = data.data[i];
                            if((new Date(currentYear)).getFullYear() != (new Date(current.year)).getFullYear()){
                                currentYear = current.year;
                                currentData = {'year': current.year, 'fatalities': 0}
                                yearGroupedData.push(currentData);
                            }
                            currentData.fatalities += parseInt(current.fatalities);
                        }

                        scaleX.domain(d3.extent(yearGroupedData, function(d) { return d.year; }));
                        scaleY.domain([0, d3.max(yearGroupedData, function(d) { return d.fatalities; })]);

                        let circles = canvas.selectAll("circle").data(yearGroupedData).enter().append('circle');

                        let circleAttributes = circles.attr("cx", function (d) { return scaleX(d.year) })
                            .attr("cy", function (d) { return scaleY(d.fatalities) })
                            .attr("r", function (d) { return 3; })
                            .style("fill", function(d) { return '#c93844'; });

                        canvas.append("path")
                            .data([yearGroupedData])
                            .attr("class", "line")
                            .attr("d", lineFunction);

                        // Add the X Axis
                        canvas.append('g')
                        .attr('transform', 'translate(0,' + (height - dashMap.margin.top - dashMap.margin.bottom) + ')')
                        .attr('class', 'x-axis')
                        .call(d3.axisBottom(scaleX));

                        // Add the Y Axis
                        canvas.append("g")
                        .call(d3.axisLeft(scaleY));

                        $('#fatalities-spinner').hide();
                    }
                });
            });
        }
    },
};
