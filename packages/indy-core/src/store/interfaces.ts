import { SingleDependent } from "../dependent";
import { RunnerLoadArgs } from "../runner";

export interface Store {
    loadDependent(
        name: string,
        args?: RunnerLoadArgs
    ): Promise<SingleDependent>;
}
