/*
 * Interfaces for the private `store` component.
 *
 * Copyright (c) Joseph R Cowman
 * Licensed under MIT License (see https://github.com/jcowman2/indy)
 */

import { DependentConfig } from "../config";
import { SingleDependent } from "../dependent";
import { Emitter } from "../events";
import { ProcessManager } from "../process";

export interface Store {
    loadDependent(config: DependentConfig): Promise<SingleDependent>;
}

export interface StoreArgs {
    emitter: Emitter;
    processManager: ProcessManager;
    workingDirectory: string;
}
