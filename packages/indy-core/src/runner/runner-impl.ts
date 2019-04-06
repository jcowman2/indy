import { MultipleDependents } from "../dependent";
import { RunnerEvent, RunnerEventData } from "../events";
import {
    IRunner,
    RunnerArgs,
    RunnerFluent,
    RunnerLoadArgs
} from "./interfaces";

export class Runner implements IRunner {
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
