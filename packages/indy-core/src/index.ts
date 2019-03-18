import { spawn } from "child_process";

const spawnCommand = (
    command: string,
    workingDirectory: string = process.cwd()
) =>
    new Promise(resolve => {
        const cmdTokens = command.split(" ");

        const child = spawn(cmdTokens[0], cmdTokens.slice(1), {
            cwd: workingDirectory,
            stdio: [process.stdin, process.stdout, "pipe"]
        });

        let success = true;

        child.stderr.on("data", data => {
            success = false;
            process.stderr.write(data);
        });

        child.on("exit", () => {
            resolve(success);
        });
    });

spawnCommand("npm test", "demo/indy-test-client").then(success =>
    process.stdout.write(`Process Finished. Successful? ${success}\n`)
);
