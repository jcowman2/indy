import { isAbsolute } from "path";
import { Runner } from "../";

export class TestableRunner {
    public runner: Runner;
    public out: string;

    constructor(
        public doPrint: boolean = false,
        public doRemoveIndeterminateValues = true
    ) {
        this.out = "";
        this.runner = new Runner()
            .on("info", data => {
                const msg = this.removeIndeterminateValues(data.message);
                this.out += msg;
                if (doPrint) {
                    process.stdout.write(msg);
                }
            })
            .on("debug", data => {
                const msg = this.removeIndeterminateValues(data.message);
                this.out += msg;
                if (doPrint) {
                    process.stdout.write(msg);
                }
            })
            .on("error", data => {
                const msg = this.removeIndeterminateValues(data.message);
                this.out += msg;
                if (doPrint) {
                    process.stderr.write(msg);
                }
            });
    }

    public testSnapshot() {
        expect(this.out).toMatchSnapshot();
    }

    public removeIndeterminateValues(str: string) {
        return str
            .replace(/\r\n|\r/g, "\n") // Remove carriage returns
            .split(" ")
            .map(word => {
                // Remove paths
                if (word.startsWith("/") && isAbsolute(word)) {
                    return "[PATH REMOVED]";
                }
                // Remove times
                if (word.match(/\(?[0-9]+m?s\)?/)) {
                    return "[TIME REMOVED]";
                }
                return word;
            })
            .join(" ");
    }
}
