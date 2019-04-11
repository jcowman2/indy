import { isAbsolute } from "path";
import { Runner, RunnerEventData } from "../";

export class TestableRunner {
    public runner: Runner;
    public out: string;

    constructor(
        public doPrint = false,
        public doRemoveIndeterminateValues = true,
        public redactInfo = true,
        public redactError = false
    ) {
        this.out = "";
        this.runner = new Runner()
            .on("info", data => this._handleData(data))
            .on("debug", data => this._handleData(data))
            .on("error", data => this._handleData(data, true));
    }

    public testSnapshot() {
        expect(this.out).toMatchSnapshot();
    }

    public removeCarriageReturns(str: string) {
        return str.replace(/\r\n|\r/g, "\n");
    }

    public removeIndeterminateValues(str: string) {
        return str
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

    private _handleData(data: RunnerEventData, error: boolean = false) {
        let message = "";

        const skipCode = error ? 410 : 210;
        const redact =
            (error && this.redactError) || (!error && this.redactInfo);

        if (data.code === skipCode && redact) {
            const stream = error ? "ERR" : "OUT";
            message = `<Internal Process STD${stream}>\n`;
        } else {
            message = this.removeCarriageReturns(data.message);
            if (this.doRemoveIndeterminateValues) {
                message = this.removeIndeterminateValues(message);
            }
        }

        this.out += message;

        if (this.doPrint) {
            const stream = error ? process.stderr : process.stdout;
            stream.write(message);
        }
    }
}
