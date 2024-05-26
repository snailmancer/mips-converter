// Conversion tables
// Through HTML, these will already be defined, otherwise (Unit Tests) we must require them from conversions.js

// Takes in a MIPS instruction in string form such as 'addi $t0, $t1, 3'
// Converts it to an encoded MIPS instruction in 32-bit binary format
// Returns the encoded MIPS instruction as a 32-bit string OR an error message relating to bad inputs
function encode(input) {
    const regex = /([a-zA-z]{1,7}) ?([$a-zA-z0-9]{1,})?(, )?([0-9]{1,})?\(?([$a-zA-z0-9]{1,})?\)?(, )?([$a-zA-z0-9]{1,})?/;
    const match = input.match(regex);

    // instruction = match[1]
    // arg1 = match[2]
    // offset = match[4]
    // arg2 = match[5]
    // arg3 = match[7]

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

module.exports = encode;