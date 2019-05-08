import { Command } from "commander";
import { Runner } from "indy-core";

export default (program: Command, indy: Runner) =>
    program
        .command("trial <dependent>")
        .description("run the dependent's tests using the staged package")
        .option(
            "-p --pkg <path>",
            "root directory (contains the package.json file) of the staged package. Defaults to the current working directory."
        )
        .action(async (dependent, args) => {
            let pkg = process.cwd();
            if (args.pkg) {
                pkg = args.pkg;
            }

            // TODO
            const initCommands = [];
            const buildCommands = [];
            const testCommands = [];

            const dep = await indy.load(dependent, {
                path: dependent,
                initCommands,
                buildCommands,
                testCommands
            });

            await dep.trial({
                replacement: pkg
            }); // TODO
        });
