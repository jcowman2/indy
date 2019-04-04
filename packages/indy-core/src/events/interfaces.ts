import Emittery = require("emittery");

export type RunnerEvent = "ERROR" | "OUTPUT";

export interface RunnerEventData {
    type: RunnerEvent;
    code: number;
    message: string;
    payload?: any;
    cause?: Error;
}

export interface Emitter {
    emit(event: RunnerEventData): void;
    emitAndThrow(event: RunnerEventData): void;
}

export type TypedEmittery = Emittery.Typed<
    { OUTPUT: RunnerEventData; ERROR: RunnerEventData },
    RunnerEvent
>;
