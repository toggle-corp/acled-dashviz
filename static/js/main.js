let acledData = [];


// let Dashboard = {
//     init: function(){
//
//     }
// };

let crisisProfile = {
    init: function(){
        this.selectElement = $('<select id="country-search" placeholder="Search for crisis"><option value="">Search for crisis</option></select>');
        this.selectElement.appendTo($('#search-input-container'));
        this.selectElement.selectize({
            valueField: 'country',
            labelField: 'country',
            searchField: 'country',
            // options: [],
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
        // console.log(country);
    }
};

function compareCountryNames(name1, name2) {
    name1 = name1.toLowerCase().replace(/\b((the)|(a)|(an)|(of))\b/g, '').replace(/\s\s+/g, ' ');
    name2 = name2.toLowerCase().replace(/\b((the)|(a)|(an)|(of))\b/g, '').replace(/\s\s+/g, ' ');
    return (name1 == name2);
}

$(document).ready(function(){
    crisisProfile.init();
    // Create and show map
    L.mapbox.accessToken = 'pk.eyJ1IjoiZnJvemVuaGVsaXVtIiwiYSI6ImNqMWxvNDIzNDAwMGgzM2xwczZldWx1MmgifQ.s3yNCS5b1f6DgcTH9di3zw';
    let map = L.map('the-map').setView([0, 10], 3);
    L.tileLayer(
        'https://api.mapbox.com/styles/v1/frozenhelium/cj1lpbp1g000l2rmr9kwg12b3/tiles/256/{z}/{x}/{y}?access_token=' + L.mapbox.accessToken, {
            attribution: '© <a href="https://www.mapbox.com/map-feedback/">Mapbox</a> © <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        }).addTo(map);

        // Toggle scroll-zoom by clicking on and outside map
        map.scrollWheelZoom.disable();
        map.on('focus', function() { map.scrollWheelZoom.enable(); });
        map.on('blur', function() { map.scrollWheelZoom.disable(); });

        // Reload markers on map
        function reloadMap() {
            for (let i=0; i<acledData.length; i++) {
                let data = acledData[i];
                let radius = Math.sqrt((data.fatalities + 50) * 5000)*50;
                let color = '#' + intToRGB(hashCode(data.event_type.toLowerCase()));
                L.circle([data.latitude, data.longitude], radius, {
                    fillColor: '#' + intToRGB(hashCode(data.event_type.toLowerCase())),
                    stroke: false,
                    fillOpacity: 0.7,
                }).addTo(map);
            }

            let geoJsonLayer = null;
            $.getJSON('https://raw.githubusercontent.com/toggle-corp/world-map/master/countries.geo.json', function(data) {
                geoJsonLayer = L.geoJson(data, {
                    onEachFeature: onEachMapFeature,
                });
                geoJsonLayer.addTo(map);
            });

            // Edit each country feature
            function onEachMapFeature(feature, layer) {
                layer.setStyle({
                    fillColor: '#ccc',
                    fillOpacity: 0,
                    stroke: false,
                });

                let data = acledData.find(d => compareCountryNames(d.country, feature.properties.admin));
                if (data) {
                    layer.on('mouseover', function() {
                        layer.setStyle({
                            fillOpacity: 0.5,
                        });
                    });
                    layer.on('mouseout', function() {
                        layer.setStyle({
                            fillOpacity: 0,
                        });
                    });

                    layer.on('click', function() {
                        $('#main-content')[0].style.display = 'none';
                        $('#country-profile #country-header #country-name').text(data.country);
                        $('#country-profile')[0].style.display = 'flex';

                        $('#fatalities-spinner').show();

                        $("#time-series svg").remove();
                        var parseTime = d3.timeParse("%Y");

                        let margin = {'top': 10, 'right': 10, 'bottom': 32, 'left': 48};

                        let svg = d3.select("#time-series").append('svg');

                        let width = $('#time-series svg').width();
                        let height = $('#time-series svg').height();

                        let scaleX = d3.scaleTime().range([0, (width - margin.left - margin.right)]);
                        let scaleY = d3.scaleLinear().range([(height - margin.top - margin.bottom), 0]);

                        let canvas = svg.append('g').attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

                        let lineFunction = d3.line()
                        .curve(d3.curveLinear)
                            .x(function(d) { return scaleX(d.year) })
                            .y(function(d) { return scaleY(d.fatalities) });

                        $.ajax({
                            url: 'https://api.acleddata.com/acled/read?country='+data.country+'&limit=0',
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
                                let toolTip = !d3.select('div.tooltip').empty()
                                    ?d3.select('div.tooltip')
                                    :d3.select("body")
                                        .append("div")
                                        .attr("class", "tooltip")
                                        .style("opacity", 0)
                                        .style("visibility", 'hidden');

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

                                canvas.append("path")
                                    .data([yearGroupedData])
                                    .attr("class", "line")
                                    .attr("d", lineFunction);

                                let circles = canvas.selectAll("circle").data(yearGroupedData).enter().append('circle');

                                let circleAttributes = circles.attr("cx", function (d) { return scaleX(d.year) })
                                    .attr("cy", function (d) { return scaleY(d.fatalities) })
                                    .attr("r", function (d) { return 3; })
                                    .style("fill", function(d) { return '#c93844'; })
                                    .on("mouseover", function(d) {
                                        toolTip
                                            .html('Fatalities: <strong>'+d.fatalities+'</strong>')
                                            .transition()
                                            .duration(100)
                                            .style("opacity", 100)
                                            .style("visibility", 'visible');
                                    })
                                    .on("mousemove", function(d) {
                                        toolTip
                                            .style("top", (d3.event.pageY-30)+"px")
                                            .style("left",(d3.event.pageX+10)+"px");
                                    })
                                    .on("mouseout", function(d) {
                                        toolTip
                                            .transition()
                                            .duration(100)
                                            .style("opacity", 0)
                                            .style("visibility", 'hidden');
                                    });

                                // Add the X Axis
                                canvas.append('g')
                                .attr('transform', 'translate(0,' + (height - margin.top - margin.bottom) + ')')
                                .attr('class', 'x-axis')
                                .call(d3.axisBottom(scaleX));

                                // Add the Y Axis
                                canvas.append("g")
                                .call(d3.axisLeft(scaleY));

                                $('#fatalities-spinner').hide();
                            }
                        });
                    })
                }
            }
        }

        function hashCode(str) {
            let hash = 0;
            for (let i = 0; i < str.length; i++) {
                hash = str.charCodeAt(i) + ((hash << 8) - hash);
            }
            return hash;
        }
        function hslToRgb(h, s, l){
            let r, g, b;

            if(s == 0){
                r = g = b = l; // achromatic
            }else{
                let hue2rgb = function hue2rgb(p, q, t){
                    if(t < 0) t += 1;
                    if(t > 1) t -= 1;
                    if(t < 1/6) return p + (q - p) * 6 * t;
                    if(t < 1/2) return q;
                    if(t < 2/3) return p + (q - p) * (2/3 - t) * 6;
                    return p;
                }

                let q = l < 0.5 ? l * (1 + s) : l + s - l * s;
                let p = 2 * l - q;
                r = hue2rgb(p, q, h + 1/3);
                g = hue2rgb(p, q, h);
                b = hue2rgb(p, q, h - 1/3);
            }

            return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
        }
        function intToRGB(i){

            let c = (i & 0x00FFFFFF)
            .toString(16)
            .toUpperCase();

            let index = parseInt("00000".substring(0, 6 - c.length) + c, 16)/0xffffff;
            let rgb = hslToRgb(index, 0.6, 0.6);
            // console.log(rgb);
            // console.log(rgb[0].toString(16)+rgb[1].toString(16)+rgb[2].toString(16));
            return rgb[0].toString(16)+rgb[1].toString(16)+rgb[2].toString(16);
        }

        function loadData(data){
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
                //console.log(eventGroupedData[i].data[0].country);

            }
            reloadMap();
        }

        $.ajax({
            url: 'https://api.acleddata.com/acled/read?limit=1000',
            dataType: 'json',
            crossDomain: true,
            success: function(data){
                loadData(data);
            }
        });
        //loadData(data);

        $('#back-btn').click(function(){
            $('#country-profile')[0].style.display = 'none';
            $('#main-content')[0].style.display = 'flex';
        });


    });
