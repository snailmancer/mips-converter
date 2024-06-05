# MIPS Converter

An HTML/CSS/JavaScript Webapp for encoding and decoding MIPS Instructions.


## Encoding

Accepts a MIPS instruction and converts it to its 32-bit machine code format.

(EX: 'add $s0, $t0, $t1' 🠂 '000000 01000 01001 10000 00000 100000')


## Decoding

Accepts a 32-bit binary string and converts it to a MIPS instruction 

(EX: '100010 01001 00010 0000000000001100' 🠂 'lw $v0, 12($t1)')
