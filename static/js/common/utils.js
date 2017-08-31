String.prototype.capitalize = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
};

let acledData = [];
//let dashboard = null;

let acledCountries = {};
function addCountry(countryName) {
    if(!acledCountries[countryName]) {
        acledCountries[countryName] = 0;
    }
    ++acledCountries[countryName];
}

let acledEvents = {
    'battles': 0,
    'violence against civilians': 0, 
    'remote violence': 0, 
    'riots/protests': 0,
    'other': 0
};

function getAcledEventName(eventName) {
    if (eventName.includes('battle')) {
        return 'battles';
    } else if (eventName in acledEvents) {
        return eventName;
    }

    return 'other';
}
 
function addEvent(eventName) {
    if (acledEvents[eventName]) {
        ++acledEvents[eventName];
    }
}

let acledEventOrder = [ 'battles', 'violence against civilians', 'remote violence', 'riots/protests', 'other'];

function getSortedAcledEvents() {
    return acledEventOrder;
}
 
function getSortedAcledEventKeys() {
    return acledEventOrder;
}

function compareEvents(e1, e2) {
    return e1.toLowerCase() == e2.toLowerCase();
}

let totalFatalities = 0;
function addFatalities(fatalities) {
    totalFatalities += (fatalities >> 0);
}

let eventColors = {
    'battles': '#093746',
    'violence against civilians': '#A2C8EC',
    'remote violence': '#FFBB7A',
    'riots/protests': '#C95200',
    'other': '#CFCFCF',
};

function getEventColor(eventName) {
    return eventColors[eventName];
}

let acledActors = {
    'State Military and Police': 1, 
    'Rebels': 2, 
    'Political Militias': 3, 
    'Communal Militias': 4, 
    'Rioters': 5, 
    'Protesters': 6, 
    'Civilians': 7,
};
 
 
 
function compareCountryNames(name1, name2) {
    name1 = name1.toLowerCase().replace(/\b((the)|(a)|(an)|(of))\b/g, '').replace(/\s\s+/g, ' ');
    name2 = name2.toLowerCase().replace(/\b((the)|(a)|(an)|(of))\b/g, '').replace(/\s\s+/g, ' ');
    return (name1 == name2);
}

 
let mapScaleFactor = 1.8;
 
/*
function getMapCircleRadius(noOfEvents) {
    let radius = Math.sqrt(noOfEvents)*mapScaleFactor;
    return radius;
}
*/

function getMapCircleRadius(noOfEvents) {
    return Math.log(noOfEvents)*mapScaleFactor;
}

function getEventCountFromMapCircleRadius(radius) {
    let noOfEvents = radius/mapScaleFactor;
    return Math.floor(Math.exp(noOfEvents));
}

/*

function getEventCountFromMapCircleRadius(radius) {
    let noOfEvents = radius/mapScaleFactor;
    return noOfEvents*noOfEvents;
}

function getEventCountFromPixelRadius(radi, mpp) {
    return Math.round(getEventCountFromMapCircleRadius(radi*mpp));
}
 
function getMeterPerPixel(map) {
    let center = map.latLngToContainerPoint(map.getCenter()); 
    let xOffset = [center.x + 1, center.y]; 
    
    // convert containerpoints to latlng's
    center = map.containerPointToLatLng(center);
    xOffset = map.containerPointToLatLng(xOffset);

    return center.distanceTo(xOffset); 
}

*/
 
function syncCheckboxes(source, target, triggerSync=false) {
    let sourceCheckboxes = source.find('input[type="checkbox"]');
    sourceCheckboxes.each(function() {
        let el = target.find('input[data-target="'+$(this).data('target')+'"]');
        el.prop('checked', $(this).prop('checked'));
         
        if (triggerSync) {
            el.trigger('synccheck');
        }
    });
}
 
