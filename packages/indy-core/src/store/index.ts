import { Provider } from "../interfaces";
import { Store, StoreArgs } from "./interfaces";
import { StoreImpl } from "./store-impl";

export const storeProvider: Provider<StoreArgs, Store> = args =>
    new StoreImpl(args);

export { Store, StoreArgs };
