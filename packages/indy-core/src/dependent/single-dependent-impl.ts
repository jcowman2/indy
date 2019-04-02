import { Emitter } from "../events";
import {
    DependentScriptStages,
    DependentTrialArgs,
    Package,
    SingleDependent,
    SingleDependentArgs
} from "./interfaces";
import { spawnSequence } from "../process-fns";

export class SingleDependentImpl implements SingleDependent {
    public pkg: Package;
    public initCommands: string[];
    public buildCommands: string[];
    public testCommands: string[];

    private rootDir: string;
    private emitter: Emitter;

    constructor(args: SingleDependentArgs) {
        this.initCommands = args.initCommands || [];
        this.buildCommands = args.buildCommands || [];
        this.testCommands = args.testCommands || [];

        this.rootDir = args.rootDir;
        this.emitter = args.emitter;
    }

    public async init(commands?: string[]) {
        return Promise.reject("Method not implemented.");
        // try {
        //     await spawnSequence(this.initCommands, this.rootDir);
        //     return writeOut("Dependent initialized successfully.");
        // } catch (e) {
        //     throw new IndyError("Initialization failed.", e);
        // }
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
