export {
    Dependent,
    DependentScriptStages,
    DependentTrialArgs,
    SingleDependent,
    SingleDependentArgs,
    MultipleDependents,
    Package
} from "./interfaces";

import { SingleDependent, SingleDependentArgs } from "./interfaces";
import { SingleDependentImpl } from "./single-dependent-impl";

// tslint:disable-next-line: variable-name
export const SingleDependentProvider = (
    args: SingleDependentArgs
): SingleDependent => new SingleDependentImpl(args);
