/*
 * Indy CLI.
 *
 * Copyright (c) Joseph R Cowman
 * Licensed under MIT License (see https://github.com/jcowman2/indy)
 */

import * as program from "commander";
import { Runner } from "indy-core";
import * as corePkg from "indy-core/package.json";
import * as pkg from "./../package.json";
import trialCommand from "./trial";

const description = `${pkg.description}\nUsing indy-core v${corePkg.version}.`;

program.version(pkg.version, "-v, --version").description(description);

// TODO
const indy = new Runner()
    .on("error", data => console.log(data.message))
    .on("warning", data => console.log(data.message))
    .on("info", data => console.log(data.message));

trialCommand(program, indy);

program.parse(process.argv);

if (!program.args.length) {
    program.help();
}
