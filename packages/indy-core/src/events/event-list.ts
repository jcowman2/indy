import { RunnerEvent } from "./interfaces";

// tslint:disable: object-literal-sort-keys
// tslint:disable-next-line: variable-name
export const RunnerEvents = {
    DEPENDENT_INIT_SUCCESSFUL: {
        code: 200,
        message: "Dependent initalized successfully.",
        type: RunnerEvent.OUTPUT
    },
    DEPENDENT_INIT_FAILED: (cause?: Error) => ({
        code: 500,
        message: "Initialization failed.",
        type: RunnerEvent.ERROR,
        cause
    })
};
