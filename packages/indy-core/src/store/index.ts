/*
 * Index for the `store` component, which provides a private interface
 * to the file system and any locally cached dependent packages.
 *
 * Copyright (c) Joseph R Cowman
 * Licensed under MIT License (see https://github.com/jcowman2/indy)
 */

import { Provider } from "../interfaces";
import { Store, StoreArgs } from "./interfaces";
import { StoreImpl } from "./store-impl";

export const storeProvider: Provider<StoreArgs, Store> = args =>
    new StoreImpl(args);

export { Store, StoreArgs };
