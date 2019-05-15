/*
 * Index for the `package` component, which provides interfaces to
 * multiple views of a Node package's `package.json` file.
 *
 * Copyright (c) Joseph R Cowman
 * Licensed under MIT License (see https://github.com/jcowman2/indy)
 */

import { Provider } from "../interfaces";
import { PackageLive, PackageLiveArgs } from "./interfaces";
import { PackageLiveImpl } from "./package-live-impl";

export const packageLiveProvider: Provider<
    PackageLiveArgs,
    PackageLive
> = args => new PackageLiveImpl(args);

export { PackageLive, PackageLiveArgs };
export { Package } from "./interfaces";
