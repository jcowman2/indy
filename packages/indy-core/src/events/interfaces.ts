import Emittery = require("emittery");

export type RunnerEvent = "debug" | "info" | "warning" | "error";

export interface RunnerEventData {
    type: string;
    code: number;
    message: string;
    payload?: any;
    cause?: Error;
}

export interface Emitter {
    emit(event: RunnerEventData): void;
    emitAndThrow(event: RunnerEventData): never;
}

export type TypedEmittery = Emittery.Typed<
    { [key in RunnerEvent]: RunnerEventData },
    RunnerEvent
>;
