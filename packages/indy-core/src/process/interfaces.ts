import { Emitter } from "../events";

export interface ProcessManager {
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
