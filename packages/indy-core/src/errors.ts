export class IndyError extends Error {
    constructor(message: string, cause?: Error) {
        const msg = cause ? `${message} Caused by: ${cause.message}` : message;
        super(msg);
        Object.setPrototypeOf(this, new.target.prototype);
    }
}
