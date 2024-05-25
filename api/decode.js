// const conversions = require('./conversions.js');

// node decode.js [input]
// console.log(decode(process.argv[2]));

// Takes in an encoded MIPS instruction in 32-bit binary format
// Converts it to a MIPS instruction such as addi $t0, $t1, 3
// Returns the MIPS instruction as a string
function decode(input) {
    // Detect bad inputs
    // TODO: strip input of spaces
    input = input.replaceAll(' ', '');
    const regex = /[0-1]{32}/;
    if(!regex.test(input)) {
        return "You must enter an encoded MIPS instruction in 32-bit binary format.";
    }

    // First, determine the type of the instruction (R, I, or J)
    const opcode = parseInt(input.substring(0, 6), 2);
    if(opcode === 0) {
        return decodeRtype(input);
    } else if(opcode === 2 || opcode === 3) {
        return decodeJtype(input, opcode);
    } else if(opcode > 3) {
        return decodeItype(input, opcode);
    } else {
        return "You must enter a valid encoded MIPS instruction.";
    }
}

// Decodes an R-type instruction
function decodeRtype(input) {
    // Get the funct code
    let funct = input.substring(26);

    // Check special case for jalr instruction
    if(funct === '001001') {
        if(input.substring(16, 22) === '11111') {
            funct += 'b';
        } else {
            funct += 'a';
        }
    }

    // Get format info from table and replace each value (rs, rt, rd, shamt) with register/value from input
    const formatInfo = functToInst[funct];
    let ret = formatInfo.format;

    if(formatInfo.hasRS) {
        ret = ret.replace('rs', binToReg[input.substring(6, 11)]);
    }

    if(formatInfo.hasRT) {
        ret = ret.replace('rt', binToReg[input.substring(11, 16)]);
    }

    if(formatInfo.hasRD) {
        ret = ret.replace('rd', binToReg[input.substring(16, 21)]);
    }

    if(formatInfo.hasShamt) {
        ret = ret.replace('shamt', parseInt(input.substring(21, 26), 2));
    }

    return 'Decoded instruction: ' + ret;
}

// Decodes an I-type instruction
function decodeItype(input) {
    // Get the opcode
    const opcode = input.substring(0, 6);

    // Get the immediate value
    const imm = parseInt(input.substring(16), 2);

    // Get format info from table and replace each value (rs, rt, imm) with register/value from input
    const formatInfo = opcodeToInst[opcode];
    let ret = formatInfo.format;

    ret = ret.replace('imm', imm);

    if(formatInfo.hasRS) {
        ret = ret.replace('rs', binToReg[input.substring(6, 11)]);
    }

    if(formatInfo.hasRT) {
        ret = ret.replace('rt', binToReg[input.substring(11, 16)]);
    }

    return 'Decoded instruction: ' + ret;
}

// Decodes a J-type instruction
function decodeJtype(input, opcode) {
    const prefix = opcode === 2 ? "j " : "jal ";
    const address = "0x" + parseInt(input.substring(6), 2).toString(16); // Address in hexadecimal
    return 'Decoded instruction: ' + prefix + address;
}

module.exports = decode;