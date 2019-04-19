import { Emitter, EVENT_LIST } from "../events";
import { Package, PackageLive, PackageLiveArgs } from "./interfaces";

export class PackageLiveImpl implements PackageLive {
    private _path: string;
    private _emitter: Emitter;
    private _pkg: Package;

    constructor(args: PackageLiveArgs) {
        this._path = args.path;
        this._emitter = args.emitter;
    }

    public async refresh() {
        this._pkg = await this._loadPackage(this._path);
    }

    public toStatic() {
        if (!this._pkg) {
            return undefined;
        }

        return { ...this._pkg };
    }

    private async _loadPackage(path: string) {
        try {
            return (await import(path)) as Package;
        } catch (e) {
            return this._emitter.emitAndThrow(
                EVENT_LIST.ERROR.COULD_NOT_RESOLVE_PACKAGE(path, e)
            );
        }
    }
}