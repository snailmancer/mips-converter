const decode = require('../api/decode.js');

// Precedes every successful output by decode
const d = 'Decoded instruction: ';

test('Decode R-type instructions', () => {
    expect(decode('000000 11111 00000 00000 00000 001000')).toEqual(d + 'jr $ra');
    expect(decode('000000 01000 01001 10000 00000 100000')).toEqual(d + 'add $s0, $t0, $t1');
    expect(decode('000000 00000 01111 10100 01000 000000')).toEqual(d + 'sll $s4, $t7, 8');
    expect(decode('000000 00000 00000 00000 00000 001100')).toEqual(d + 'syscall');
    expect(decode('000000 01000 01001 00000 00000 011001')).toEqual(d + 'multu $t0, $t1');
});

test('Decode I-type instructions', () => {
    expect(decode('100010 01001 00010 0000000000001100')).toEqual(d + 'lw $v0, 12($t1)');
    expect(decode('001101 01001 01000 0000000101010100')).toEqual(d + 'ori $t0, $t1, 340');
    expect(decode('000110 00100 00000 0000000000010000')).toEqual(d + 'blez $a0, 16');
});

test('Decode J-type instructions', () => {
    expect(decode('000010 00000000001111111000110001')).toEqual(d + 'j 0xfe31');
    expect(decode('000011 01100010001100110100110010')).toEqual(d + 'jal 0x188cd32');
});

test('Decode bad inputs', () => {
    expect(decode('Hello').startsWith('Error')).toBeTruthy();
    expect(decode('This is a 32 character string!!!').startsWith('Error')).toBeTruthy();
    expect(decode('000000 01000 01001 00000 00000 010100').startsWith('Error')).toBeTruthy();
    expect(decode('010000 01000 01001 0000000000010100').startsWith('Error')).toBeTruthy();
    expect(decode('0001010').startsWith('Error')).toBeTruthy();
    expect(decode('000000 01000 01001 00000 00000 010100 0001').startsWith('Error')).toBeTruthy();
});