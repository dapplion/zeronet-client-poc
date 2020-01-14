import ZeroFrameTs from "./zeroframe";

interface ZeronetDappnodeRegistryItem {
  name: string; // "Vipnode",
  zeronet: string; // "1HwWq3N43nDgsTXBH3PQUWPhKkXKgaZHWJ";
  apm?: string; // "vipnode.dnp.dappnode.eth";
  trusted?: boolean; // true;
}

interface ZeronetDappnodeRelease {
  version: string; // "0.1.0",
  ipfs: string; // "/ipfs/QmGAHSDJHVASJHDVJ",
}

async function fetchZeronetDappnodeRegistry(): Promise<
  ZeronetDappnodeRegistryItem[]
> {
  const zeroframe = ZeroFrameTs(zeronetDappnodeRegistry, {
    host: "zeronet.dappnode",
    port: 80
  });
  const registry = await zeroframe.fileGetJson<ZeronetDappnodeRegistryItem[]>(
    "registry.json"
  );
  zeroframe.close();
  return registry;
}

async function fetchZeronetDappnodeDirectory() {
  const registry = await fetchZeronetDappnodeRegistry();

  const directoryZeronet: any[] = [];

  for (const { name, zeronet } of registry) {
    try {
      const zeroframe = ZeroFrameTs(zeronet, {
        host: "zeronet.dappnode",
        port: 80
      });
      const releases = await zeroframe.fileGetJson<ZeronetDappnodeRelease[]>(
        "releases.json"
      );
      zeroframe.close();
      directoryZeronet.push({
        name,
        releases
      });
    } catch (e) {
      console.error(`Error getting zeronet DNP ${name} release: ${e.stack}`);
    }
  }

  console.log(JSON.stringify(directoryZeronet, null, 2));
}

fetchZeronetDappnodeDirectory();
