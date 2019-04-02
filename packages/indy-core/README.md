# indy-core
*An automatic regression finder, remote bug reproducer, and hotfix tester for Node packages*

## Use Cases
1. As a maintainer for a popular Node package, I want to test that several projects which depend on my package do not fail when it is upgraded to the version I intend to publish.
2. As a maintainer for a Node package, I want to be able to easily reproduce bugs reported by developers who dependen on my package in their own projects and receive meaningful output.
3. As a maintainer for a Node package, I want to be able to easily check that a potential change to my package fixes the bug reported by a developer in their own repository.
4. As a busy developer, I want my regressions tests to run as quickly as possible.
5. As a busy developer, I want the testing tool to be easy to learn and produce positive results without much configuration.

## Requirements
* Must clone a repository from GitHub.
* Must load a package from the user's file system.
* Must run arbitrary scripts in the loaded package.
* Must allow specifying different "stages" of scripts:
    * Init: Run when the package is loaded for the first time.
    * Build: Run when the package's dependencies change.
    * Test: Run to test the package's behavior.
* Must allow loading a single package via the API.
* Must allow each stage of scripts to be run separately.


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