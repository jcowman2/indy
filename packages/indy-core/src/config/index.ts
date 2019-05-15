/*
 * Index for the `config` component, which provides a private interface
 * to the Indy configuration of the project that is running the tool.
 *
 * Copyright (c) Joseph R Cowman
 * Licensed under MIT License (see https://github.com/jcowman2/indy)
 */

import { Provider } from "../interfaces";
import { ConfigManagerImpl } from "./config-manager-impl";
import { ConfigManager } from "./interfaces";

export const configManagerProvider: Provider<void, ConfigManager> = () =>
    new ConfigManagerImpl();

export { ConfigManager };
export { DependentConfig } from "./interfaces";
