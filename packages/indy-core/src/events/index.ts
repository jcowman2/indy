/*
 * Index for the `events` component, which provides monitoring
 * of the system's behavior through emitting events.
 *
 * Copyright (c) Joseph R Cowman
 * Licensed under MIT License (see https://github.com/jcowman2/indy)
 */

import { Provider } from "../interfaces";
import { EmitterImpl } from "./emitter-impl";
import { Emitter } from "./interfaces";

export const emitterProvider: Provider<void, Emitter> = () => new EmitterImpl();

export { Emitter };
export { RunnerEvent, RunnerEventData } from "./interfaces";
export { IndyError } from "./indy-error";
export { EVENT_LIST } from "./event-list";
