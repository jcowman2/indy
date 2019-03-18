import { spawnSequence } from "./process-fns";

spawnSequence(["npm -v", "npm test"], "demo/indy-test-client")
    .then(() => process.stdout.write("INDY: Process finished successfully!\n"))
    .catch(() => process.stderr.write("INDY: Process failed.\n"));
