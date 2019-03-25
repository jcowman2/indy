/**
* Indy CLI
*
* Copyright (c) Joe Cowman
* Licensed under MIT License (see https://github.com/jcowman2/indy)
*/
import { version as version$2, parse, args, help } from 'commander';

var version = "0.0.1";

var version$1 = "0.0.1";
var description = "An automatic regression finder and hotfix tester for Node modules.";

const description$1 = `${description}\nUsing indy-core v${version}.`;
version$2(version$1, "-v, --version").description(description$1);
parse(process.argv);
if (!args.length) {
    help();
}
