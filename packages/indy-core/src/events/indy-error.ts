export class IndyError extends Error {
    constructor(message: string, cause?: Error) {
        const msg = cause ? `${message} Cause: ${cause.message}` : message;
        super(msg);
        Object.setPrototypeOf(this, new.target.prototype);
    }
}
