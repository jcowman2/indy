# indy-core
*An automatic regression finder, remote bug reproducer, and hotfix tester for Node packages*

## API

```ts
class Runner {
    constructor(args?: RunnerArgs)
    load(package: string, args?: RunnerLoadArgs): RunnerFluent
    loadAll(globs?: string[], args?: RunnerLoadArgs): MultipleDependents
    on(event: RunnerEvent, listener: (data: RunnerEventData) => void): RunnerFluent
}

interface RunnerArgs: {
    configLocation?: string
    workingDirectory?: string
}

enum RunnerEvent {
    OUTPUT, ERROR
}

interface RunnerEventData {
    eventType: RunnerEvent
    eventCode: number
    message: string
    payload?: any
}

interface RunnerFluent extends Runner, SingleDependent {}

interface DependentScriptStages {
    initCommands: string[]
    buildCommands: string[]
    testCommands: string[]
}

interface RunnerLoadArgs extends DependentScriptStages {
    path: string
}

interface Dependent {
    async init(commands?: string[]): void
    async build(commands?: string[]): void
    async test(commands?: string[]): void

    async passing(commands?: DependentScriptStages): void
    async failing(commands?: DependentScriptStages): void

    async swapDependency(name?: string, path?: string): boolean

    async reset(): void
    async update(): boolean

    async trial(args?: DependentTrialArgs): void
    async trialFix(args?: DependentTriaArgs): void
}

interface SingleDependent extends Dependent, DependentScriptStages {
    readonly pkg: Package
}

interface MultipleDependents extends Dependent {
    readonly list: SingleDependent[]
}

interface DependentTrailArgs {
    expectInitialFailure: boolean
}
```

## Usage

```ts
import { Runner } from "indy-core";
const indy = new Runner();

// Load a dependent package, either from the cache, a local directory, or by cloning from GitHub.
// Uses either a configuration file or API arguments.
const testPkg = indy.load("test-package");

// Run individual stages manually. Most of the time, this is not needed.
testPkg.init();
testPkg.build();
testPkg.test();

testPkg.swapDependency(); // Manually swap a package's dependency.

testPkg.reset(); // Force re-clone a package from GitHub.
testPkg.update(); // Pull any updates to a package from GitHub.

// Tests that a package still works correctly with the staged dependency.
// Will throw an error if the package's tests fail with either the live or the staged dependency.
// Also, will init and build the package if it hasn't happened yet.
testPackage.trial();

// Verifies the package tests fail with the live dependency, and pass with the staged dependency.
testPackage.trial({ expectInitialFailure: true });
testPackage.trialFix(); // Shorthand for the above line

// Verifies the package's tests are passing or failing in the current state.
testPackage.passing();
testPackage.failing();
```

*Copyright (c) Joe Cowman*