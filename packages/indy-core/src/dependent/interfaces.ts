import { Emitter } from "../events";
import { ProcessManager } from "../process";

/**
 * A package which is dependent on the package being tested.
 */
export interface Dependent {
    /**
     * Run the dependent's initialization commands.
     *
     * This step is run whenver a dependent is loaded for the first time,
     * and is rarely run manually. Fails if a command causes an error.
     * @param commands Optional overrides for the dependent's preconfigured initialization commands.
     */
    init(commands?: string[]): Promise<void>;
    /**
     * Run the dependent's build commands.
     *
     * This step is run whenever a dependent's dependencies change,
     * and is rarely run manually. Fails if a command causes an error.
     * @param commands Optional overrides for the dependent's preconfigured build commands.
     */
    build(commands?: string[]): Promise<void>;
    /**
     * Run the dependent's test commands. Fails if a command causes an error.
     * @param commands Optional overrides for the dependent's preconfigured test commands.
     */
    test(commands?: string[]): Promise<void>;

    passing(commands?: Partial<DependentScriptStages>): Promise<void>;
    failing(commands?: Partial<DependentScriptStages>): Promise<void>;

    /**
     * Swap one of the dependent's dependencies with another source.
     *
     * This step runs within trials, so there is rarely a need to call
     * this method directly unless you are doing something specific.
     *
     * @param dependency The name of the dependency.
     * @param replacement The new source to be installed. (i.e. a relative path
     * to a local version of the dependency.)
     * @returns A promise which resolves to true if the new dependency has a
     * different version than the old one, false otherwise.
     */
    swapDependency(dependency: string, replacement: string): Promise<boolean>;

    reset(): Promise<void>;
    update(): Promise<boolean>;

    trial(args?: DependentTrialArgs): Promise<void>;
    trialFix(args?: DependentTrialArgs): Promise<void>;
}

/**
 * The series of scripts to be run at each dependent stage.
 */
export interface DependentScriptStages {
    /** Run when the dependent loads for the first time. */
    initCommands: string[];

    /** Run when the dependent's dependencies change. */
    buildCommands: string[];

    /** Run to assess whether a dependent's status is passing or failing. */
    testCommands: string[];
}

export interface DependentTrialArgs {
    expectInitialFailure: boolean;
    dependency: string;
    replacement: string;
}

export interface SingleDependent extends Dependent, DependentScriptStages {
    readonly pkg: Package;
}

export interface MultipleDependents extends Dependent {
    readonly list: SingleDependent[];
}

export interface SingleDependentArgs extends Partial<DependentScriptStages> {
    processManager: ProcessManager;
    rootDir: string;
    emitter: Emitter;
    pkg: PackageLive;
}

// TODO
export interface Package {
    name: string;
    version: string;
    dependencies: { [key: string]: string };
}

export interface PackageLive {
    refresh(): Promise<void>;
    toStatic(): Package;
}

export interface PackageLiveArgs {
    path: string;
    emitter: Emitter;
}
