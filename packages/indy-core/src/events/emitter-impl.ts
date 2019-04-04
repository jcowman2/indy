import Emittery = require("emittery");
import {
    Emitter,
    RunnerEvent,
    RunnerEventData,
    TypedEmittery
} from "./interfaces";

export class EmitterImpl implements Emitter {
    private _emitter = new Emittery() as TypedEmittery;

    public emit(event: RunnerEventData): void {
        this._emitter.emit(event.type, event);
    }

    public emitAndThrow(event: RunnerEventData): void {
        throw new Error("Method not implemented.");
    }
}
