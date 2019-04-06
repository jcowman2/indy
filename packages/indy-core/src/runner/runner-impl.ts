import { MultipleDependents, SingleDependent } from "../dependent";
import { RunnerEvent, RunnerEventData } from "../events";
import { Store, storeProvider } from "../store";
import {
    IRunner,
    RunnerArgs,
    RunnerFluent,
    RunnerLoadArgs
} from "./interfaces";

export class Runner implements IRunner {
    private _store: Store;

    constructor(args?: RunnerArgs) {
        this._store = storeProvider();
    }

    public async load(pkg: string, args?: RunnerLoadArgs) {
        const dependent = await this._store.loadDependent(pkg, args);
        const combination = Object.assign(dependent, this);
        return combination;
    }

    public loadAll(globs?: string[], args?: RunnerLoadArgs) {
        return Promise.reject("Not implemented.");
    }

    public on(event: RunnerEvent, listener: (data: RunnerEventData) => void) {
        throw new Error("Not implemented.");
        return undefined;
    }
}
