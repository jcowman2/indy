/*
 * Public and private interfaces for the `events` component.
 *
 * Copyright (c) Joseph R Cowman
 * Licensed under MIT License (see https://github.com/jcowman2/indy)
 */

import Emittery from "emittery";

// PUBLIC INTERFACES //

/**
 * The type of event emitted by Indy.
 */
export type RunnerEvent = "debug" | "info" | "warning" | "error";

/**
 * The data contained in an event emitted by Indy.
 *
 * For a list of all possible events and their codes, see `EVENT_LIST`.
 */
export interface RunnerEventData {
    /** The event type (see `RunnerEvent`). */
    type: string;

    /** The event's numeric code. */
    code: number;

    /** The message transmitted by the event. */
    message: string;

    /** Any additional data contained by the event. Rarely used. */
    payload?: any;

    /**
     * If `type` is `"error"` and the event was caused by a JavaScript error,
     * that error will be contained here.
     */
    cause?: Error;
}

// INTERNAL INTERFACES //

export interface Emitter {
    emit(event: RunnerEventData): void;
    emitAndThrow(event: RunnerEventData): never;
    on(eventName: RunnerEvent, listener: (data: RunnerEventData) => void): void;
}

export type TypedEmittery = Emittery.Typed<
    { [key in RunnerEvent]: RunnerEventData },
    RunnerEvent
>;
