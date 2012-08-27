var assert = require('assert');
var phoney = require('../phoney.js');

assert.throws(phoney.decodeVanity(''));
assert.throws(phoney.decodeVanity(null));
assert.throws(phoney.decodeVanity());
assert.throws(phoney.decodeVanity(17322919635));
assert.throws(phoney.decodeVanity({}));
assert.throws(phoney.decodeVanity([]));

assert.throws(phoney.formatPhone(''));
assert.throws(phoney.formatPhone(null));
assert.throws(phoney.formatPhone());
assert.throws(phoney.formatPhone(17322919635));
assert.throws(phoney.formatPhone([]));
assert.throws(phoney.formatPhone({}));

assert.throws(phoney.formatPhone('(732) 291-9635', ''));
assert.throws(phoney.formatPhone('(732) 291-9635', null));
assert.throws(phoney.formatPhone('(732) 291-9635'));
assert.throws(phoney.formatPhone('(732) 291-9635', 17322919635));
assert.throws(phoney.formatPhone('(732) 291-9635', []));
assert.throws(phoney.formatPhone('(732) 291-9635', {}));
assert.throws(phoney.formatPhone('(732) 291-9635', 'QQQ-ZZZ-WWWW'));

assert.equal(phoney.formatPhone('1-800-JEFF-NOW', 'I-AAA-BBB-CCCC'), '1-800-JEF-FNOW');
assert.equal(phoney.formatPhone('1-800-JEFF-NOW', 'I-AAA-BBB-CCCC', {decodeVanity: true}), '1-800-533-3669');
assert.equal(phoney.formatPhone('1-800-533-3669', 'I-AAA-BBB-CCCC', {decodeVanity: false}), '1-800-533-3669');

assert.equal(phoney.formatPhone('(732) 291-9635', 'AAA-BBB-CCCC'), '732-291-9635');
assert.equal(phoney.formatPhone('(732) 291.9635', '(AAA) BBB-CCCC'), '(732) 291-9635');

assert.equal(phoney.formatPhone('(732) 291-9635', 'aaa-bbb-cccc'), '732-291-9635');
assert.equal(phoney.formatPhone('(732) 291.9635', '(aaa) bbb-cccc'), '(732) 291-9635');
assert.equal(phoney.formatPhone('(732) 291 9635', 'aaa-bbb-cccc'), '732-291-9635');
assert.equal(phoney.formatPhone('732 291 9635', 'aaa-bbb-cccc'), '732-291-9635');
assert.equal(phoney.formatPhone('732.291.9635', 'i-aaa-bbb-cccc'), '1-732-291-9635');
assert.equal(phoney.formatPhone('1.732.291.9635', 'aaa-bbb-cccc'), '732-291-9635');
assert.equal(phoney.formatPhone('+1.732.291.9635', 'aaa-bbb-cccc'), '732-291-9635');
assert.equal(phoney.formatPhone('1-732-291-9635', 'aaa-bbb-cccc'), '732-291-9635');
assert.equal(phoney.formatPhone('732-291-9635', '+1.aaa.bbb.cccc'), '+1.732.291.9635');
assert.equal(phoney.formatPhone('1-732-291-9635', 'aaa-bbb-cccc'), '732-291-9635');
assert.equal(phoney.formatPhone('+1-732-291-9635', 'aaa-bbb-cccc'), '732-291-9635');
assert.equal(phoney.formatPhone('1 732 291 9635', 'aaa-bbb-cccc'), '732-291-9635');

assert.equal(phoney.decodeVanity('800-JEFF-NOW'), '800-533-3669');
assert.equal(phoney.decodeVanity('800-jeff-now'), '800-533-3669');
assert.equal(phoney.decodeVanity('1-800-JEFF-NOW', 'i-aaa-bbb-cccc'), '1-800-533-3669');
assert.equal(phoney.decodeVanity('1-800-jeff-now', 'i-aaa-bbb-cccc'), '1-800-533-3669');
assert.equal(phoney.decodeVanity('1-800-JEFF-NOW', '1-aaa-bbb-cccc'), '1-800-533-3669');
assert.equal(phoney.decodeVanity('1-800-jeff-now', '1-aaa-bbb-cccc'), '1-800-533-3669');

var test_text = 'Lorem ipsum +1-732-291-9635 dolor sit amet, consectetur adipiscing elit. (732) 291 9635 Suspendisse'
+ 'nec lectus ante, ut viverra odio. 1-732-290-9630 1-702-290-0635 +1-732-201-9635 Duis bibendum quam tellus. Donec ut '
+ ' rutrum tellus. Sed imperdiet convallis ullamcorper. Praesent consectetur quam 732-391-963 et felis tincidunt vitae '
+ ' interdum nisl fermentum. Sed ut elit lectus, 1712312(702)-242-2313414092 in dictum turpis. Ut purus urna, '
+ ' pellentesque et iaculis nec, eleifend at velit.';


assert.deepEqual(phoney.extractPhoneNumbers(test_text),
    [ '732-291-9635', '732-290-9630', '702-290-0635', '732-201-9635' ]);

assert.deepEqual(phoney.extractPhoneNumbers(test_text, null, {removeDupes: false}),
    ['732-291-9635','732-291-9635','732-290-9630','702-290-0635','732-201-9635']);

assert.deepEqual(phoney.extractPhoneNumbers(test_text, 'I-AAA-BBB-CCCC', {removeDupes: false}),
    ['1-732-291-9635','1-732-291-9635','1-732-290-9630','1-702-290-0635','1-732-201-9635']);

