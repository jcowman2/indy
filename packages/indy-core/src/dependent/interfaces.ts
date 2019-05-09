/*
 * Public and private interfaces for the `dependent` component.
 *
 * Copyright (c) Joseph R Cowman
 * Licensed under MIT License (see https://github.com/jcowman2/indy)
 */

import { Emitter } from "../events";
import { Package, PackageLive } from "../package";
import { ProcessManager } from "../process";

// PUBLIC INTERFACES //

/**
 * A package which is dependent on the package being tested.
 */
export interface Dependent {
    /**
     * Run the dependent's initialization commands.
     *
     * This step is run whenver a dependent is loaded for the first time,
     * and is rarely run manually. Fails if a command causes an error.
     * @param commands Optional overrides for the dependent's preconfigured initialization commands.
     */
    init(commands?: string[]): Promise<void>;

    /**
     * Run the dependent's build commands.
     *
     * This step is run whenever a dependent's dependencies change,
     * and is rarely run manually. Fails if a command causes an error.
     * @param commands Optional overrides for the dependent's preconfigured build commands.
     */
    build(commands?: string[]): Promise<void>;

    /**
     * Run the dependent's test commands. Fails if a command causes an error.
     * @param commands Optional overrides for the dependent's preconfigured test commands.
     */
    test(commands?: string[]): Promise<void>;

    /**
     * Resolves to whether the dependent's tests are passing with its current dependencies.
     * @param commands Optional overrides for any of the dependent's preconfigured commands.
     */
    passing(commands?: Partial<DependentScriptStages>): Promise<boolean>;

    /**
     * Swap one of the dependent's dependencies with another source.
     *
     * This step runs within trials, so there is rarely a need to call
     * this method directly unless you are doing something specific.
     *
     * @param replacement The new source to be installed. (i.e. a relative path
     * to a local version of the dependency.)
     * @returns A promise which resolves to true if the new dependency has a
     * different version than the old one, false otherwise.
     */
    swapDependency(replacement: string): Promise<boolean>;

    reset(): Promise<void>; // TODO
    update(): Promise<boolean>; // TODO

    /**
     * Runs a trial for the given dependency, ensuring the package's tests
     * still pass when the dependency is updated to the given replacement.
     *
     * Will throw an error if the dependent's tests are failing to begin with,
     * unless the `expectInitialFailure` argument is `true`.
     *
     * @param args The trial's configuration. See `DependentTrialArgs`.
     */
    trial(args: DependentTrialArgs): Promise<void>;

    /**
     * Runs a trial for the given dependency, expecting the package's tests
     * to be failing in its current state and then fixed when the dependency
     * is updated to the given replacement.
     *
     * Equivalent to calling `Dependent.trial()` with the `expectInitialFailure`
     * argument set to `true`. Will throw an error if the dependent's tests are
     * passing to begin with.
     *
     * @param args The trial's configuration. See `DependentTrialArgs`.
     */
    trialFix(args?: DependentTrialArgs): Promise<void>;
}

/**
 * The series of scripts to be run at each dependent stage.
 */
export interface DependentScriptStages {
    /** Run when the dependent loads for the first time. */
    initCommands: string[];

    /** Run when the dependent's dependencies change. */
    buildCommands: string[];

    /** Run to assess whether a dependent's status is passing or failing. */
    testCommands: string[];
}

/**
 * Arguments for running a trial for a staged package via `Dependent.trial()`.
 */
export interface DependentTrialArgs {
    /**
     * Whether the dependent's tests should be failing in its current state.
     * If left unspecified, the tests must pass or an error will be thrown.
     */
    expectInitialFailure?: boolean;

    /** The path of the staged dependency version to be swapped to. */
    replacement: string;
}

/**
 * A single dependent.
 */
export interface SingleDependent extends Dependent, DependentScriptStages {
    /** The dependent's `package.json` file. */
    readonly pkg: Package;
}

/**
 * A collection of dependents. Allows batch method calls on multiple dependents.
 */
export interface MultipleDependents extends Dependent {
    /** The list of individual dependents represented by this object. */
    readonly list: SingleDependent[];
}

// INTERNAL INTERFACES //

export interface SingleDependentArgs extends Partial<DependentScriptStages> {
    processManager: ProcessManager;
    rootDir: string;
    emitter: Emitter;
    pkg: PackageLive;
}
