export { RunnerEvent, RunnerEventData, Emitter } from "./interfaces";
export { IndyError } from "./indy-error";
export { EVENT_LIST } from "./event-list";

import { Provider } from "../interfaces";
import { EmitterImpl } from "./emitter-impl";
import { Emitter } from "./interfaces";

export const emitterProvider: Provider<void, Emitter> = () => new EmitterImpl();
