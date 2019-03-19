export const writeOut = (msg: string) =>
    process.stdout.write(`
***
* INDY: ${msg}
***
`);
export const writeErr = (msg: string, error?: any) => {
    process.stderr.write(`* INDY: ${msg}\n`);
    if (error !== undefined) {
        process.stderr.write(`Inner exception:\n${error}\n`);
    }
};
