/*
 * Class definition for a Dependent, which is a Node package that
 * depends on the package being tested.
 *
 * Copyright (c) Joseph R Cowman
 * Licensed under MIT License (see https://github.com/jcowman2/indy)
 */

import { join } from "path";
import { IndyError } from "./errors";
import { writeErr, writeOut } from "./io";
import { spawnSequence } from "./process-fns";

/** NPM commands to run at each stage of Indy testing. */
interface DependentCommands {
    /** Run once after the dependent is cloned. */
    initialize?: string[];

    /** Run every time the dependent's dependencies are changed. */
    build?: string[];

    /** Run to test whether the dependent's behavior is correct. */
    test?: string[];
}

/** A package which is dependent on the package being tested. */
export default class Dependent {
    public initializeCommands: string[];
    public buildCommands: string[];
    public testCommands: string[];

    /**
     * Construct a new Dependent.
     * @param rootDir The working directory of the dependent.
     */
    constructor(public rootDir: string, commands: DependentCommands) {
        this.initializeCommands = commands.initialize || [];
        this.buildCommands = commands.build || [];
        this.testCommands = commands.test || [];
    }

    /** Run the initialize commands. */
    public async initialize() {
        try {
            await spawnSequence(this.initializeCommands, this.rootDir);
            return writeOut("Dependent initialized successfully.");
        } catch (e) {
            throw new IndyError("Initialization failed.", e);
        }
    }

    /** Run the build commands. */
    public async build() {
        try {
            await spawnSequence(this.buildCommands, this.rootDir);
            return writeOut("Build successful.");
        } catch (e) {
            throw new IndyError("Build failed.", e);
        }
    }

    /** Run the test commands. */
    public async test() {
        try {
            await spawnSequence(this.testCommands, this.rootDir);
            return writeOut("All tests passed.");
        } catch (e) {
            throw new IndyError("One or more tests failed.", e);
        }
    }

    /**
     * Swap the dependent's dependency from the live version to the staged version.
     * @param name The name of the dependency.
     * @param dependencyPath The absolute path of the staged version.
     */
    public async swapDependency(name: string, dependencyPath: string) {
        let pkg;

        try {
            const packagePath = join(
                process.cwd(),
                this.rootDir,
                "package.json"
            );
            pkg = await import(packagePath);
        } catch (e) {
            throw new IndyError("Could not resolve a package.json file.", e);
        }

        if (
            pkg === undefined ||
            pkg.dependencies === undefined ||
            pkg.dependencies[name] === undefined
        ) {
            throw new IndyError(
                "Dependent doesn't have the required dependency."
            );
        }

        const liveVersion = pkg.dependencies[name];

        try {
            await spawnSequence(
                [`npm uninstall ${name}`, `npm i ${dependencyPath}`],
                this.rootDir,
                true
            );
            return writeOut(
                `Dependent's ${name}@${liveVersion} replaced with the staged version.`
            );
        } catch (e) {
            throw new IndyError("Could not swap dependency.", e);
        }
    }
}
