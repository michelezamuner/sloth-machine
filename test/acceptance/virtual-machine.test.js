const promisify = require('util').promisify;
const exec = promisify(require('child_process').exec);
const write = promisify(require('fs').writeFile);
const root = process.env['SC_SM_ROOT'];
const instructions = require('../../src/architecture/mnemonics/instructions');
const registers = require('../../src/architecture/mnemonics/registers');
const syscalls = require('../../src/architecture/mnemonics/syscalls');

describe('virtual machine', () => {
    it.skip('exits with program exit status', async () => {
        let output;
        let code;

        const expected = Math.floor(Math.random() * 0xFF);
        const program = `
            ${instructions.movi} ${registers.eax} 0x00 ${syscalls.exit}
            ${instructions.movi} ${registers.ebx} 0x00 0x${expected.toString(16)}
            ${instructions.movi} ${registers.ecx} 0x00 0x12
            ${instructions.syscall} 0x00 0x00 0x00
            ${instructions.movi} ${registers.eax} 0x00 ${syscalls.exit}
            ${instructions.movi} ${registers.ebx} 0x00 0x23
            ${instructions.syscall} 0x00 0x00 0x00
        `.trim().split(/\s+/).map(c => parseInt(c));
        const file = '/tmp/exits-with-program-exit-status.in';

        await write(file, Buffer.from(program), 'binary');

        try {
            const result = await exec(`${root}/bin/sm ${file}`);
            output = result.stdout;
            code = 0;
        } catch (e) {
            output = e.stderr;
            code = e.code;
        }

        expect(output).toBe('');
        expect(code).toBe(expected);
    });
});