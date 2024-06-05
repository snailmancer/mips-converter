// Conversion tables
// Through HTML, these will already be defined, otherwise (Unit Tests) we must require them from conversions.js
var regToBin = regToBin || require('./conversions.js').regToBin;
var instToFormat = instToFormat || require('./conversions.js').instToFormat;

// Takes in a MIPS instruction in string form such as 'addi $t0, $t1, 3'
// Converts it to an encoded MIPS instruction in 32-bit binary format
// Returns the encoded MIPS instruction as a 32-bit string OR an error message relating to bad inputs
function encode(input) {
    // Handle the syscall special case
    if(input === 'syscall') {
        return 'Encoded instruction: 000000 00000 00000 00000 00000 001100';
    }

    const regex = /^([a-zA-z]{1,7}) ([$a-zA-z0-9]+)?(, )?([0-9]+(?=\())?\(?([$a-zA-z0-9]+)?\)?(, )?([$a-zA-z0-9]+)?$/;

    // Test input to see if it matches the general instruction format 
    if(!regex.test(input)) {
        return 'Error: You must enter a valid MIPS Instruction (such as add $t0, $t2, $t3).';
    }

    // Get each part of the input using the regex
    const match = input.match(regex);

    // [instruction, arg1, arg2, arg3, offset]
    // Making this into a list so I can access each argument dynamically
    let args = [match[1], match[2], match[5], match[7], match[4]];

    // Confirm that the given instruction is valid
    if(instToFormat[args[0]] === undefined) {
        return 'Error: The instruction you provided [' + args[0] + '] is not a valid MIPS Instruction or is not supported.';
    }

    // Confirm that only the required arguments were passed for the given instruction
    // If not, return error - wrong format for the given instruction
    if(!testGivenArguments(args)) {
        return 'Error: You have not provided the proper arguments for the given instruction [' + args[0] + '].';
    }

    // Begin building the output
    let ret = 'Encoded instruction: ';
    const format = instToFormat[args[0]];

    // First, add the opcode to ret
    if(format.type === 'r') {
        ret += '000000 ';
    } else {
        ret += format.code + ' ';
        if(format.type === 'j') {
            // Construct encoded J-type instruction
            // Convert arg1 (hex value) to binary and prepend 0's until it is 26 chars long,
            // then append to ret and return it
            const address = parseInt(args[1], 16);
            if(address) {
                return ret + address.toString(2).padStart(26, '0');
            } else {
                return 'Error: The given address [' + args[1] + '] could not be converted from hexadecimal.';
            }
        }
    }

    // Handle the jalr special case here
    if(args[0] === 'jalr') {
        if(args[2]) {
            // rd is supplied, so specify their positions
            format.rs = 2;
            format.rd = 1;
        } else {
            // rd is not supplied, so we put in $ra as argument 2
            format.rs = 1;
            format.rd = 2;
            args[2] = '$ra';
        }
    }
    
    // From here on out, we are only dealing with R-type and I-type instructions, so rs and rt are present in both
    // Next, find which arg is the rs register, convert it to binary and append to ret
    if(format.rs) {
        // Get the given rs register and convert it to binary (if valid) 
        const reg = regToBin[args[format.rs]];
        if(reg) {
            ret += reg + ' ';
        } else {
            return 'Error: The given rs register [' + args[format.rs] + '] is invalid. Registers should be in the format "$t0" or "$17".';
        }
    } else {
        ret += '00000 ';
    }
    
    // Find which arg is the rt register, convert it to binary and append to ret
    if(format.rt) {
        // Get the given rt register and convert it to binary (if valid) 
        const reg = regToBin[args[format.rt]];
        if(reg) {
            ret += reg + ' ';
        } else {
            return 'Error: The given rt register [' + args[format.rt] + '] is invalid. Registers should be in the format "$t0" or "$17".';
        }
    } else {
        ret += '00000 ';
    }

    // The rest of the encoded result will differ greatly depending on type, so we split paths
    if(format.type === 'r') {
        // Find which arg is the rd register, convert it to binary and append to ret
        if(format.rd) {
            // Get the given rd register and convert it to binary (if valid) 
            const reg = regToBin[args[format.rd]];
            if(reg) {
                ret += reg + ' ';
            } else {
                return 'Error: The given rd register [' + args[format.rd] + '] is invalid. Registers should be in the format "$t0" or "$17".';
            }
        } else {
            ret += '00000 ';
        }

        // Find which arg is the shamt value, convert to binary (if valid)
        if(format.shamt) {
            const shamt = parseInt(args[format.shamt]);
            if(shamt) {
                if(shamt > 31 || shamt < 0) {
                    return 'Error: The given shamt value [' + args[format.shamt] + '] must be between 0-31.';
                } else {
                    ret += shamt.toString(2).padStart(5, '0') + ' ';
                }
            } else {
                return 'Error: The given shamt value [' + args[format.shamt] + '] is invalid.';
            }
        } else {
            ret += '00000 ';
        }

        // Append the funct code from conversions.js
        ret += format.code;
    } else {
        // By process of elimination, we are only dealing with I-type instructions here
        // Find which arg is the imm value, convert to binary (if valid)
        const imm = parseInt(args[format.imm]);
        if(imm) {
            if(imm > 65535 || imm < 0) {
                return 'Error: The given immediate value [' + args[format.imm] + '] must be between 0-65535.';
            } else {
                ret += imm.toString(2).padStart(16, '0');
            }
        } else {
            return 'Error: The given immediate value [' + args[format.imm] + '] is invalid.';
        }
    }

    return ret;
}

// Given an instruction, (up to) 3 arguments, and (potentially) an offset from the input,
// determines if the given arguments (i.e. those that are not undefined) match
// the arguments required by the instruction.
// Parameter givenArgs = [instruction, arg1, arg2, arg3, offset], such a list is already created in encode()
// Returns true if the supplied arguments match the instruction, false otherwise
function testGivenArguments(givenArgs) {
    // Handle the special case for instruction 'jalr'
    if(givenArgs[0] === 'jalr') {
        return givenArgs[1] && !givenArgs[3] && !givenArgs[4];
    }

    // Gets all of the values of the format object (includes required arguments)
    const requiredArgs = Object.values(instToFormat[givenArgs[0]]);
    let ret = true;

    for(let i = 1; i<=4; i++) {
        if(requiredArgs.includes(i)) {
            ret = ret && givenArgs[i]; // ret will become false if this argument is not given
        } else {
            ret = ret && !givenArgs[i]; // ret will become false if this argument is given
        }
    }

    return ret;
}

module.exports = {encode, testGivenArguments};