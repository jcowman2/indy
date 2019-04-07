import { Provider } from "../interfaces";
import { ConfigManagerImpl } from "./config-manager-impl";
import { ConfigManager } from "./interfaces";

export const configManagerProvider: Provider<void, ConfigManager> = () =>
    new ConfigManagerImpl();

export { ConfigManager };
export { DependentConfig } from "./interfaces";
