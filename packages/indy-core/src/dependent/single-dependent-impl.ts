import { Emitter, EVENT_LIST } from "../events";
import { ProcessManager } from "../process";
import {
    DependentScriptStages,
    DependentTrialArgs,
    PackageLive,
    SingleDependent,
    SingleDependentArgs
} from "./interfaces";

export class SingleDependentImpl implements SingleDependent {
    public initCommands: string[];
    public buildCommands: string[];
    public testCommands: string[];

    private emitter: Emitter;
    private processManager: ProcessManager;
    private pkgLive: PackageLive;

    private isInitialized = false;
    private isBuilt = false;

    constructor(args: SingleDependentArgs) {
        this.pkgLive = args.pkg;

        this.initCommands = args.initCommands || [];
        this.buildCommands = args.buildCommands || [];
        this.testCommands = args.testCommands || [];

        this.emitter = args.emitter;
        this.processManager = args.processManager;
    }

    public get pkg() {
        return this.pkgLive.toStatic();
    }

    public async init(commands?: string[]) {
        this.emitter.emit(EVENT_LIST.INFO.DEPENDENT_INIT_START(this.pkg.name));

        this.isBuilt = false;
        const useCommands = this._chooseCommands(this.initCommands, commands);

        try {
            await this.processManager.spawnSequence(useCommands);
            this.isInitialized = true;

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

        if (!this.isInitialized) {
            this.emitter.emit(
                EVENT_LIST.WARNING.DEPENDENT_NOT_INITIALIZED(
                    this.pkg.name,
                    "build"
                )
            );
        }

        const useCommands = this._chooseCommands(this.buildCommands, commands);

        try {
            await this.processManager.spawnSequence(useCommands);
            this.isBuilt = true;

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

        if (!this.isInitialized) {
            this.emitter.emit(
                EVENT_LIST.WARNING.DEPENDENT_NOT_INITIALIZED(
                    this.pkg.name,
                    "test"
                )
            );
        }
        if (!this.isBuilt) {
            this.emitter.emit(
                EVENT_LIST.WARNING.DEPENDENT_NOT_BUILT(this.pkg.name, "test")
            );
        }

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

    public async swapDependency(dependency: string, replacement: string) {
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
            await this.processManager.spawnSequence([
                `npm uninstall ${dependency}`,
                `npm install ${replacement}`
            ]);

            await this.pkgLive.refresh();
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
        // TODO - add logs
        if (!this.isInitialized) {
            await this.init();
        }

        if (!this.isBuilt) {
            await this.build();
        }

        let error;

        try {
            await this.test();
        } catch (e) {
            error = e;
        }

        if (error) {
            if (!args.expectInitialFailure) {
                throw error;
            }
        } else {
            if (args.expectInitialFailure) {
                this.emitter.emitAndThrow(
                    EVENT_LIST.ERROR.DEPENDENT_TRIAL_EXPECTED_FAILURE(
                        this.pkg.name
                    )
                );
            }
        }

        await this.swapDependency(args.dependency, args.replacement);

        await this.test();

        await this.swapDependency(args.dependency, args.dependency);
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
