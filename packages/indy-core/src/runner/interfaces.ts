import {
    DependentScriptStages,
    MultipleDependents,
    SingleDependent
} from "../dependent";
import { RunnerEvent, RunnerEventData } from "../events";

export interface IRunner {
    load(pkg: string, args?: RunnerLoadArgs): RunnerFluent;
    loadAll(globs?: string[], args?: RunnerLoadArgs): MultipleDependents;
    on(
        event: RunnerEvent,
        listener: (data: RunnerEventData) => void
    ): RunnerFluent;
}

export interface RunnerArgs {
    configLocation?: string;
    workingDirectory?: string;
}

export interface RunnerLoadArgs extends DependentScriptStages {
    path: string;
}

export interface RunnerFluent extends IRunner, SingleDependent {}
