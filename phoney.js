(function (exports) {
    "use strict";

    var regexp = {
        phone_regex1 : /((?:(?:\+?1\s*(?:[.-]\s*)?)?(?:\(\s*([2-9]1[02-9]|[2-9][02-8]1|[2-9][02-8][02-9])\s*\)|([2-9]1[02-9]|[2-9][02-8]1|[2-9][02-8][02-9]))\s*(?:[.-]\s*)?)?([2-9]1[02-9]|[2-9][02-9]1|[2-9][02-9]{2})\s*(?:[.-]\s*)?([0-9]{4})(?:\s*(?:#|x\.?|ext\.?|extension)\s*(\d+))?)/gi,
        phone_regex2 : /(\d{1}\s\(\d{3}\)\s\d{3}-\d{4})/gi
    }


    //JS doesn't let us put a regexp on multiple lines without compiling it each time, this is ugly but performant
    //hack: facebook sometimes formats phone numbers as 1 (555) 555-5555 which is not matched by the first regex
    //TODO: add to first regexp

    function decodeVanity(phone, format) {
        if (typeof phone !== 'string' || phone === undefined || phone.length === 0) {
            return new Error("decodeVanity expects argument 'phone' as string!");
        }

        phone = phone
            .replace(/[abc]/gi, '2')
            .replace(/[def]/gi, '3')
            .replace(/[ghi]/gi, '4')
            .replace(/[jkl]/gi, '5')
            .replace(/[mno]/gi, '6')
            .replace(/[pqrs]/gi, '7')
            .replace(/[tuv]/gi, '8')
            .replace(/[wxyz]/gi, '9');

        return formatPhone(phone, format);
    }

    function extractPhoneNumbers(haystack, format, options) {

        options = options || {removeDupes: true};

        if (options && typeof options !== 'object') {
            return new Error("extractPhoneNumbers expects argument 'options' as object or undefined.");
        }

        if (format && typeof format !== 'string') {
            return new Error("extractPhoneNumbers expects argument 'format' as string or undefined.");
        }

        if (typeof haystack !== 'string' || haystack === undefined) {
            return new Error("extractPhoneNumbers expects argument 'haystack' as string!");
        }

        var phone_numbers = haystack.match(regexp.phone_regex1);

        if (phone_numbers === null) {
            phone_numbers = haystack.match(regexp.phone_regex2);
        }

        if (phone_numbers === null) {
            return false;
        } else {
            var return_val = [], phone = '';
            for (var x = 0, len = phone_numbers.length; x < len; x++) {
                phone = formatPhone(phone_numbers[x], format, options);
                if (options.removeDupes === false || return_val.indexOf(phone) === -1) {
                    return_val.push(phone);
                }
            }
            return return_val;
        }
    }

    function formatPhone(phone, format, options) {
        var a, b, c;

        format = format || 'aaa-bbb-cccc';
        //handle null values, assign defaults

        options = options || {decodeVanity: false};

        if (typeof phone !== 'string' || phone.length === 0) {
            return new Error("formatPhone expects argument 'phone' as string!");
        }

        if (typeof format !== 'string') {
            return new Error("formatPhone expects argument 'format' as string or undefined!");
        } else if (!format.match(/[+i1]*?.*[a]{0,3}.*[b]{3}.*[c]{4}/i)) {
            return new Error("formatPhone was passed an invalid 'format' argument; see documentation.");
        }

        if (options.decodeVanity) {
            phone = decodeVanity(phone);
        }

        phone = phone.replace(/[^a-z\d]/gi, '');
        //remove non-alphanumeric characters and underscores

        if (phone.length === 11) {
            //remove country code to separate digit groups
            phone = phone.slice(1);
        }

        if (phone.length === 10) {
            a = phone.slice(0, 3);
            phone = phone.slice(3);
        }

        if (phone.length === 7) {
            b = phone.slice(0, 3);
            c = phone.slice(3, 7);
        }

        return format
            .replace(/i/i, '1')
            .replace(/a{3}/i, a)
            .replace(/b{3}/i, b)
            .replace(/c{4}/i, c);
    }

    function stripNonNumeric(str) {
        //strip non-numeric characters from a string

        if (typeof str === 'string') {
            return str.replace(/[^0-9]+/g, '');
        } else {
            return new Error("stripNonNumeric expects string as argument!");
        }
    }

   exports.formatPhone = formatPhone;
   exports.decodeVanity = decodeVanity;
   exports.extractPhoneNumbers = extractPhoneNumbers;

}('undefined' !== typeof exports && exports || new Function('return this')()));