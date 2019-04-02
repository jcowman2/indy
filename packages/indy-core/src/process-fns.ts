/*
 * Functions for interacting with Node processes.
 *
 * Copyright (c) Joseph R Cowman
 * Licensed under MIT License (see https://github.com/jcowman2/indy)
 */

import { spawn } from "child_process";
import { writeErr, writeOut } from "./io";

/** Custom error for failed commands. */
class CommandError extends Error {
    /** The name of the command that failed. */
    public command: string;
}

/**
 * Spawn a single child process as a promise, with stdin and stdout inherited
 * from the parent process.
 * @param command The command string to be executed. (i.e. "npm test")
 * @param workingDirectory The working directory in which the command should be executed.
 */
export const spawnCommand = (command: string, workingDirectory: string) =>
    new Promise((resolve, reject) => {
        const cmdTokens = command.split(" ");

        const child = spawn(cmdTokens[0], cmdTokens.slice(1), {
            cwd: workingDirectory,
            stdio: [process.stdin, "pipe", "pipe"]
        });

        const output = [];

        child.stdout.on("data", data => {
            output.push(data);
        });

        child.stderr.on("data", data => {
            output.push(data);
        });

        child.on("exit", code => {
            const resolution = code === 0 ? resolve : reject;
            resolution({ code, output });
        });
    });

/**
 * Execute a sequence of commands by spawning multiple child processes.
 * The promise will reject as soon as any of the commands fail, or it will
 * resolve if they all pass.
 * @param commands The array of command strings to be executed.
 * @param workingDirectory The working directory in which the commands should be executed.
 * @param bail Whether the process should bail when one command fails. Defaults to true.
 */
export const spawnSequence = (
    commands: string[],
    workingDirectory: string,
    bail: boolean = true
) => {
    if (commands.length === 0) {
        return Promise.resolve();
    }

    let commandIndex = 0;
    const execCommand = cmd =>
        spawnCommand(cmd, workingDirectory)
            .then(({ code, output }) => {
                if (output.length > 0) {
                    writeOut(output.join(" "));
                }
            })
            .catch(reason => {
                if (reason.output !== undefined && reason.output.length > 0) {
                    writeErr(reason.output.join(" "));
                }
                if (bail) {
                    const errorMsg =
                        reason.output === undefined
                            ? reason
                            : `An error occurred during '${cmd}'. See output for more information.`;
                    const err = new CommandError(errorMsg);
                    err.command = cmd;
                    throw err;
                }
            })
            .finally(() => {
                if (++commandIndex < commands.length) {
                    return execCommand(commands[commandIndex]);
                }
            });

    return execCommand(commands[commandIndex]);
};
