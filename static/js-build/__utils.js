'use strict';

// pads the string s to right with c upto n length
function padRight(s, c, n) {
    if (!s || !c || s.length >= n) {
        return s;
    }

    var max = (n - s.length) / c.length;
    for (var i = 0; i < max; i++) {
        s += c;
    }
    s = s.substring(0, s.length - s.length % n);
    return s;
}

// hashes the sring to a 32-bit hex number (string)
String.prototype.hash32 = function () {
    var hash = 0,
        i = void 0,
        chr = void 0;
    str = padRight(this, '1234567abcdef', 128);

    for (var _i = 0; _i < str.length; _i++) {
        chr = str.charCodeAt(_i);
        hash = (hash << 5) - hash + chr;
        hash |= 0;
    }
    return hash;
};

String.prototype.toPastelColor = function () {
    var hash = this.hash32();
    var h = (hash >>> 0) / 0xffffffff;
    var s = '66%';
    var l = '55%';
    h = Math.pow(h, -4);
    return 'hsl(' + Math.ceil(h * 360) + ', ' + s + ', ' + l + ')';
};
//# sourceMappingURL=__utils.js.map