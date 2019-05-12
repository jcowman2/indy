import { DependentScriptStages } from "../dependent";
import { RunnerLoadArgs } from "../runner";

export interface ConfigManager {
    getConfig(args: RunnerLoadArgs): DependentConfig;
}

export interface DependentConfig extends DependentScriptStages {
    path: string;
}
