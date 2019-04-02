import Emittery = require("emittery");

export enum RunnerEvent {
    OUTPUT = "output",
    ERROR = "error"
}

export interface RunnerEventData {
    type: RunnerEvent;
    code: number;
    message: string;
    payload?: any;
}

export type Emitter = Emittery.Typed<RunnerEventData, RunnerEvent>;

// tslint:disable: object-literal-sort-keys
// tslint:disable-next-line: variable-name
export const RunnerEvents = {
    DEPENDENT_INIT_SUCCESSFUL: {
        code: 200,
        message: "Dependent initalized successfully.",
        type: RunnerEvent.OUTPUT
    },
    DEPENDENT_INIT_FAILED: {
        code: 500,
        message: "Initialization failed.",
        type: RunnerEvent.ERROR
    }
};
