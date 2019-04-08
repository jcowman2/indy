import { spawn } from "child_process";
import { Emitter, EVENT_LIST } from "../events";
import {
    CommandResult,
    ProcessManager,
    ProcessManagerArgs
} from "./interfaces";

export class ProcessManagerImpl implements ProcessManager {
    public workingDirectory: string;
    public emitter: Emitter;

    constructor(args: ProcessManagerArgs) {
        this.workingDirectory = args.workingDirectory;
        this.emitter = args.emitter;
    }

    public spawnCommand(command: string) {
        return new Promise<CommandResult>((resolve, reject) => {
            const cmdTokens = command.split(" ");

            const cmd = cmdTokens[0];
            const args = cmdTokens.slice(1);
            const cwd = this.workingDirectory;

            this.emitter.emit(EVENT_LIST.DEBUG.SPAWN_COMMAND(cmd, args, cwd));

            const child = spawn(cmd, args, {
                cwd,
                stdio: [process.stdin, "pipe", "pipe"]
            });

            const output: string[] = [];

            child.stdout.on("data", (data: Buffer) => {
                const dataStr = data.toString();
                output.push(dataStr);
                this.emitter.emit(
                    EVENT_LIST.INFO.SPAWN_COMMAND_STDOUT(dataStr)
                );
            });

            child.stderr.on("data", (data: Buffer) => {
                const dataStr = data.toString();
                output.push(dataStr);
                this.emitter.emit(
                    EVENT_LIST.ERROR.SPAWN_COMMAND_STDERR(dataStr)
                );
            });

            child.on("exit", code => {
                const resolution = code === 0 ? resolve : reject;
                resolution({ code, output });
            });
        });
    }

    public spawnSequence(commands: string[], bail?: boolean) {
        if (commands.length === 0) {
            return Promise.resolve();
        }

        let commandIndex = 0;
        const execCommand = (cmd: string) =>
            this.spawnCommand(cmd)
                .then(reason => {
                    this.emitter.emit(
                        EVENT_LIST.DEBUG.SEQUENCE_CMD_COMPLETE(cmd, reason.code)
                    );
                })
                .catch(reason => {
                    this.emitter.emit(
                        EVENT_LIST.DEBUG.SEQUENCE_CMD_FAIL(
                            cmd,
                            reason.code,
                            bail
                        )
                    );

                    if (bail) {
                        this.emitter.emitAndThrow(
                            EVENT_LIST.ERROR.SPAWN_SEQUENCE_BAIL(cmd)
                        );
                    }
                })
                .finally(() => {
                    if (++commandIndex < commands.length) {
                        return execCommand(commands[commandIndex]);
                    }
                });

        return execCommand(commands[commandIndex]);
    }
}
