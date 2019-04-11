export class IndyError extends Error {
    public code: number;
    public cause: Error;

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
