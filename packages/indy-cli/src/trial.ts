import { Command } from "commander";
import Store from "./store";

export default (program: Command) =>
    program
        .command("trial <dependent>")
        .description("run the dependent's tests using the staged package")
        .action(async (dependent, args) => {
            const dep = Store.getDependent(dependent);
        });
