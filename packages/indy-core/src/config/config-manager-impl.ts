import { RunnerLoadArgs } from "../runner";
import { ConfigManager, DependentConfig } from "./interfaces";

export class ConfigManagerImpl implements ConfigManager {
    public getConfig(name: string, args?: RunnerLoadArgs): DependentConfig {
        return args; // TODO
    }
}
