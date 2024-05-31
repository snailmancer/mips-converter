// Conversion tables
// Through HTML, these will already be defined, otherwise (Unit Tests) we must require them from conversions.js
var regToBin = regToBin || require('../api//conversions.js').regToBin;
var instToFormat = instToFormat || require('../api//conversions.js').instToFormat;

// Takes in a MIPS instruction in string form such as 'addi $t0, $t1, 3'
// Converts it to an encoded MIPS instruction in 32-bit binary format
// Returns the encoded MIPS instruction as a 32-bit string OR an error message relating to bad inputs
function encode(input) {
    // Handle the syscall special case
    if(input === 'syscall') {
        return 'Encoded instruction: 000000 00000 00000 00000 00000 001100';
    }

    const regex = /([a-zA-z]{1,7}) ([$a-zA-z0-9]+)?(, )?([0-9]+)?\(?([$a-zA-z0-9]+)?\)?(, )?([$a-zA-z0-9]+)?/;

    // Test input to see if it matches the general instruction format 
    if(!regex.test(input)) {
        return 'Error: You must enter a valid MIPS Instruction (such as add $t0, $t2, $t3).';
    }

    // Get each part of the input using the regex
    const match = input.match(regex);
    const instruction = match[1];
    const arg1 = match[2];
    const offset = match[4];
    const arg2 = match[5];
    const arg3 = match[7];

    // Confirm that the given instruction is valid
    if(instToFormat[instruction] === undefined) {
        return 'Error: The instruction you provided [' + instruction + '] is not a valid MIPS Instruction or is not supported.';
    }

    // Confirm that only the required arguments were passed for the given instruction
    // If not, return error - wrong format for the given instruction
    if(!testGivenArguments(instruction, arg1, arg2, arg3, offset)) {
        return 'Error: You have not provided the proper arguments for the given instruction [' + instruction + '].';
    }

    // First find opcode.
        // need to find type (r, i, or j)
        // if r type, opcode is '000000'
            // otherwise, opcode is the code found in conversion table
        // if j type, put opcode and then convert arg1 into binary and return encoded result (any code below will be evaluating R type or I type)
    
    // Next, find rs
        // we need to know which arg is rs
        // When we know, convert that arg to binary from conversion table
            // If rs is not in the format, put '00000'
            // If register is invalid, return error
    
    // rt is same as rs

    // split paths here

    // For R type,
        // rd is the same as rs
        // shamt is the third argument only for sll, srl, and sra
            // if inst is not one of these, put '00000'
        // take code from conversion table to put funct code

    // For I type,
        // if format.offset is not undefined, that is the imm, convert to binary and add
            // otherwise, the imm is the last argument (either arg2 or arg3)
}

// Given an instruction, (up to) 3 arguments, and (potentially) an offset from the input,
// determines if the given arguments (i.e. those that are not undefined) match
// the arguments required by the instruction
// Returns true if the supplied arguments match the instruction, false otherwise
function testGivenArguments(instruction, arg1, arg2, arg3, offset) {
    // Handle the special case for instruction 'jalr'
    if(instruction === 'jalr') {
        return arg1 && !arg3 && !offset;
    }

    // Gets all of the values of the format object (includes required arguments)
    const requiredArgs = Object.values(instToFormat[instruction]);

    let ret = true;
    const givenArgs = [instruction, arg1, arg2, arg3, offset];

    for(let i = 1; i<=4; i++) {
        if(requiredArgs.includes(i)) {
            ret = ret && givenArgs[i]; // ret will become false if this argument is not given
        } else {
            ret = ret && !givenArgs[i]; // ret will become false if this argument is given
        }
    }

    return ret;
}

module.exports = encode;