/**
* Indy CLI
*
* Copyright (c) Joe Cowman
* Licensed under MIT License (see https://github.com/jcowman2/indy)
*/
'use strict';

var program = require('commander');

var version = "0.0.1";

var version$1 = "0.0.1";
var description = "An automatic regression finder and hotfix tester for Node modules.";

const description$1 = `${description}\nUsing indy-core v${version}.`;
program.version(version$1, "-v, --version").description(description$1);
program.parse(process.argv);
if (!program.args.length) {
    program.help();
}
