import { Emitter } from "../events";
import { ProcessManager } from "../process";

export interface Dependent {
    init(commands?: string[]): Promise<void>;
    build(commands?: string[]): Promise<void>;
    test(commands?: string[]): Promise<void>;

    passing(commands?: Partial<DependentScriptStages>): Promise<void>;
    failing(commands?: Partial<DependentScriptStages>): Promise<void>;

    swapDependency(dependency?: string, replacement?: string): Promise<boolean>;

    reset(): Promise<void>;
    update(): Promise<boolean>;

    trial(args?: DependentTrialArgs): Promise<void>;
    trialFix(args?: DependentTrialArgs): Promise<void>;
}

export interface DependentScriptStages {
    initCommands: string[];
    buildCommands: string[];
    testCommands: string[];
}

export interface DependentTrialArgs {
    expectInitialFailure: boolean;
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
