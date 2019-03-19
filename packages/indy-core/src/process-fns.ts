/*
 * Functions for interacting with Node processes.
 *
 * Copyright (c) Joseph R Cowman
 * Licensed under MIT License (see https://github.com/jcowman2/indy)
 */

import { spawn } from "child_process";

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
            stdio: [process.stdin, process.stdout, "pipe"]
        });

        let success = true;

        child.stderr.on("data", data => {
            success = false;
            process.stderr.write(`ERROR: ${data}`);
        });

        child.on("exit", () => {
            if (success) {
                resolve();
            } else {
                reject();
            }
        });
    });

/**
 * Execute a sequence of commands by spawning multiple child processes.
 * The promise will reject as soon as any of the commands fail, or it will
 * resolve if they all pass.
 * @param commands The array of command strings to be executed.
 * @param workingDirectory The working directory in which the commands should be executed.
 */
export const spawnSequence = (commands: string[], workingDirectory: string) =>
    commands.reduce(
        (previous, current) =>
            previous
                .then(() => spawnCommand(current, workingDirectory))
                .catch(() => {
                    throw new Error("Inner process failed.");
                }),
        new Promise(res => res())
    );
