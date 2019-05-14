/*
 * Contains the `trial` command, which trials a staged package with a locally installed dependent.
 *
 * Copyright (c) Joseph R Cowman
 * Licensed under MIT License (see https://github.com/jcowman2/indy)
 */

import { Command } from "commander";
import { Runner } from "indy-core";

const splitCommands = arg => {
    if (typeof arg !== "string") {
        throw new Error(
            `Argument must be of type string. Was type ${typeof arg}.`
        );
    } else {
        return arg.split(";").map(s => s.trim());
    }
};

export default (program: Command, indy: Runner) =>
    program
        .command("trial <dependent>")
        .description(
            "run the dependent's tests using the staged package. Should be a link relative to the current working directory."
        )
        .option(
            "-p --pkg <path>",
            "root directory (contains the package.json file) of the staged package. Defaults to the current working directory."
        )
        .option(
            "-i --init <commands>",
            "semicolon-delimited list of commands to run when the package is installed."
        )
        .option(
            "-b --build <commands>",
            "semicolon-delimited list of commands to run whenever the package's dependencies to change."
        )
        .option(
            "-t --test <commands>",
            'semicolon-delimited list of verification test commands to run. Defaults to "npm test".'
        )
        .option("-f --fix", "expect the initial run to fail.")
        .action(async (dependent, args) => {
            let pkg = ".";
            if (args.pkg) {
                pkg = args.pkg;
            }

            let initCommands = [];
            if (args.init) {
                initCommands = splitCommands(args.init);
            }

            let buildCommands = [];
            if (args.build) {
                buildCommands = splitCommands(args.build);
            }

            let testCommands = ["npm test"];
            if (args.test) {
                testCommands = splitCommands(args.test);
            }

            const dep = await indy.load({
                package: dependent,
                initCommands,
                buildCommands,
                testCommands
            });

            await dep.trial({
                replacement: pkg,
                expectInitialFailure: args.fix
            });
        });
