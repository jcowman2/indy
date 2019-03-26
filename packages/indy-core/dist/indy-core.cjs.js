/**
* Indy Core
*
* Copyright (c) Joe Cowman
* Licensed under MIT License (see https://github.com/jcowman2/indy)
*/
'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var path = require('path');
var child_process = require('child_process');

/*! *****************************************************************************
Copyright (c) Microsoft Corporation. All rights reserved.
Licensed under the Apache License, Version 2.0 (the "License"); you may not use
this file except in compliance with the License. You may obtain a copy of the
License at http://www.apache.org/licenses/LICENSE-2.0

THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
MERCHANTABLITY OR NON-INFRINGEMENT.

See the Apache Version 2.0 License for specific language governing permissions
and limitations under the License.
***************************************************************************** */

function __awaiter(thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

class IndyError extends Error {
    constructor(message, cause) {
        const msg = cause ? `${message} Caused by: ${cause.message}` : message;
        super(msg);
        Object.setPrototypeOf(this, new.target.prototype);
    }
}

/**
 * Write a formatted message to the standard output stream.
 * @param msg The message.
 */
const writeOut = (msg) => process.stdout.write(`${msg}\n`);
/**
 * Write a formatted message to the standard error stream.
 * @param msg Error message.
 * @param error Inner exception, if any.
 */
const writeErr = (msg, error) => {
    process.stderr.write(`* INDY: ${msg}\n`);
    if (error !== undefined) {
        process.stderr.write(`${error.stack}\n`);
    }
};

/** Custom error for failed commands. */
class CommandError extends Error {
}
/**
 * Spawn a single child process as a promise, with stdin and stdout inherited
 * from the parent process.
 * @param command The command string to be executed. (i.e. "npm test")
 * @param workingDirectory The working directory in which the command should be executed.
 */
const spawnCommand = (command, workingDirectory) => new Promise((resolve, reject) => {
    const cmdTokens = command.split(" ");
    const child = child_process.spawn(cmdTokens[0], cmdTokens.slice(1), {
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
const spawnSequence = (commands, workingDirectory, bail = true) => {
    if (commands.length === 0) {
        return Promise.resolve();
    }
    let commandIndex = 0;
    const execCommand = cmd => spawnCommand(cmd, workingDirectory)
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
            const errorMsg = reason.output === undefined
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

/** A package which is dependent on the package being tested. */
class Dependent {
    /**
     * Construct a new Dependent.
     * @param rootDir The working directory of the dependent.
     */
    constructor(rootDir, commands) {
        this.rootDir = rootDir;
        this.initializeCommands = commands.initialize || [];
        this.buildCommands = commands.build || [];
        this.testCommands = commands.test || [];
    }
    /** Run the initialize commands. */
    initialize() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield spawnSequence(this.initializeCommands, this.rootDir);
                return writeOut("Dependent initialized successfully.");
            }
            catch (e) {
                throw new IndyError("Initialization failed.", e);
            }
        });
    }
    /** Run the build commands. */
    build() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield spawnSequence(this.buildCommands, this.rootDir);
                return writeOut("Build successful.");
            }
            catch (e) {
                throw new IndyError("Build failed.", e);
            }
        });
    }
    /** Run the test commands. */
    test() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield spawnSequence(this.testCommands, this.rootDir);
                return writeOut("All tests passed.");
            }
            catch (e) {
                throw new IndyError("One or more tests failed.", e);
            }
        });
    }
    /**
     * Swap the dependent's dependency from the live version to the staged version.
     * @param name The name of the dependency.
     * @param dependencyPath The absolute path of the staged version.
     */
    swapDependency(name, dependencyPath) {
        return __awaiter(this, void 0, void 0, function* () {
            let pkg;
            try {
                const packagePath = path.join(process.cwd(), this.rootDir, "package.json");
                pkg = yield Promise.resolve(require(packagePath));
            }
            catch (e) {
                throw new IndyError("Could not resolve a package.json file.", e);
            }
            if (pkg === undefined ||
                pkg.dependencies === undefined ||
                pkg.dependencies[name] === undefined) {
                throw new IndyError("Dependent doesn't have the required dependency.");
            }
            const liveVersion = pkg.dependencies[name];
            try {
                yield spawnSequence([`npm uninstall ${name}`, `npm i ${dependencyPath}`], this.rootDir, true);
                return writeOut(`Dependent's ${name}@${liveVersion} replaced with the staged version.`);
            }
            catch (e) {
                throw new IndyError("Could not swap dependency.", e);
            }
        });
    }
}

exports.Dependent = Dependent;
