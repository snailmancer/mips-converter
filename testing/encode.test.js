const encode = require('../api/encode.js');

const e = 'Encoded instruction: ';

test('Encode syscall', () => {
    expect(encode('syscall')).toEqual(e + '000000 00000 00000 00000 00000 001100');
});

test('Encode J-type instructions', () => {
    expect(encode('j 0xfe31')).toEqual(e + '000010 00000000001111111000110001');
    expect(encode('jal 0x188cd32')).toEqual(e + '000011 01100010001100110100110010');
});

test('Encode 1-arg instructions', () => {
    expect(encode('jr $ra')).toEqual(e + '000000 11111 00000 00000 00000 001000');
    expect(encode('mflo $t1')).toEqual(e + '000000 00000 00000 01001 00000 010010');
    expect(encode('jalr $t0')).toEqual(e + '000000 01000 00000 11111 00000 001000');
    expect(encode('jalr $t1, $t0')).toEqual(e + '000000 01000 00000 01001 00000 001000');
});

test('Encode 2-arg instructions', () => {
    expect(encode('multu $t0, $t1')).toEqual(e + '000000 01000 01001 00000 00000 011001');
    expect(encode('blez $a0, 16')).toEqual(e + '000110 00100 00000 0000000000010000');
});

test('Encode 3-arg instructions', () => {
    expect(encode('add $s0, $t0, $t1')).toEqual(e + '000000 01000 01001 10000 00000 100000');
    expect(encode('sll $s4, $t7, 8')).toEqual(e + '000000 00000 01111 10100 01000 000000');
    expect(encode('ori $t0, $t1, 340')).toEqual(e + '001101 01001 01000 0000000101010100');
});

test('Encode instructions with offset', () => {
    expect(encode('lw $v0, 12($t1)')).toEqual(e + '100010 01001 00010 0000000000001100');
    expect(encode('lbu $t0, 4($a0)')).toEqual(e + '100100 00100 01000 0000000000000100');
});

test('Encode bad inputs', () => {
    expect(encode('Hello').startsWith('Error')).toBeTruthy();
    expect(encode('23332').startsWith('Error')).toBeTruthy();
    expect(encode('add $reg, $reg, $reg').startsWith('Error')).toBeTruthy();
    expect(encode('funct $t0, $t1, $t2').startsWith('Error')).toBeTruthy();
    expect(encode('lw $v0, s($t1)').startsWith('Error')).toBeTruthy();
    expect(encode('1syscall').startsWith('Error')).toBeTruthy();
    expect(encode('add $t0, $t1, $t2 HELLO').startsWith('Error')).toBeTruthy();
    expect(encode('add $t0 $t1 $t2').startsWith('Error')).toBeTruthy();
    expect(encode('add$t0$t1$t2').startsWith('Error')).toBeTruthy();
    expect(encode('____').startsWith('Error')).toBeTruthy();
    expect(encode('').startsWith('Error')).toBeTruthy();
});

test('Encode wrong formats', () => {
    expect(encode('mult $t0, 12($t1)').startsWith('Error')).toBeTruthy();
    expect(encode('jr $t0, $t1, 23').startsWith('Error')).toBeTruthy();
    expect(encode('sra $t0, $t1').startsWith('Error')).toBeTruthy();
    expect(encode('sra $t0, $t1, $t2').startsWith('Error')).toBeTruthy();
    expect(encode('j $t0').startsWith('Error')).toBeTruthy();
    expect(encode('j $t0, $t4').startsWith('Error')).toBeTruthy();
    expect(encode('lb $t0, $t1').startsWith('Error')).toBeTruthy();
    expect(encode('beq $t0, $t1, $t2').startsWith('Error')).toBeTruthy();
    expect(encode('add $t0, $t1, 100').startsWith('Error')).toBeTruthy();
});

test('Test given arguments', () => {
    
});