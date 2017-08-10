'use strict';

var acledData = [];
//let dashboard = null;

var acledCountries = {};
function addCountry(countryName) {
    if (!acledCountries[countryName]) {
        acledCountries[countryName] = 0;
    }
    ++acledCountries[countryName];
}

var acledEvents = {
    'battles': 0,
    'violence against civilians': 0,
    'remote violence': 0,
    'riots/protests': 0,
    'others': 0
};

function getAcledEventName(eventName) {
    if (eventName.includes('battle')) {
        return 'battles';
    } else if (eventName in acledEvents) {
        return eventName;
    }

    return 'others';
}

function addEvent(eventName) {
    if (acledEvents[eventName]) {
        ++acledEvents[eventName];
    }
}

var acledEventOrder = ['battles', 'violence against civilians', 'remote violence', 'riots/protests', 'others'];

function getSortedAcledEvents() {
    return acledEventOrder;
}
function getSortedAcledEventKeys() {
    /* 
    let keys = Object.keys(acledEvents);
     function getOrder(i) {
        return i==-1? 9999 : i;
    }
     keys.sort(function(a, b) {
        return getOrder(acledEventOrder.findIndex((el) => compareEvents(el, a))) - getOrder(acledEventOrder.findIndex((el) => compareEvents(el, b)));
    });
     return keys;
    */
    return acledEventOrder;
}

function compareEvents(e1, e2) {
    /*
    if(e1.toLowerCase().includes('battle') && e2.toLowerCase().includes('battle')) {
        return true;
    }
    */
    return e1.toLowerCase() == e2.toLowerCase();
}

var totalFatalities = 0;
function addFatalities(fatalities) {
    totalFatalities += fatalities >> 0;
}

var eventColors = {
    'battles': '#093746',
    'violence against civilians': '#CFCFCF',
    'remote violence': '#FFBB7A',
    'riots/protests': '#C95200',
    'others': '#A2C8EC'
};

function getEventColor(eventName) {
    if (eventName in eventColors) {} else {
        //console.log(eventName);
    }
    return eventColors[eventName];
}

function compareCountryNames(name1, name2) {
    name1 = name1.toLowerCase().replace(/\b((the)|(a)|(an)|(of))\b/g, '').replace(/\s\s+/g, ' ');
    name2 = name2.toLowerCase().replace(/\b((the)|(a)|(an)|(of))\b/g, '').replace(/\s\s+/g, ' ');
    return name1 == name2;
}
//# sourceMappingURL=utils.js.map