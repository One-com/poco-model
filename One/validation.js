/*global Ext, exports, window*/
/*jslint regexp:false*/
(function () {
    var validation = {
            regex: {}
        },
        messages = {
            domain: "is not a valid domain name",
            subdomain: "is not a valid domain name",
            email: "is not a valid email address",
            url: "is not a valid URL",
            mailto: "is not a valid mailto-URL",
            pocoprimary: "is not a valid primary property of Portable Contacts"
        },
        install = {
            pocoprimary: function (value) {
                //console.log('FIXME');
                return value === true || value === null;
            }
        },
        name,
        tld = /(?:a[cdefgilmnoqrstuwxz]|aero|arpa|asia|b[abdefghijmnorstvwyz]|biz|c[acdfghiklmnoruvxyz]|cat|com|coop|d[ejkmoz]|e[cegrstu]|edu|f[ijkmor]|g[abdefghilmnpqrstuwy]|gov|h[kmnrtu]|i[delmnoqrst]|info|int|j[emop]|jobs|k[eghimnprwyz]|l[abcikrstuvy]|m[acdeghklmnopqrstuvwxyz]|mil|mobi|museum|n[acefgilopruz]|name|net|om|org|p[aefghklmnrstwy]|pro|qa|r[eosuw]|s[abcdeghijklmnortuvyz]|t[cdfghjklmnoprtvwz]|tel|travel|u[agksyz]|v[aceginu]|w[fs]|xn--(?:0zwm56d|11b5bs3a9aj6g|80akhbyknj4f|9t4b11yi5a|deba0ad|fiqs8s|fiqz9s|fzc2c9e2c|g6w251d|hgbk6aj7f53bba|hlcj6aya9esc7a|j6w193g|jxalpdlp|kgbechtv|kprw13d|kpry57d|mgbaam7a8h|mgbayh7gpa|mgberp4a5d4ar|o3cw4h|p1ai|pgbs0dh|wgbh1c|xkc2al3hye2a|ygbi2ammx|zckzah)|y[et]|z[amw])/i, // See block comment below
        domainPart = /[a-z0-9](?:[\-a-z0-9]*[a-z0-9])?/i,
        port = /\d{1,5}/,
        localpart = /[a-z0-9!#$%&'*+\/=?\^_`{|}~\-]+(?:\.[a-z0-9!#$%&'*+\/=?\^_`{|}~\-]+)*/i, // taken from: http://www.regular-expressions.info/email.html
        user = /[^:@\/]+/i,
        password = /[^:@\/]+?/i,
        scheme = /(?:ftp|https?|tel|sms)/i,
        path = /(?:\/[^ ]*)*/i;

    install.domain = new RegExp(domainPart.source + "\\." + tld.source, "i");
    install.subdomain = new RegExp("(?:" + domainPart.source + "\\.)*" + install.domain.source, "i");
    install.email = new RegExp(localpart.source + "@" + install.subdomain.source, "i");
    install.url = new RegExp(scheme.source + "://(?:" + user.source + "(?::" + password.source + ")?@)?" + install.subdomain.source + "(?::" + port.source + ")?(?:/" + path.source + ")?", "i"); // See http://www.ietf.org/rfc/rfc1738.txt
    install.mailto = new RegExp("mailto:" + install.email.source, "i"); // TODO: This needs to be improved

/*jslint floop:true*/
    for (name in install) {
        if (install.hasOwnProperty(name)) {
            (function (name) {
                if (install[name].test) {
                    validation.regex[name] = new RegExp("^" + install[name].source + "$", "i");
                    validation[name] = function (value) {
                        return validation.regex[name].test(value);
                    };
                } else {
                    validation[name] = install[name];
                }

                if (typeof Ext !== 'undefined' && Ext.onReady) {
                    Ext.define('One.validation', {
                        requires: [
                            'Ext.data.validations'
                        ]
                    });

                    Ext.onReady(function () {
                        if (window.Ext && Ext.data && Ext.data.validations) { // Sencha touch
                            Ext.data.validations[name] = function (config, value) {
                                return (value === null && config.optional) || validation[name](value);
                            };
                            if (messages[name]) {
                                Ext.data.validations[name + 'Message'] = messages[name];
                            }
                        }
                    });
                }
            }(name));
        }
    }
/*jslint floop:false*/

    // Browser
    if (typeof window !== 'undefined') {
        window.One = window.One || {};
        window.One.validation = validation;
    }

    // CommonJS
    if (typeof module !== 'undefined') {
        module.exports = validation;
    }
}());

/*
The tld regular expression is generated from this list: http://data.iana.org/TLD/tlds-alpha-by-domain.txt

This is the code used to generate the regex:

var tlds = [
    'AC',
    'AD',
    'AE',
    'AERO',
    'AF',
    'AG',
    'AI',
    'AL',
    'AM',
    'AN',
    'AO',
    'AQ',
    'AR',
    'ARPA',
    'AS',
    'ASIA',
    'AT',
    'AU',
    'AW',
    'AX',
    'AZ',
    'BA',
    'BB',
    'BD',
    'BE',
    'BF',
    'BG',
    'BH',
    'BI',
    'BIZ',
    'BJ',
    'BM',
    'BN',
    'BO',
    'BR',
    'BS',
    'BT',
    'BV',
    'BW',
    'BY',
    'BZ',
    'CA',
    'CAT',
    'CC',
    'CD',
    'CF',
    'CG',
    'CH',
    'CI',
    'CK',
    'CL',
    'CM',
    'CN',
    'CO',
    'COM',
    'COOP',
    'CR',
    'CU',
    'CV',
    'CX',
    'CY',
    'CZ',
    'DE',
    'DJ',
    'DK',
    'DM',
    'DO',
    'DZ',
    'EC',
    'EDU',
    'EE',
    'EG',
    'ER',
    'ES',
    'ET',
    'EU',
    'FI',
    'FJ',
    'FK',
    'FM',
    'FO',
    'FR',
    'GA',
    'GB',
    'GD',
    'GE',
    'GF',
    'GG',
    'GH',
    'GI',
    'GL',
    'GM',
    'GN',
    'GOV',
    'GP',
    'GQ',
    'GR',
    'GS',
    'GT',
    'GU',
    'GW',
    'GY',
    'HK',
    'HM',
    'HN',
    'HR',
    'HT',
    'HU',
    'ID',
    'IE',
    'IL',
    'IM',
    'IN',
    'INFO',
    'INT',
    'IO',
    'IQ',
    'IR',
    'IS',
    'IT',
    'JE',
    'JM',
    'JO',
    'JOBS',
    'JP',
    'KE',
    'KG',
    'KH',
    'KI',
    'KM',
    'KN',
    'KP',
    'KR',
    'KW',
    'KY',
    'KZ',
    'LA',
    'LB',
    'LC',
    'LI',
    'LK',
    'LR',
    'LS',
    'LT',
    'LU',
    'LV',
    'LY',
    'MA',
    'MC',
    'MD',
    'ME',
    'MG',
    'MH',
    'MIL',
    'MK',
    'ML',
    'MM',
    'MN',
    'MO',
    'MOBI',
    'MP',
    'MQ',
    'MR',
    'MS',
    'MT',
    'MU',
    'MUSEUM',
    'MV',
    'MW',
    'MX',
    'MY',
    'MZ',
    'NA',
    'NAME',
    'NC',
    'NE',
    'NET',
    'NF',
    'NG',
    'NI',
    'NL',
    'NO',
    'NP',
    'NR',
    'NU',
    'NZ',
    'OM',
    'ORG',
    'PA',
    'PE',
    'PF',
    'PG',
    'PH',
    'PK',
    'PL',
    'PM',
    'PN',
    'PR',
    'PRO',
    'PS',
    'PT',
    'PW',
    'PY',
    'QA',
    'RE',
    'RO',
    'RS',
    'RU',
    'RW',
    'SA',
    'SB',
    'SC',
    'SD',
    'SE',
    'SG',
    'SH',
    'SI',
    'SJ',
    'SK',
    'SL',
    'SM',
    'SN',
    'SO',
    'SR',
    'ST',
    'SU',
    'SV',
    'SY',
    'SZ',
    'TC',
    'TD',
    'TEL',
    'TF',
    'TG',
    'TH',
    'TJ',
    'TK',
    'TL',
    'TM',
    'TN',
    'TO',
    'TP',
    'TR',
    'TRAVEL',
    'TT',
    'TV',
    'TW',
    'TZ',
    'UA',
    'UG',
    'UK',
    'US',
    'UY',
    'UZ',
    'VA',
    'VC',
    'VE',
    'VG',
    'VI',
    'VN',
    'VU',
    'WF',
    'WS',
    'XN--0ZWM56D',
    'XN--11B5BS3A9AJ6G',
    'XN--80AKHBYKNJ4F',
    'XN--9T4B11YI5A',
    'XN--DEBA0AD',
    'XN--FIQS8S',
    'XN--FIQZ9S',
    'XN--FZC2C9E2C',
    'XN--G6W251D',
    'XN--HGBK6AJ7F53BBA',
    'XN--HLCJ6AYA9ESC7A',
    'XN--J6W193G',
    'XN--JXALPDLP',
    'XN--KGBECHTV',
    'XN--KPRW13D',
    'XN--KPRY57D',
    'XN--MGBAAM7A8H',
    'XN--MGBAYH7GPA',
    'XN--MGBERP4A5D4AR',
    'XN--O3CW4H',
    'XN--P1AI',
    'XN--PGBS0DH',
    'XN--WGBH1C',
    'XN--XKC2AL3HYE2A',
    'XN--YGBI2AMMX',
    'XN--ZCKZAH',
    'YE',
    'YT',
    'ZA',
    'ZM',
    'ZW'
];


var buckets = {};
for (var i = 0; i < tlds.length; i++) {
    var first = tlds[i].substring(0, 1),
        rest = tlds[i].substring(1);

    if (!buckets[first]) {
        buckets[first] = [];
    }

    buckets[first].push(rest);
}

var regexes = [];
for (prop in buckets) {
    var chars = [],
        strings = [],
        puny = [],
        arr = buckets[prop];

    for (var j = 0; j < arr.length; j++) {
        if (prop === 'X' && arr[j].substring(0,3) === 'N--') {
            puny.push(arr[j].substring(3));
            //strings.push(dePunyCode('X' + arr[j]); // TODO: depunycode
        } else if (arr[j].length === 1) {
            chars.push(arr[j]);
        } else {
            strings.push(prop + arr[j]);
        }
    }

    var results = [];
    if (chars.length) { results.push(prop + (chars.length > 1 ? '[' + chars.join('') + ']' : chars[0])); }
    if (strings.length) { results.push(strings.join('|')); }
    if (puny.length) { results.push('XN--(?:' + puny.join('|') + ')'); }

    regexes.push(results.join('|'));
}

console.log(regexes.join('|').toLowerCase());
*/
