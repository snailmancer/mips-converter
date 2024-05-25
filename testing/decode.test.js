const decode = require('../api/decode.js');

// Precedes every successful output by decode
const d = 'Decoded instruction: ';

test('Decode R-type instructions', () => {
    // r
});

test('Decode I-type instructions', () => {
    // i
});

test('Decode J-type instructions', () => {
    expect(decode('000010 00000000001111111000110001')).toEqual(d + 'j 0xfe31');
});

test('Decode bad inputs', () => {
    // bad
});