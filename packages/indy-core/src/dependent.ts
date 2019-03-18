import { spawnSequence } from "./process-fns";

export default class Dependent {
    constructor(public rootDir: string, public testCommands: string[]) {}

    public runTest() {
        return spawnSequence(this.testCommands, this.rootDir)
            .then(() =>
                process.stdout.write("INDY: Process finished successfully!\n")
            )
            .catch(() => process.stderr.write("INDY: Process failed.\n"));
    }
}
