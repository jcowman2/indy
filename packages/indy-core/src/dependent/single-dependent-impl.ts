import { Emitter, EVENT_LIST } from "../events";
import { ProcessManager } from "../process";
import {
    DependentScriptStages,
    DependentTrialArgs,
    Package,
    SingleDependent,
    SingleDependentArgs
} from "./interfaces";

export class SingleDependentImpl implements SingleDependent {
    public pkg: Package;
    public initCommands: string[];
    public buildCommands: string[];
    public testCommands: string[];

    private emitter: Emitter;
    private processManager: ProcessManager;

    constructor(args: SingleDependentArgs) {
        this.initCommands = args.initCommands || [];
        this.buildCommands = args.buildCommands || [];
        this.testCommands = args.testCommands || [];

        this.processManager = args.processManager;
        this.emitter = args.emitter;
    }

    public async init(commands?: string[]) {
        this.emitter.emit(EVENT_LIST.INFO.DEPENDENT_INIT_START(this.pkg.name));

        const useCommands = this._chooseCommands(this.initCommands, commands);

        try {
            await this.processManager.spawnSequence(useCommands);
            this.emitter.emit(
                EVENT_LIST.INFO.DEPENDENT_INIT_SUCCESSFUL(this.pkg.name)
            );
        } catch (e) {
            this.emitter.emitAndThrow(
                EVENT_LIST.ERROR.DEPENDENT_INIT_FAILED(e)
            );
        }
    }

    public async build(commands?: string[]) {
        this.emitter.emit(EVENT_LIST.INFO.DEPENDENT_BUILD_START(this.pkg.name));

        const useCommands = this._chooseCommands(this.buildCommands, commands);

        try {
            await this.processManager.spawnSequence(useCommands);
            this.emitter.emit(
                EVENT_LIST.INFO.DEPENDENT_BUILD_SUCCESSFUL(this.pkg.name)
            );
        } catch (e) {
            this.emitter.emitAndThrow(
                EVENT_LIST.ERROR.DEPENDENT_BUILD_FAILED(e)
            );
        }
    }

    public async test(commands?: string[]) {
        this.emitter.emit(EVENT_LIST.INFO.DEPENDENT_TEST_START(this.pkg.name));

        const useCommands = this._chooseCommands(this.testCommands, commands);

        try {
            await this.processManager.spawnSequence(useCommands);
            this.emitter.emit(
                EVENT_LIST.INFO.DEPENDENT_TEST_SUCCESSFUL(this.pkg.name)
            );
        } catch (e) {
            this.emitter.emitAndThrow(
                EVENT_LIST.ERROR.DEPENDENT_TEST_FAILED(e)
            );
        }
    }

    public async passing(commands?: DependentScriptStages) {
        return Promise.reject("Method not implemented.");
    }

    public async failing(commands?: DependentScriptStages) {
        return Promise.reject("Method not implemented.");
    }

    public async swapDependency(dependency?: string, replacement?: string) {
        this.emitter.emit(
            EVENT_LIST.INFO.DEPENDENT_SWAP_START(this.pkg.name, dependency)
        );

        if (
            !(
                this.pkg &&
                this.pkg.dependencies &&
                this.pkg.dependencies[dependency]
            )
        ) {
            this.emitter.emitAndThrow(
                EVENT_LIST.ERROR.DEPENDENCY_NOT_FOUND(this.pkg.name, dependency)
            );
        }

        const originalVersion = this.pkg.dependencies[dependency];

        try {
            await this.processManager.spawnSequence(
                [`npm uninstall ${dependency}`, `npm install ${replacement}`],
                true
            );

            const newVersion = this.pkg.dependencies[dependency];

            this.emitter.emit(
                EVENT_LIST.INFO.DEPENDENT_SWAP_SUCCESSFUL(
                    this.pkg.name,
                    dependency,
                    originalVersion,
                    newVersion
                )
            );
            return originalVersion !== newVersion;
        } catch (e) {
            return this.emitter.emitAndThrow(
                EVENT_LIST.ERROR.DEPENDENCY_SWAP_FAILED(
                    this.pkg.name,
                    dependency,
                    originalVersion,
                    replacement
                )
            );
        }
    }

    public async reset() {
        return Promise.reject("Method not implemented.");
    }

    public async update() {
        return Promise.reject("Method not implemented.");
    }

    public async trial(args?: DependentTrialArgs) {
        return Promise.reject("Method not implemented.");
    }

    public async trialFix(args?: DependentTrialArgs) {
        return Promise.reject("Method not implemented.");
    }

    /**
     * Helper function which uses overrides if they exist and reports it,
     * otherwise just uses the original commands.
     * @param original The default commands.
     * @param overrides Any overrides to be used instead of the defaults.
     */
    private _chooseCommands(original: string[], overrides: string[]) {
        if (overrides) {
            this.emitter.emit(EVENT_LIST.INFO.DEPENDENT_USING_OVERRIDES);
            return overrides;
        }
        return original;
    }
}