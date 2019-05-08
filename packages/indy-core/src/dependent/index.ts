/*
 * Index for the `dependent` component, which provides a public API
 * for interacting with--and testing--the packages which depend on the staged package.
 *
 * Copyright (c) Joseph R Cowman
 * Licensed under MIT License (see https://github.com/jcowman2/indy)
 */

import { Provider } from "../interfaces";
import {
    PackageLive,
    PackageLiveArgs,
    SingleDependent,
    SingleDependentArgs
} from "./interfaces";
import { PackageLiveImpl } from "./package-live-impl";
import { SingleDependentImpl } from "./single-dependent-impl";

export const singleDependentProvider: Provider<
    SingleDependentArgs,
    SingleDependent
> = args => new SingleDependentImpl(args);

export const packageLiveProvider: Provider<
    PackageLiveArgs,
    PackageLive
> = args => new PackageLiveImpl(args);

export { SingleDependent, SingleDependentArgs, PackageLive, PackageLiveArgs };
export {
    Dependent,
    DependentScriptStages,
    DependentTrialArgs,
    MultipleDependents,
    Package
} from "./interfaces";
