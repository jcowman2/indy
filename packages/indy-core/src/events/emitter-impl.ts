import Emittery from "emittery";
import { EVENT_LIST } from "./event-list";
import { IndyError } from "./indy-error";
import {
    Emitter,
    RunnerEvent,
    RunnerEventData,
    TypedEmittery
} from "./interfaces";

// This is a hack, maybe there's a better way around it
const isEventType = (o: string): o is RunnerEvent =>
    ["debug", "info", "warning", "error"].includes(o);

export class EmitterImpl implements Emitter {
    private _emitter = new Emittery() as TypedEmittery;

    public emit(event: RunnerEventData): void {
        if (isEventType(event.type)) {
            this._emitter.emit(event.type, event);
        } else {
            this.emitAndThrow(EVENT_LIST.ERROR.EMIT_ILLEGAL_EVENT(event.type));
        }
    }

    public emitAndThrow(event: RunnerEventData): never {
        this.emit(event);
        throw new IndyError(event.message, event.code, event.cause);
    }

    public on(
        eventName: RunnerEvent,
        listener: (data: RunnerEventData) => void
    ): void {
        this._emitter.on(eventName, listener);
    }
}
