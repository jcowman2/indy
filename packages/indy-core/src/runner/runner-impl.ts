import { ConfigManager, configManagerProvider } from "../config";
import {
    Emitter,
    emitterProvider,
    RunnerEvent,
    RunnerEventData
} from "../events";
import { ProcessManager, processManagerProvider } from "../process";
import { Store, storeProvider } from "../store";
import { IRunner, RunnerArgs, RunnerLoadArgs } from "./interfaces";

export class Runner implements IRunner {
    public workingDirectory: string;

    private _emitter: Emitter;
    private _processManager: ProcessManager;
    private _store: Store;
    private _configManager: ConfigManager;

    constructor(args: RunnerArgs = {}) {
        this.workingDirectory = args.workingDirectory || process.cwd();

        this._emitter = emitterProvider();
        this._processManager = processManagerProvider({
            emitter: this._emitter,
            workingDirectory: this.workingDirectory
        });
        this._store = storeProvider({
            emitter: this._emitter,
            processManager: this._processManager,
            workingDirectory: this.workingDirectory
        });
        this._configManager = configManagerProvider();
    }

    public async load(pkg: string, args?: RunnerLoadArgs) {
        const config = this._configManager.getConfig(pkg, args);
        const dependent = await this._store.loadDependent(config);
        const combination = Object.assign(dependent, this);
        return combination;
    }

    public loadAll(globs?: string[], args?: RunnerLoadArgs) {
        return Promise.reject("Not implemented.");
    }

    public on(
        event: RunnerEvent,
        listener: (data: RunnerEventData) => void
    ): this {
        this._emitter.on(event, listener);
        return this;
    }
}
