/*
 * Private interfaces for the `config` component.
 *
 * Copyright (c) Joseph R Cowman
 * Licensed under MIT License (see https://github.com/jcowman2/indy)
 */

import { DependentScriptStages } from "../dependent";
import { RunnerLoadArgs } from "../runner";

export interface ConfigManager {
    getConfig(args: RunnerLoadArgs): DependentConfig;
}

export interface DependentConfig extends DependentScriptStages {
    path: string;
}
