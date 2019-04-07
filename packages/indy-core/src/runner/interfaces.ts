import {
    DependentScriptStages,
    MultipleDependents,
    SingleDependent
} from "../dependent";
import { RunnerEvent, RunnerEventData } from "../events";

export interface IRunner {
    load(pkg: string, args?: RunnerLoadArgs): Promise<RunnerFluent>;
    loadAll(
        globs?: string[],
        args?: RunnerLoadArgs
    ): Promise<MultipleDependents>;
    on(event: RunnerEvent, listener: (data: RunnerEventData) => void): this;
}

export interface RunnerArgs {
    configLocation?: string;
    workingDirectory?: string;
}

export interface RunnerLoadArgs extends DependentScriptStages {
    path: string;
}

export type RunnerFluent = SingleDependent & IRunner;