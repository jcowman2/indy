/*
 * Private interfaces for the `process` component.
 *
 * Copyright (c) Joseph R Cowman
 * Licensed under MIT License (see https://github.com/jcowman2/indy)
 */

import { Emitter } from "../events";

export interface ProcessManager {
    readonly workingDirectory: string;
    spawnCommand(command: string): Promise<CommandResult>;
    spawnSequence(commands: string[], bail?: boolean): Promise<void>;
}

export interface CommandResult {
    code: number;
    output: string[];
}

export interface ProcessManagerArgs {
    workingDirectory: string;
    emitter: Emitter;
}
