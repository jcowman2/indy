/*
 * Indy CLI.
 *
 * Copyright (c) Joseph R Cowman
 * Licensed under MIT License (see https://github.com/jcowman2/indy)
 */

import * as program from "commander";
import * as corePkg from "indy-core/package.json";
import * as pkg from "./../package.json";
import trialCommand from "./trial";

const description = `${pkg.description}\nUsing indy-core v${corePkg.version}.`;

program.version(pkg.version, "-v, --version").description(description);

trialCommand(program);

program.parse(process.argv);

if (!program.args.length) {
    program.help();
}
