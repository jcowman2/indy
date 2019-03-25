/**
* Indy CLI
*
* Copyright (c) Joe Cowman
* Licensed under MIT License (see https://github.com/jcowman2/indy)
*/
import * as program from 'commander';
import { version as version$2, parse, args, help } from 'commander';

var version = "0.0.1";

var version$1 = "0.0.1";
var description = "An automatic regression finder and hotfix tester for Node modules.";

/*! *****************************************************************************
Copyright (c) Microsoft Corporation. All rights reserved.
Licensed under the Apache License, Version 2.0 (the "License"); you may not use
this file except in compliance with the License. You may obtain a copy of the
License at http://www.apache.org/licenses/LICENSE-2.0

THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
MERCHANTABLITY OR NON-INFRINGEMENT.

See the Apache Version 2.0 License for specific language governing permissions
and limitations under the License.
***************************************************************************** */

function __awaiter(thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

class Store {
    static getDependent(name) {
        return undefined; // TODO
    }
}

var trialCommand = (program) => program
    .command("trial <dependent>")
    .description("run the dependent's tests using the staged package")
    .action((dependent, args) => __awaiter(undefined, void 0, void 0, function* () {
    const dep = Store.getDependent(dependent);
}));

const description$1 = `${description}\nUsing indy-core v${version}.`;
version$2(version$1, "-v, --version").description(description$1);
trialCommand(program);
parse(process.argv);
if (!args.length) {
    help();
}
