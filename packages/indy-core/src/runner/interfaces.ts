/*
 * Public and private interfaces for the `runner` component.
 *
 * Copyright (c) Joseph R Cowman
 * Licensed under MIT License (see https://github.com/jcowman2/indy)
 */

import {
    DependentScriptStages,
    MultipleDependents,
    SingleDependent
} from "../dependent";
import { RunnerEvent, RunnerEventData } from "../events";

// PUBLIC INTERFACES //

/**
 * An instance of the Indy automated regression testing tool.
 */
export interface IRunner {
    /**
     * Loads a `Dependent` for testing.
     * @param args The load arguments (see `RunnerLoadArgs`).
     * Note: `args.package` should be a path to the root level of the
     * dependent directory, relative to the current working directory.
     */
    load(args: RunnerLoadArgs): Promise<RunnerFluent>;

    // TODO
    loadAll(
        globs?: string[],
        args?: RunnerLoadArgs
    ): Promise<MultipleDependents>;

    /**
     * Attaches an event listener to the runner.
     *
     * `indy.on("error", data => console.error(data)).on("info", data => console.log(data));`
     * @param event The event type.
     * @param listener The callback for the event type.
     */
    on(event: RunnerEvent, listener: (data: RunnerEventData) => void): this;
}

/**
 * Arguments for `IRunner.load()`.
 */
export interface RunnerLoadArgs extends DependentScriptStages {
    /**
     * Path to the root level of the dependent directory,
     * relative to the current working directory.
     */
    package: string;
}

/** Chainable `IRunner`/`SingleDependent` combination. */
export type RunnerFluent = SingleDependent & IRunner;

// INTERNAL INTERFACES //

export interface RunnerArgs {
    configLocation?: string;
    workingDirectory?: string;
}
