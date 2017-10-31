const { strlen, first } = require('printable-characters');
const psl = require('psl');
const url = require('url');

module.exports = function(input, length, sep) {
    if (!length) length = 100;
    if (!sep) sep = '…';

    if (typeof input !== 'string') {
        throw new TypeError('uri should be a string');
    }
    
    if (typeof length !== 'number' || !Number.isInteger(length) || length <= 0) {
        throw new TypeError('length should be a positive integer');
    }

    if (input.startsWith('data:')) {
        return trimDataUri(input, length, sep);
    }
    else if (input.match(/^https?:/)) {
        for (let uri of trimUrl(input, length, sep)) {
            if (strlen(uri) <= length) {
                return uri;
            }
        }
        return boringTrim(input, length, sep);
    }
    else {
        return boringTrim(input, length, sep);
    }
};

function* trimUrl(input, length, sep) {
    yield input;
    var uri = input;

    // Trim auth
    if (uri.match(/^(\w+:\/\/)([^@]+)@/)) {
        if (strlen(RegExp.$2) > strlen(sep)) {
            uri = uri.replace(/^(\w+:\/\/)(?:[^@]+)@/, `$1${sep}@`);
            yield uri;
        }
    }

    // Trim hostname components
    var origHostname = url.parse(input).hostname;
    var hostParts = origHostname.split('.');
    var domain = psl.get(origHostname).split('.');

    while (hostParts.length > domain.length + 1) {
        hostParts.shift();
        if (strlen(sep + hostParts.join('.')) < strlen(origHostname)) {
            yield uri.replace(origHostname, hostParts.join('.'));
        }
    }

    if (strlen(sep + hostParts.join('.')) < strlen(origHostname)) {
        uri = uri.replace(origHostname, sep + hostParts.join('.'));
    }


    yield *trimFromChar('#', uri, length, sep);
    yield *trimFromChar('?', uri, length, sep);

    // Trim path
    yield *trimPath(uri, length, sep);

    // Get it down to just a domain
    uri = uri.replace(hostParts.join('.'), domain.join('.'));
    yield uri;

    // Not sure what to do now?
    return;
}

function* trimPath(uri, maxLength, sep) {
    // Literally just trim for now
    yield boringTrim(uri, maxLength, sep);
}

function* trimFromChar(beginChar, uri, maxLength, sep) {
    var pos = uri.lastIndexOf(beginChar);
    if (pos === -1) return;

    var over = strlen(uri) - maxLength;
    if (over > strlen(sep)) {
        uri = uri.slice(0, maxLength - strlen(sep)) + sep;
        yield uri;
    }
    else {
        // Remove it entirely
        uri = uri.slice(0, pos) + sep;
        yield uri;
    }
}

function trimDataUri(input, length, sep) {
    // Trim up to the comma (no need to include the actual content)
    var comma = input.indexOf(',');
    if (comma !== -1 && comma <= length + 1) {
        return input.slice(0, comma);
    }
    else {
        return boringTrim(input, length, sep);
    }
}

function boringTrim(input, length, sep) {
    if (strlen(input) - length > strlen(sep)) {
        return input.slice(0, length - strlen(sep)) + sep;
    }
    else {
        return input;
    }
}
