import { Emitter } from "../events";

// PUBLIC INTERFACES //

/** A Node package's `package.json` file. */
export interface Package {
    name: string;
    version: string;
    dependencies: { [key: string]: string };
}

// PRIVATE INTERFACES //

export interface PackageLive {
    refresh(): Promise<void>;
    toStatic(): Package;
}

export interface PackageLiveArgs {
    path: string;
    emitter: Emitter;
}
