import { join } from "path";
import { DependentConfig } from "../config";
import { SingleDependent, singleDependentProvider } from "../dependent";
import { Emitter, EVENT_LIST } from "../events";
import { ProcessManager, processManagerProvider } from "../process";
import { Store, StoreArgs } from "./interfaces";

export class StoreImpl implements Store {
    private _processManager: ProcessManager;
    private _emitter: Emitter;
    private _workingDirectory: string;

    constructor(args: StoreArgs) {
        this._emitter = args.emitter;
        this._processManager = args.processManager;
        this._workingDirectory = args.workingDirectory;
    }

    public async loadDependent(
        config: DependentConfig
    ): Promise<SingleDependent> {
        let packagePath = `<invalid: ${config.path}>`;

        try {
            const dependentCwd = join(this._workingDirectory, config.path);
            const dependentProcessManager = processManagerProvider({
                workingDirectory: dependentCwd,
                emitter: this._emitter
            });

            packagePath = join(dependentCwd, "package.json");
            const pkg = await import(packagePath);

            const dependent = singleDependentProvider({
                processManager: dependentProcessManager,
                rootDir: config.path,
                emitter: this._emitter,
                initCommands: config.initCommands,
                buildCommands: config.buildCommands,
                testCommands: config.testCommands,
                pkg
            });

            return dependent;
        } catch (e) {
            return this._emitter.emitAndThrow(
                EVENT_LIST.ERROR.COULD_NOT_LOAD_PACKAGE(packagePath, e)
            );
        }
    }
}
