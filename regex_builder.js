var fs = require('fs'),
    readline = require('readline');

var rd = readline.createInterface({
    input: fs.createReadStream('npa-nxx.csv'),
    output: process.stdout, terminal: false
});

var npa_nxx = {};

rd.on('line', function (line) {
    line = line.split(',')[1].split('-');

    var npa = line[0];
    var nxx = parseInt(line[1]);

    if (!(npa in npa_nxx)) {
        npa_nxx[npa] = [nxx];
        return;
    }

    npa_nxx[npa].push(nxx);
});

var missing = 0;
var matched = 0;

// Allowed ranges: [2–9] for the first digit, and [0-9] for the second and third digits.
// When the second and third digits of an area code are the same, that code is called an easily recognizable code (ERC).
// ERCs designate special services; e.g., 888 for toll-free service.
// The NANP is not assigning area codes with 9 as the second digit.



var npa_nxx_ranges = {};
var npa_nxx_range_size = {};
var npa_nxx_statements = {};

rd.on('close', function () {
    for (var npa in npa_nxx) {
        console.log(npa);

        var nxx = npa_nxx[npa];

        var ranges = [];
        var range_start = 0;
        var exists = false;

        for (var i = 200; i <= 999; i++) {
            exists = nxx.indexOf(i) !== -1;

            if(!exists)
            {
                missing++;
                //console.log('missing ' + i + ' in ' + npa);
            } else {
                matched++;
            }

            if (exists && range_start === 0) {
                range_start = i;
            }

            if (!exists && range_start !== 0) {
                ranges.push([range_start, i-1]);
                console.log("\t" + range_start + "-" + (i-1));
                range_start = 0;
            }
        }

        npa_nxx_ranges[npa] = ranges;
        npa_nxx_range_size[npa] = {};
        npa_nxx_statements[npa] = [];

        var range_sizes = {};

        for(var x = 0, len = ranges.length; x < len; x++)
        {
            var range = ranges[x];
            var range_size = range[1] - range[0];
            var range_conditional = '';

            range_sizes[range] = range[1] - range[0];

            if(range_size === 0)
            {
                range_conditional = '(n === ' + range[0] + ')';
                continue;
            }

            if(range_size === 1)
            {
                range_conditional = '(n === ' + range[0] + ' || n === ' + range[1] + ')';
                continue;
            }

            if(Math.abs(199 - range[0]) > (999 - range[1]))
            {
                range_conditional = ('n >= ' + range[0] + ' && n <= ' + range[1] + ')');
            } else {
                range_conditional = ('n <= ' + range[1] + ' && n >= ' + range[0] + ')');
            }

            npa_nxx_range_size[npa][range] = range_sizes;
            npa_nxx_statements[npa].push([range.join("-"), range_size, range_conditional]);
        }



    }

    console.log("missing: " + missing);
    console.log("matched:"  + matched);

   // console.log(npa_nxx_range_size);
   console.log(npa_nxx_statements);

    for(var npa in npa_nxx_statements)
    {
       // console.log(npa + ': ' + npa_nxx_statements[npa].length);
    }

});

function range(start, stop) {
    var alpha = 'abcdefghijklmnopqrstuvwxyz';

    var return_val = [];

    if (typeof start === 'string') {
        if (start.length > 1 || start.length === 0) {
            throw new Error('range accepts numeric values or letters (1-10, a-z, A-Z)');
        }

        //convert alpha to uppercase if input is uppercase
        if (start.toUpperCase() === start) {
            alpha = alpha.toUpperCase();
        }

        if (start > stop || start === stop || start.length !== 1 || stop.length !== 1) {
            throw new RangeError("start must be a single letter that comes before stop in the alphabet");
        }

        start = alpha.indexOf(start);
        stop = alpha.indexOf(stop);

        return alpha.slice(start, stop + 1).split('');
    }

    if (start > stop || start === stop) {
        throw new RangeError("start must be smaller than stop");
    }

    for (var x = start; x <= stop; x++) {
        return_val.push(x);
    }

    return return_val;
}

// List of area codes with geographic location:
// http://www.nanpa.com/enas/downloadGeoAreaCodeNumberReport.do

// http://www.nanpa.com/nanp1/allutlzd.zip
