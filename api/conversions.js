// CONVERSION TABLES FOR DECODING
var binToReg = {
    '00000' : '$zero',
    '00001' : '$at',
    '00010' : '$v0',
    '00011' : '$v1',
    '00100' : '$a0',
    '00101' : '$a1',
    '00110' : '$a2',
    '00111' : '$a3',
    '01000' : '$t0',
    '01001' : '$t1',
    '01010' : '$t2',
    '01011' : '$t3',
    '01100' : '$t4',
    '01101' : '$t5',
    '01110' : '$t6',
    '01111' : '$t7',
    '10000' : '$s0',
    '10001' : '$s1',
    '10010' : '$s2',
    '10011' : '$s3',
    '10100' : '$s4',
    '10101' : '$s5',
    '10110' : '$s6',
    '10111' : '$s7',
    '11000' : '$t8',
    '11001' : '$t9',
    '11010' : '$k0',
    '11011' : '$k1',
    '11100' : '$gp',
    '11101' : '$sp',
    '11110' : '$fp',
    '11111' : '$ra',
}

var opcodeToInst = {
    '000100' : 'beq rs, rt, imm',
    '000101' : 'bne rs, rt, imm',
    '000110' : 'blez rs, imm',
    '000111' : 'bgtz rs, imm',
    '001000' : 'addi rt, rs, imm',
    '001001' : 'addiu rt, rs, imm',
    '001010' : 'slti rt, rs, imm',
    '001011' : 'sltiu rt, rs, imm',
    '001100' : 'andi rt, rs, imm',
    '001101' : 'ori rt, rs, imm',
    '001110' : 'xori rt, rs, imm',
    '001111' : 'lui rt, imm',
    '100000' : 'lb rt, imm(rs)',
    '100001' : 'lh rt, imm(rs)',
    '100010' : 'lw rt, imm(rs)',
    '100100' : 'lbu rt, imm(rs)',
    '100101' : 'lhu rt, imm(rs)',
    '101000' : 'sb rt, imm(rs)',
    '101001' : 'sh rt, imm(rs)',
    '101011' : 'sw rt, imm(rs)'
}

var functToInst = {
    '000000' : 'sll rd, rt, shamt',
    '000010' : 'srl rd, rt, shamt',
    '000011' : 'sra rd, rt, shamt',
    '000100' : 'sllv rd, rt, rs',
    '000110' : 'srlv rd, rt, rs',
    '000111' : 'srav rd, rt, rs',
    '001000' : 'jr rs',
    '001001a' : 'jalr rd, rs', // CAN BE jalr rs IF rd = 31 SUPPLIED, CHECK IT
    '001001b' : 'jalr rs',
    '001100' : 'syscall',
    '010000' : 'mfhi rd',
    '010001' : 'mthi rs',
    '010010' : 'mflo rd',
    '010011' : 'mtlo rs',
    '011000' : 'mult rs, rt',
    '011001' : 'multu rs, rt',
    '011010' : 'div rs, rt',
    '011011' : 'divu rs, rt',
    '100000' : 'add rd, rs, rt',
    '100001' : 'addu rd, rs, rt',
    '100010' : 'sub rd, rs, rt',
    '100011' : 'subu rd, rs, rt',
    '100100' : 'and rd, rs, rt',
    '100101' : 'or rd, rs, rt',
    '100110' : 'xor rd, rs, rt',
    '100111' : 'nor rd, rs, rt',
    '101010' : 'slt rd, rs, rt',
    '101011' : 'sltu rd, rs, rt'
}


// CONVERSION TABLES FOR ENCODING
var regToBin = {
    '$zero' : '00000',
    '$at' : '00001',
    '$v0' : '00010',
    '$v1' : '00011',
    '$a0' : '00100',
    '$a1' : '00101',
    '$a2' : '00110',
    '$a3' : '00111',
    '$t0' : '01000',
    '$t1' : '01001',
    '$t2' : '01010',
    '$t3' : '01011',
    '$t4' : '01100',
    '$t5' : '01101',
    '$t6' : '01110',
    '$t7' : '01111',
    '$s0' : '10000',
    '$s1' : '10001',
    '$s2' : '10010',
    '$s3' : '10011',
    '$s4' : '10100',
    '$s5' : '10101',
    '$s6' : '10110',
    '$s7' : '10111',
    '$t8' : '11000',
    '$t9' : '11001',
    '$k0' : '11010',
    '$k1' : '11011',
    '$gp' : '11100',
    '$sp' : '11101',
    '$fp' : '11110',
    '$ra' : '11111',
    '$0' : '00000',
    '$1' : '00001',
    '$2' : '00010',
    '$3' : '00011',
    '$4' : '00100',
    '$5' : '00101',
    '$6' : '00110',
    '$7' : '00111',
    '$8' : '01000',
    '$9' : '01001',
    '$10' : '01010',
    '$11' : '01011',
    '$12' : '01100',
    '$13' : '01101',
    '$14' : '01110',
    '$15' : '01111',
    '$16' : '10000',
    '$17' : '10001',
    '$18' : '10010',
    '$19' : '10011',
    '$20' : '10100',
    '$21' : '10101',
    '$22' : '10110',
    '$23' : '10111',
    '$24' : '11000',
    '$25' : '11001',
    '$26' : '11010',
    '$27' : '11011',
    '$28' : '11100',
    '$29' : '11101',
    '$30' : '11110',
    '$31' : '11111'
}

// Fields rs, rt, rd, shamt, and imm will be mapped to a number representing which argument they are
// 1-3 correspond to args 1-3
// 4 corresponds to the offset
var instToFormat = {
    'sll' : {rd:1, rt:2, shamt:3, type:'r', code:'000000'},
    'srl' : {rd:1, rt:2, shamt:3, type:'r', code:'000010'},
    'sra' : {rd:1, rt:2, shamt:3, type:'r', code:'000011'},
    'sllv' : {rd:1, rt:2, rs:3, type:'r', code:'000100'},
    'srlv' : {rd:1, rt:2, rs:3, type:'r', code:'000110'},
    'srav' : {rd:1, rt:2, rs:3, type:'r', code:'000111'},
    'jr' : {rs:1, type:'r', code:'001000'},
    'jalr' : {type:'r', code:'001001'},
    'syscall' : {type:'r', code:'001100'},
    'mfhi' : {rd:1, type:'r', code:'010000'},
    'mthi' : {rs:1, type:'r', code:'010001'},
    'mflo' : {rd:1, type:'r', code:'010010'},
    'mtlo' : {rs:1, type:'r', code:'010011'},
    'mult' : {rs:1, rt:2, type:'r', code:'011000'},
    'multu' : {rs:1, rt:2, type:'r', code:'011001'},
    'div' : {rs:1, rt:2, type:'r', code:'011010'},
    'divu' : {rs:1, rt:2, type:'r', code:'011011'},
    'add' : {rd:1, rs:2, rt:3, type:'r', code:'100000'},
    'addu' : {rd:1, rs:2, rt:3, type:'r', code:'100001'},
    'sub' : {rd:1, rs:2, rt:3, type:'r', code:'100010'},
    'subu' : {rd:1, rs:2, rt:3, type:'r', code:'100011'},
    'and' : {rd:1, rs:2, rt:3, type:'r', code:'100100'},
    'or' : {rd:1, rs:2, rt:3, type:'r', code:'100101'},
    'xor' : {rd:1, rs:2, rt:3, type:'r', code:'100110'},
    'nor' : {rd:1, rs:2, rt:3, type:'r', code:'100111'},
    'slt' : {rd:1, rs:2, rt:3, type:'r', code:'101010'},
    'sltu' : {rd:1, rs:2, rt:3, type:'r', code:'101011'},
    'beq' : {rs:1, rt:2, imm:3, type:'i', code:'000100'},
    'bne' : {rs:1, rt:2, imm:3, type:'i', code:'000101'},
    'blez' : {rs:1, imm:2, type:'i', code:'000110'},
    'bgtz' : {rs:1, imm:2, type:'i', code:'000111'},
    'addi' : {rt:1, rs:2, imm:3, type:'i', code:'001000'},
    'addiu' : {rt:1, rs:2, imm:3, type:'i', code:'001001'},
    'slti' : {rt:1, rs:2, imm:3, type:'i', code:'001010'},
    'sltiu' : {rt:1, rs:2, imm:3, type:'i', code:'001011'},
    'andi' : {rt:1, rs:2, imm:3, type:'i', code:'001100'},
    'ori' : {rt:1, rs:2, imm:3, type:'i', code:'001101'},
    'xori' : {rt:1, rs:2, imm:3, type:'i', code:'001110'},
    'lui' : {rt:1, imm:2, type:'i', code:'001111'},
    'lb' : {rt:1, rs:2, imm:4, type:'i', code:'100000'},
    'lh' : {rt:1, rs:2, imm:4, type:'i', code:'100001'},
    'lw' : {rt:1, rs:2, imm:4, type:'i', code:'100010'},
    'lbu' : {rt:1, rs:2, imm:4, type:'i', code:'100100'},
    'lhu' : {rt:1, rs:2, imm:4, type:'i', code:'100101'},
    'sb' : {rt:1, rs:2, imm:4, type:'i', code:'101000'},
    'sh' : {rt:1, rs:2, imm:4, type:'i', code:'101001'},
    'sw' : {rt:1, rs:2, imm:4, type:'i', code:'101011'},
    'j' : {type:'j', code:'000010'},
    'jal' : {type:'j', code:'000011'}
}


// EXPORTING
var module = module || {}
module.exports = {
    binToReg: binToReg,
    opcodeToInst: opcodeToInst,
    functToInst: functToInst
}