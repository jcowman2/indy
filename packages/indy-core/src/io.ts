/*
 * Functions for writing formatted messages to stdout/stderr.
 *
 * Copyright (c) Joseph R Cowman
 * Licensed under MIT License (see https://github.com/jcowman2/indy)
 */

/**
 * Write a formatted message to the standard output stream.
 * @param msg The message.
 */
export const writeOut = (msg: string) => process.stdout.write(`${msg}\n`);

/**
 * Write a formatted message to the standard error stream.
 * @param msg Error message.
 * @param error Inner exception, if any.
 */
export const writeErr = (msg: string, error?: Error) => {
    process.stderr.write(`* INDY: ${msg}\n`);
    if (error !== undefined) {
        process.stderr.write(`${error.stack}\n`);
    }
};
