String.prototype.capitalize = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
};

const countriesByCode = {
    "100":"Bulgaria",
    "104":"Myanmar",
    "108":"Burundi",
    "112":"Belarus",
    "116":"Cambodia",
    "120":"Cameroon",
    "124":"Canada",
    "132":"Cabo Verde",
    "136":"Cayman Islands",
    "140":"Central African Republic",
    "144":"Sri Lanka",
    "148":"Chad",
    "152":"Chile",
    "156":"China",
    "158":"Taiwan",
    "162":"Christmas Island",
    "166":"Cocos (Keeling) Islands",
    "170":"Colombia",
    "174":"Comoros",
    "175":"Mayotte",
    "178":"Congo",
    "180":"Congo (Democratic Republic of the)",
    "184":"Cook Islands",
    "188":"Costa Rica",
    "191":"Croatia",
    "192":"Cuba",
    "196":"Cyprus",
    "203":"Czech Republic",
    "204":"Benin",
    "208":"Denmark",
    "212":"Dominica",
    "214":"Dominican Republic",
    "218":"Ecuador",
    "222":"El Salvador",
    "226":"Equatorial Guinea",
    "231":"Ethiopia",
    "232":"Eritrea",
    "233":"Estonia",
    "234":"Faroe Islands",
    "238":"Falkland Islands (Malvinas)",
    "239":"South Georgia and the South Sandwich Islands",
    "242":"Fiji",
    "246":"Finland",
    "248":"Åland Islands",
    "250":"France",
    "254":"French Guiana",
    "258":"French Polynesia",
    "260":"French Southern Territories",
    "262":"Djibouti",
    "266":"Gabon",
    "268":"Georgia",
    "270":"Gambia",
    "275":"Palestine, State of",
    "276":"Germany",
    "288":"Ghana",
    "292":"Gibraltar",
    "296":"Kiribati",
    "300":"Greece",
    "304":"Greenland",
    "308":"Grenada",
    "312":"Guadeloupe",
    "316":"Guam",
    "320":"Guatemala",
    "324":"Guinea",
    "328":"Guyana",
    "332":"Haiti",
    "334":"Heard Island and McDonald Islands",
    "336":"Holy See",
    "340":"Honduras",
    "344":"Hong Kong",
    "348":"Hungary",
    "352":"Iceland",
    "356":"India",
    "360":"Indonesia",
    "364":"Iran (Islamic Republic of)",
    "368":"Iraq",
    "372":"Ireland",
    "376":"Israel",
    "380":"Italy",
    "384":"Côte d'Ivoire",
    "388":"Jamaica",
    "392":"Japan",
    "398":"Kazakhstan",
    "400":"Jordan",
    "404":"Kenya",
    "408":"Korea (Democratic People's Republic of)",
    "410":"Korea (Republic of)",
    "414":"Kuwait",
    "417":"Kyrgyzstan",
    "418":"Lao People's Democratic Republic",
    "422":"Lebanon",
    "426":"Lesotho",
    "428":"Latvia",
    "430":"Liberia",
    "434":"Libya",
    "438":"Liechtenstein",
    "440":"Lithuania",
    "442":"Luxembourg",
    "446":"Macao",
    "450":"Madagascar",
    "454":"Malawi",
    "458":"Malaysia",
    "462":"Maldives",
    "466":"Mali",
    "470":"Malta",
    "474":"Martinique",
    "478":"Mauritania",
    "480":"Mauritius",
    "484":"Mexico",
    "492":"Monaco",
    "496":"Mongolia",
    "498":"Moldova (Republic of)",
    "499":"Montenegro",
    "500":"Montserrat",
    "504":"Morocco",
    "508":"Mozambique",
    "512":"Oman",
    "516":"Namibia",
    "520":"Nauru",
    "524":"Nepal",
    "528":"Netherlands",
    "531":"Curaçao",
    "533":"Aruba",
    "534":"Sint Maarten (Dutch part)",
    "535":"Bonaire, Sint Eustatius and Saba",
    "540":"New Caledonia",
    "548":"Vanuatu",
    "554":"New Zealand",
    "558":"Nicaragua",
    "562":"Niger",
    "566":"Nigeria",
    "570":"Niue",
    "574":"Norfolk Island",
    "578":"Norway",
    "580":"Northern Mariana Islands",
    "581":"United States Minor Outlying Islands",
    "583":"Micronesia (Federated States of)",
    "584":"Marshall Islands",
    "585":"Palau",
    "586":"Pakistan",
    "591":"Panama",
    "598":"Papua New Guinea",
    "600":"Paraguay",
    "604":"Peru",
    "608":"Philippines",
    "612":"Pitcairn",
    "616":"Poland",
    "620":"Portugal",
    "624":"Guinea-Bissau",
    "626":"Timor-Leste",
    "630":"Puerto Rico",
    "634":"Qatar",
    "638":"Réunion",
    "642":"Romania",
    "643":"Russian Federation",
    "646":"Rwanda",
    "652":"Saint Barthélemy",
    "654":"Saint Helena, Ascension and Tristan da Cunha",
    "659":"Saint Kitts and Nevis",
    "660":"Anguilla",
    "662":"Saint Lucia",
    "663":"Saint Martin (French part)",
    "666":"Saint Pierre and Miquelon",
    "670":"Saint Vincent and the Grenadines",
    "674":"San Marino",
    "678":"Sao Tome and Principe",
    "682":"Saudi Arabia",
    "686":"Senegal",
    "688":"Serbia",
    "690":"Seychelles",
    "694":"Sierra Leone",
    "702":"Singapore",
    "703":"Slovakia",
    "704":"Viet Nam",
    "705":"Slovenia",
    "706":"Somalia",
    "710":"South Africa",
    "716":"Zimbabwe",
    "724":"Spain",
    "728":"South Sudan",
    "729":"Sudan",
    "732":"Western Sahara",
    "740":"Suriname",
    "744":"Svalbard and Jan Mayen",
    "748":"Swaziland",
    "752":"Sweden",
    "756":"Switzerland",
    "760":"Syrian Arab Republic",
    "762":"Tajikistan",
    "764":"Thailand",
    "768":"Togo",
    "772":"Tokelau",
    "776":"Tonga",
    "780":"Trinidad and Tobago",
    "784":"United Arab Emirates",
    "788":"Tunisia",
    "792":"Turkey",
    "795":"Turkmenistan",
    "796":"Turks and Caicos Islands",
    "798":"Tuvalu",
    "800":"Uganda",
    "804":"Ukraine",
    "807":"Macedonia (the former Yugoslav Republic of)",
    "818":"Egypt",
    "826":"United Kingdom of Great Britain and Northern Ireland",
    "831":"Guernsey",
    "832":"Jersey",
    "833":"Isle of Man",
    "834":"Tanzania, United Republic of",
    "840":"United States of America",
    "850":"Virgin Islands (U.S.)",
    "854":"Burkina Faso",
    "858":"Uruguay",
    "860":"Uzbekistan",
    "862":"Venezuela (Bolivarian Republic of)",
    "876":"Wallis and Futuna",
    "882":"Samoa",
    "887":"Yemen",
    "894":"Zambia",
    "004":"Afghanistan",
    "008":"Albania",
    "012":"Algeria",
    "016":"American Samoa",
    "020":"Andorra",
    "024":"Angola",
    "010":"Antarctica",
    "028":"Antigua and Barbuda",
    "032":"Argentina",
    "051":"Armenia",
    "036":"Australia",
    "040":"Austria",
    "031":"Azerbaijan",
    "044":"Bahamas",
    "048":"Bahrain",
    "050":"Bangladesh",
    "052":"Barbados",
    "056":"Belgium",
    "084":"Belize",
    "060":"Bermuda",
    "064":"Bhutan",
    "068":"Bolivia (Plurinational State of)",
    "070":"Bosnia and Herzegovina",
    "072":"Botswana",
    "074":"Bouvet Island",
    "076":"Brazil",
    "086":"British Indian Ocean Territory",
    "092":"Virgin Islands (British)",
    "096":"Brunei Darussalam",
    "undefined":"Republic of Kosovo",
    "090":"Solomon Islands"
};

let acledData = [];

const baseUrl = 'https://api.acleddata.com/acled/read.csv';
function createUrlForAPI(queries) {
    const queryStrings = [];
    if (queries) {
        const queryKeys = Object.keys(queries);

        for(let i=0; i<queryKeys.length; i++) {
            const queryString = `${encodeURIComponent(queryKeys[i])}=${encodeURIComponent(queries[queryKeys[i]])}`;
            queryStrings.push(queryString);
        }
    }

    const url = `${baseUrl}?${queryStrings.join('&')}`;
    return url;
}

const acledCountriesISO = {};
const addCountryISO = (iso, name) => {
    if (!acledCountriesISO[iso]) {
        acledCountriesISO[iso] = name;
    }
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
    return Math.round(Math.exp(noOfEvents));
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
 
function getCountryKey(country) {
    return country.toLowerCase().split(' ').join('_');
}
