'use strict';

var acledData = [];

function showCountryProfilePage() {
    $('#main-content')[0].style.display = 'none';
    $('#country-profile')[0].style.display = 'flex';
}
function showMainDashboardPage() {
    $('#country-profile')[0].style.display = 'none';
    $('#main-content')[0].style.display = 'flex';
    dashMap.reloadMap();
}

function compareCountryNames(name1, name2) {
    name1 = name1.toLowerCase().replace(/\b((the)|(a)|(an)|(of))\b/g, '').replace(/\s\s+/g, ' ');
    name2 = name2.toLowerCase().replace(/\b((the)|(a)|(an)|(of))\b/g, '').replace(/\s\s+/g, ' ');
    return name1 == name2;
}

function hashCode(str) {
    var hash = 0;
    for (var i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 8) - hash);
    }
    return hash;
}
function hslToRgb(h, s, l) {
    var r = void 0,
        g = void 0,
        b = void 0;

    if (s == 0) {
        r = g = b = l; // achromatic
    } else {
        var hue2rgb = function hue2rgb(p, q, t) {
            if (t < 0) t += 1;
            if (t > 1) t -= 1;
            if (t < 1 / 6) return p + (q - p) * 6 * t;
            if (t < 1 / 2) return q;
            if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
            return p;
        };

        var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        var p = 2 * l - q;
        r = hue2rgb(p, q, h + 1 / 3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1 / 3);
    }

    return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
}
function intToRGB(i) {

    var c = (i & 0x00FFFFFF).toString(16).toUpperCase();

    var index = parseInt("00000".substring(0, 6 - c.length) + c, 16) / 0xffffff;
    var rgb = hslToRgb(index, 0.6, 0.6);
    // console.log(rgb);
    // console.log(rgb[0].toString(16)+rgb[1].toString(16)+rgb[2].toString(16));
    return rgb[0].toString(16) + rgb[1].toString(16) + rgb[2].toString(16);
}

$(document).ready(function () {
    crisisProfile.init();
    dashMap.init();

    $.ajax({
        url: 'https://api.acleddata.com/acled/read',
        data: { 'limit': '5000', 'fields': 'event_type|country|latitude|longitude|fatalities' },
        dataType: 'json',
        crossDomain: true,
        success: function success(data) {
            dashMap.loadData(data);
        }
    });

    $('#back-btn').click(function () {
        showMainDashboardPage();
    });
});
//# sourceMappingURL=_main.js.map