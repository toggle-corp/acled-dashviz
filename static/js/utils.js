// pads the string s to right with c upto n length
function padRight(s, c, n) {
    if (! s || ! c || s.length >= n) {
        return s;
    }

    var max = (n - s.length)/c.length;
    for (var i = 0; i < max; i++) {
        s += c;
    }
    s = s.substring(0, s.length - s.length%n);
    return s;
}

// hashes the sring to a 32-bit hex number (string)
String.prototype.hash32 = function() {
    let hash = 0, i, chr;
    str = padRight(this, '1234567abcdef', 128);

    for (let i = 0; i < str.length; i++) {
        chr   = str.charCodeAt(i);
        hash  = ((hash << 5) - hash) + chr;
        hash |= 0;
    }
    return hash;
}

String.prototype.toPastelColor = function() {
    let hash = this.hash32();
    let h = (hash>>>0)/0xffffffff;
    let s = '66%';
    let l = '55%';
    h = Math.pow(h, -4);
    return 'hsl(' + Math.ceil(h*360) + ', '+ s + ', ' + l + ')';
}
