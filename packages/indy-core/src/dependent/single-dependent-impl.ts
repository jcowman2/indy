/*
 * Contains the default internal implementation for `SingleDependent`.
 *
 * Copyright (c) Joseph R Cowman
 * Licensed under MIT License (see https://github.com/jcowman2/indy)
 */

import { join, relative } from "path";
import { Emitter, EVENT_LIST } from "../events";
import { PackageLive, packageLiveProvider } from "../package";
import { ProcessManager } from "../process";
import {
    DependentScriptStages,
    DependentTrialArgs,
    SingleDependent,
    SingleDependentArgs
} from "./interfaces";

export class SingleDependentImpl implements SingleDependent {
    public initCommands: string[];
    public buildCommands: string[];
    public testCommands: string[];

    public pkgLiveProvider = packageLiveProvider; // Allow modification for testing

    private emitter: Emitter;
    private processManager: ProcessManager;
    private pkgLive: PackageLive;
    private rootDir: string;

    private isInitialized = false;
    private isBuilt = false;

    constructor(args: SingleDependentArgs) {
        this.initCommands = args.initCommands || [];
        this.buildCommands = args.buildCommands || [];
        this.testCommands = args.testCommands || [];

        this.emitter = args.emitter;
        this.processManager = args.processManager;
        this.pkgLive = args.pkg;
        this.rootDir = args.rootDir;
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
        if (!this.isInitialized) {
            const initCommands = commands ? commands.initCommands : [];
            await this.init(initCommands);
        }

        if (!this.isBuilt) {
            const buildCommands = commands ? commands.buildCommands : [];
            await this.build(buildCommands);
        }

        try {
            const testCommands = commands ? commands.testCommands : [];
            await this.test(testCommands);
            return true;
        } catch (err) {
            return false;
        }
    }

    public async swapDependency(replacement: string, isLocalDir: boolean) {
        const dependencyName = isLocalDir
            ? (await this._loadPackage(replacement)).name
            : replacement;

        this.emitter.emit(
            EVENT_LIST.INFO.DEPENDENT_SWAP_START(this.pkg.name, dependencyName)
        );

        if (
            !(
                this.pkg &&
                this.pkg.dependencies &&
                this.pkg.dependencies[dependencyName]
            )
        ) {
            this.emitter.emitAndThrow(
                EVENT_LIST.ERROR.DEPENDENCY_NOT_FOUND(
                    this.pkg.name,
                    dependencyName
                )
            );
        }

        const originalVersion = this.pkg.dependencies[dependencyName];

        try {
            let installTarget: string;
            if (isLocalDir) {
                const cwdPath = join(process.cwd(), replacement);
                installTarget = relative(
                    this.processManager.workingDirectory,
                    cwdPath
                );
            } else {
                installTarget = replacement;
            }

            await this.processManager.spawnSequence([
                `npm uninstall ${dependencyName} --no-audit`,
                `npm install ${installTarget} --no-audit`
            ]);

            await this.pkgLive.refresh();
            const newVersion = this.pkg.dependencies[dependencyName];

            this.emitter.emit(
                EVENT_LIST.INFO.DEPENDENT_SWAP_SUCCESSFUL(
                    this.pkg.name,
                    dependencyName,
                    originalVersion,
                    newVersion
                )
            );
            return originalVersion !== newVersion;
        } catch (error) {
            return this.emitter.emitAndThrow(
                EVENT_LIST.ERROR.DEPENDENCY_SWAP_FAILED(
                    this.pkg.name,
                    dependencyName,
                    originalVersion,
                    replacement,
                    error
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

    public async trial(args: DependentTrialArgs) {
        const replacementPath = args.replacement;
        const replacementName = (await this._loadPackage(replacementPath)).name;

        this.emitter.emit(
            EVENT_LIST.INFO.DEPENDENT_TRIAL_START(
                this.pkg.name,
                replacementName,
                replacementPath
            )
        );

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

        await this.swapDependency(replacementPath, true);

        await this.test();

        await this.swapDependency(replacementName, false);
    }

    public async trialFix(args?: DependentTrialArgs) {
        return await this.trial({ ...args, expectInitialFailure: true });
    }

    /**
     * Helper function which uses overrides if they exist and reports it,
     * otherwise just uses the original commands.
     * @param original The default commands.
     * @param overrides Any overrides to be used instead of the defaults.
     */
    private _chooseCommands(original: string[], overrides: string[]) {
        if (overrides && overrides.length > 0) {
            this.emitter.emit(EVENT_LIST.INFO.DEPENDENT_USING_OVERRIDES);
            return overrides;
        }
        return original;
    }

    /**
     * Load a static `Package` from the given relative path.
     * @param path Path relative to the Node cwd to the directory containing the `package.json`.
     */
    private async _loadPackage(path: string) {
        const pkgPath = join(process.cwd(), path, "package.json");

        const pkg = this.pkgLiveProvider({
            emitter: this.emitter,
            path: pkgPath
        });

        await pkg.refresh();
        return pkg.toStatic();
    }
}
