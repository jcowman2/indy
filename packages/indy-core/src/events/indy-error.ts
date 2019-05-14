/*
 * Contains `IndyError`.
 *
 * Copyright (c) Joseph R Cowman
 * Licensed under MIT License (see https://github.com/jcowman2/indy)
 */

/**
 * Any error which is handled or expected by Indy.
 */
export class IndyError extends Error {
    /** The error's numeric event code. See `EVENT_LIST`. */
    public readonly code: number;

    /** The error's cause, if any exists. */
    public readonly cause: Error;

    constructor(message: string, code: number, cause?: Error) {
        let msg = message;

        if (msg.endsWith("\n")) {
            msg = msg.substring(0, msg.length - 1);
        }

        msg = `${msg} (Code: ${code})\n`;

        if (cause) {
            msg += ` ${cause.message}`;
        }

        super(msg);
        Object.setPrototypeOf(this, new.target.prototype);

        this.code = code;
        this.cause = cause;
    }
}
