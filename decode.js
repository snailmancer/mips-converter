// node decode.js [input]
console.log(decode(process.argv[2]));

// Takes in an encoded MIPS instruction in 32-bit binary format
// Converts it to a MIPS instruction such as addi $t0, $t1, 3
// Returns the MIPS instruction as a string
function decode(input) {
    // Detect bad inputs
    // TODO: strip input of spaces
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
    const funct = input.substring(26);
}

// Decodes an I-type instruction
function decodeItype(input, opcode) {

}

// Decodes a J-type instruction
function decodeJtype(input, opcode) {
    const prefix = opcode === 2 ? "j " : "jal ";
    const address = "0x" + parseInt(input.substring(6), 2).toString(16); // Address in hexadecimal
    return prefix + address;
}