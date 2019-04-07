import { RunnerLoadArgs } from "../runner";

export interface ConfigManager {
    getConfig(name: string, args?: RunnerLoadArgs): DependentConfig;
}

export type DependentConfig = RunnerLoadArgs;
