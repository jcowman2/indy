export const writeOut = (msg: string) =>
    process.stdout.write(`
***
* INDY: ${msg}
***
`);
export const writeErr = (msg: string) =>
    process.stderr.write(`
***
* INDY: ${msg}
***
`);
