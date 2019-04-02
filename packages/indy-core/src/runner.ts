import { Dependent, DependentScriptStages, SingleDependent } from "./dependent";
import { RunnerEvent, RunnerEventData } from "./events";

export class Runner {
    constructor(args?: RunnerArgs) {
        throw new Error("Not implemented.");
    }

    public load(pkg: string, args?: RunnerLoadArgs): RunnerFluent {
        throw new Error("Not implemented.");
    }

    public loadAll(
        globs?: string[],
        args?: RunnerLoadArgs
    ): MultipleDependents {
        throw new Error("Not implemented.");
    }

    public on(
        event: RunnerEvent,
        listener: (data: RunnerEventData) => void
    ): RunnerFluent {
        throw new Error("Not implemented.");
    }
}

export interface RunnerArgs {
    configLocation?: string;
    workingDirectory?: string;
}

export interface RunnerLoadArgs extends DependentScriptStages {
    path: string;
}

export interface RunnerFluent extends Runner, SingleDependent {}

export interface MultipleDependents extends Dependent {
    readonly list: SingleDependent[];
}
