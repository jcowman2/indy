export {
    CommandResult,
    ProcessManager,
    ProcessManagerArgs
} from "./interfaces";

import { Provider } from "../interfaces";
import { ProcessManager, ProcessManagerArgs } from "./interfaces";
import { ProcessManagerImpl } from "./process-manager-impl";

export const processManagerProvider: Provider<
    ProcessManagerArgs,
    ProcessManager
> = args => new ProcessManagerImpl(args);
