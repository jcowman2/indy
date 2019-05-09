import { Provider } from "../interfaces";
import { PackageLive, PackageLiveArgs } from "./interfaces";
import { PackageLiveImpl } from "./package-live-impl";

export const packageLiveProvider: Provider<
    PackageLiveArgs,
    PackageLive
> = args => new PackageLiveImpl(args);

export { PackageLive, PackageLiveArgs };
export { Package } from "./interfaces";
