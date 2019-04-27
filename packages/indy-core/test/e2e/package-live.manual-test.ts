import { join } from "path";
import { PackageLive, packageLiveProvider } from "../../src/dependent";
import { emitterProvider } from "../../src/events";
import { processManagerProvider } from "../../src/process";

(async () => {
    const emitter = emitterProvider();
    emitter.on("info", data => console.log(data));
    emitter.on("debug", data => console.log(data));
    emitter.on("error", data => console.log(data));

    const pkgLive = packageLiveProvider({
        path: join(process.cwd(), "./resources/package.json"),
        emitter
    });

    await pkgLive.refresh();
    console.log(pkgLive.toStatic());

    const processManager = processManagerProvider({
        workingDirectory: join(process.cwd(), "./resources"),
        emitter
    });

    await processManager.spawnCommand("npm uninstall @jcowman/indy-broken-lib");

    await pkgLive.refresh();
    console.log(pkgLive.toStatic());

    await processManager.spawnCommand("npm install @jcowman/indy-broken-lib");

    await pkgLive.refresh();
    console.log(pkgLive.toStatic());
})();
