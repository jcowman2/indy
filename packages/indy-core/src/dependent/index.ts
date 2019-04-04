export {
    Dependent,
    DependentScriptStages,
    DependentTrialArgs,
    SingleDependent,
    SingleDependentArgs,
    MultipleDependents,
    Package
} from "./interfaces";

import { Provider } from "../interfaces";
import { SingleDependent, SingleDependentArgs } from "./interfaces";
import { SingleDependentImpl } from "./single-dependent-impl";

export const singleDependentProvider: Provider<
    SingleDependentArgs,
    SingleDependent
> = args => new SingleDependentImpl(args);
