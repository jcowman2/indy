import { IndyError } from "../..";
import { PackageLive, packageLiveProvider } from "../../src/dependent";
import { emitterProvider } from "../../src/events";

test("e2e: Package live", async done => {
    const emitter = emitterProvider();
    emitter.on("info", data => console.log(data));
    emitter.on("debug", data => console.log(data));
    emitter.on("error", data => console.log(data));

    const pkgLive = packageLiveProvider({
        path: "./packages/indy-core/test/e2e/resources/package.json",
        emitter
    });

    await pkgLive.refresh();
    console.log(pkgLive.toStatic());
    done();
});
