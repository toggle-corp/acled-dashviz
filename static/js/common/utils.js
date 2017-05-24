let acledData = [];
let dashboard = null

let acledEvents = {};
function addEvent(eventName) {
    eventName = eventName.includes('battle')? 'battle' : eventName;
    if (!acledEvents[eventName]) {
        acledEvents[eventName] = 0;
    }
    ++acledEvents[eventName];
}

let totalFatalities = 0;
function addFatalities(fatalities) {
    totalFatalities += (fatalities >> 0);
}

eventColors = {
    'battle': '#e74c3c',
    'headquarters or base established': '#008080',
    'non-violent transfer of territory': '#27ae60',
    'remote violence': '#2c3e50',
    'riots/protests': '#e67e22',
    'strategic development': '#2980b9',
    'violence against civilians': '#8e44ad',
};

function getEventColor(eventName) {
    if(eventName.includes('battle')) {
        return eventColors['battle'];
    }
    return eventColors[eventName];
}

function compareCountryNames(name1, name2) {
    name1 = name1.toLowerCase().replace(/\b((the)|(a)|(an)|(of))\b/g, '').replace(/\s\s+/g, ' ');
    name2 = name2.toLowerCase().replace(/\b((the)|(a)|(an)|(of))\b/g, '').replace(/\s\s+/g, ' ');
    return (name1 == name2);
}
