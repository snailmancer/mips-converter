// Takes in a MIPS instruction in string form such as 'addi $t0, $t1, 3'
// Converts it to an encoded MIPS instruction in 32-bit binary format
// Returns the encoded MIPS instruction as a 32-bit string OR an error message relating to bad inputs
function encode(input) {
    const regex = /(?<inst>[a-zA-z]{1,7}) ?(?<arg1>[$a-zA-z0-9]{1,})?(, )?(?<shamt>[0-9]{1,})?\(?(?<arg2>[$a-zA-z0-9]{1,})?\)?(, )?(?<arg3>[$a-zA-z0-9]{1,})?/;
    return 'Hello';
}

module.exports = encode;