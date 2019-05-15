/*
 * Index for the `process` component, which provides an internal interface
 * for spawning Node processes from various locations in the file system.
 *
 * Copyright (c) Joseph R Cowman
 * Licensed under MIT License (see https://github.com/jcowman2/indy)
 */

import { Provider } from "../interfaces";
import { ProcessManager, ProcessManagerArgs } from "./interfaces";
import { ProcessManagerImpl } from "./process-manager-impl";

export const processManagerProvider: Provider<
    ProcessManagerArgs,
    ProcessManager
> = args => new ProcessManagerImpl(args);

export { ProcessManager, ProcessManagerArgs };
export { CommandResult } from "./interfaces";
