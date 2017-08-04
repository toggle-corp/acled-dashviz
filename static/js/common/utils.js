let acledData = [];
//let dashboard = null;

let acledCountries = {};
function addCountry(countryName) {
    if(!acledCountries[countryName]) {
        acledCountries[countryName] = 0;
    }
    ++acledCountries[countryName];
}

let acledEvents = {};
function addEvent(eventName) {
    eventName = eventName.includes('battle')? 'battles' : eventName;
    if (!acledEvents[eventName]) {
        acledEvents[eventName] = 0;
    }
    ++acledEvents[eventName];
}

let acledEventOrder = [ 'battles', 'violence against civilians', 'remote violence', 'riots/protests' ];


function getSortedAcledEventKeys() {
    let keys = Object.keys(acledEvents);

    function getOrder(i) {
        return i==-1? 9999 : i;
    }

    keys.sort(function(a, b) {
        return getOrder(acledEventOrder.findIndex((el) => compareEvents(el, a))) - getOrder(acledEventOrder.findIndex((el) => compareEvents(el, b)));
    });

    return keys;
}

function compareEvents(e1, e2) {
    if(e1.toLowerCase().includes('battle') && e2.toLowerCase().includes('battle')) {
        return true;
    }
    return e1.toLowerCase() == e2.toLowerCase();
}

let totalFatalities = 0;
function addFatalities(fatalities) {
    totalFatalities += (fatalities >> 0);
}

eventColors = {
    'battle': '#093746',
    'headquarters or base established': '#0D657D',
    'non-violent transfer of territory': '#898989 ',
    'remote violence': '#FFBB7A',
    'riots/protests': '#FF7F0E',
    'strategic development': '#A2C8EC',
    'violence against civilians': '#C95200',
};

function getEventColor(eventName) {
    if(eventName.includes('battle')) {
        return eventColors.battle;
    }
    return eventColors[eventName];
}

function compareCountryNames(name1, name2) {
    name1 = name1.toLowerCase().replace(/\b((the)|(a)|(an)|(of))\b/g, '').replace(/\s\s+/g, ' ');
    name2 = name2.toLowerCase().replace(/\b((the)|(a)|(an)|(of))\b/g, '').replace(/\s\s+/g, ' ');
    return (name1 == name2);
}
