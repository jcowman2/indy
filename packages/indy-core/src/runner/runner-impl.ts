/*
 * Contains the default public implementation for `IRunner`.
 *
 * Copyright (c) Joseph R Cowman
 * Licensed under MIT License (see https://github.com/jcowman2/indy)
 */

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

/**
 * An instance of the Indy automated regression testing tool.
 *
 * Implements `IRunner`.
 */
export class Runner implements IRunner {
    private workingDirectory: string;

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

    public async load(args: RunnerLoadArgs) {
        const config = this._configManager.getConfig(args);
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
