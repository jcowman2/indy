/*
 * Contains the default internal implementation for `ConfigManager`.
 *
 * Copyright (c) Joseph R Cowman
 * Licensed under MIT License (see https://github.com/jcowman2/indy)
 */

import { RunnerLoadArgs } from "../runner";
import { ConfigManager, DependentConfig } from "./interfaces";

export class ConfigManagerImpl implements ConfigManager {
    public getConfig(args: RunnerLoadArgs): DependentConfig {
        const path = args.package; // TODO - this will check the config and the store

        return {
            initCommands: args.initCommands,
            buildCommands: args.buildCommands,
            testCommands: args.testCommands,
            path
        };
    }
}
