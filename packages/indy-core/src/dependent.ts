import { writeErr, writeOut } from "./io";
import { spawnSequence } from "./process-fns";

interface DependentCommands {
    initialize?: string[];
    build?: string[];
    test?: string[];
}

export default class Dependent {
    public initializeCommands: string[];
    public buildCommands: string[];
    public testCommands: string[];

    constructor(public rootDir: string, commands: DependentCommands) {
        this.initializeCommands = commands.initialize || [];
        this.buildCommands = commands.build || [];
        this.testCommands = commands.test || [];
    }

    public async initialize() {
        try {
            await spawnSequence(this.initializeCommands, this.rootDir);
            return writeOut("Dependent initialized successfully.");
        } catch (e) {
            return writeErr("Initialization failed.");
        }
    }

    public async build() {
        try {
            await spawnSequence(this.buildCommands, this.rootDir);
            return writeOut("Build successful.");
        } catch (e) {
            return writeErr("Build failed.");
        }
    }

    public async test() {
        try {
            await spawnSequence(this.testCommands, this.rootDir);
            return writeOut("All tests passed.");
        } catch (e) {
            return writeErr("One or more tests failed.");
        }
    }
}
