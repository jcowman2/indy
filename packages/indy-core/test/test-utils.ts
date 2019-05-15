import { isAbsolute } from "path";
import { Runner, RunnerEventData } from "../";

// tslint:disable max-classes-per-file

/**
 * Tests the sequence of events generated in an e2e test.
 * Collapses multiple sequential events of the same code into one.
 */
export class EventTestRunner {
    public runner: Runner;
    public out: string[];

    constructor(testDebug = false) {
        this.out = [];

        let runner = new Runner()
            .on("info", data => this._handleData(data))
            .on("error", data => this._handleData(data));
        if (testDebug) {
            runner = runner.on("debug", data => this._handleData(data));
        }
        this.runner = runner;
    }

    public reset() {
        this.out = [];
    }

    public testSnapshot() {
        const collapsed = [];
        let mostRecent;
        for (const i of this.out) {
            if (i !== mostRecent) {
                collapsed.push(i);
                mostRecent = i;
            }
        }

        expect(collapsed.join("\n")).toMatchSnapshot();
    }

    private _handleData(data: RunnerEventData) {
        const value =
            data.type === "error"
                ? `** ERROR: ${data.code} **`
                : `${data.code}`;
        this.out.push(value);
    }
}

// LEGACY
export class TestableRunner {
    public runner: Runner;
    public out: string;
    public doPrint: boolean;
    public ignoreMessages: RegExp[];
    public redactInfo: boolean;
    public redactError: boolean;
    public doRemoveIndeterminateValues: any;

    constructor({
        doPrint = false,
        ignoreMessages = [],
        doRemoveIndeterminateValues = true,
        redactInfo = false,
        redactError = false
    }) {
        this.doPrint = doPrint;
        this.ignoreMessages = ignoreMessages;
        this.doRemoveIndeterminateValues = doRemoveIndeterminateValues;
        this.redactInfo = redactInfo;
        this.redactError = redactError;

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
        // return str.replace(/\s\s+/g, " ");
        // return str;
    }

    public removeIndeterminateValues(str: string) {
        return str
            .split(" ")
            .map(word => {
                let singleQuotes = false;
                if (word.match(/'.*'/)) {
                    singleQuotes = true;
                    word = word.substring(1, word.length - 1);
                }

                let result = word;

                if (word.startsWith("/") && isAbsolute(word)) {
                    // Remove paths
                    result = "[PATH REMOVED]";
                } else if (word.match(/\(?[0-9]+m?s\)?/)) {
                    // Remove times
                    result = "[TIME REMOVED]";
                }

                if (singleQuotes) {
                    result = `'${result}'`;
                }

                return result;
            })
            .join(" ");
    }

    public reset() {
        this.out = "";
    }

    private _handleData(data: RunnerEventData, error: boolean = false) {
        for (const pattern of this.ignoreMessages) {
            if (data.message.match(pattern)) {
                return;
            }
        }

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
