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
        // TODO: override this.initCommands if commands argument specified

        try {
            await this.processManager.spawnSequence(this.initCommands);
            this.emitter.emit(EVENT_LIST.INFO.DEPENDENT_INIT_SUCCESSFUL);
        } catch (e) {
            this.emitter.emitAndThrow(
                EVENT_LIST.ERROR.DEPENDENT_INIT_FAILED(e)
            );
        }
    }

    public async build(commands?: string[]) {
        return Promise.reject("Method not implemented.");
    }

    public async test(commands?: string[]) {
        return Promise.reject("Method not implemented.");
    }

    public async passing(commands?: DependentScriptStages) {
        return Promise.reject("Method not implemented.");
    }

    public async failing(commands?: DependentScriptStages) {
        return Promise.reject("Method not implemented.");
    }

    public async swapDependency(name?: string, path?: string) {
        return Promise.reject("Method not implemented.");
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
}
