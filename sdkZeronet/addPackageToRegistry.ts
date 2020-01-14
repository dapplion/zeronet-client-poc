import ZeroFrame from "../zeroframe";
import { registryPath, releasesPath } from "../params";
import { DirectoryDnpStatus, RawDirectoryPackage } from "../types";
import { setRegistryMetadata, generateRegistryHtml } from "./siteMetadata";

/**
 * Releases a new version of a DAppnode Package to a ZeroNet site
 * It does so by writing into an entry into the releases.json file
 * If the file does not exists it will create one
 * Afterwards, it will sign and publish the site if there's a privateKey
 */
export default async function addPackageToRegistry(
  registryZeronetAddress: string,
  packageData: {
    apm?: string; // "monero.dnp.dappnode.eth",
    zeronet?: string; // "1PRSBRhuoCuocQVmxQZZ84JYDZPMQdqc8E",
    swarm?: string; // "cfb721a7dbed048007b273036068343eac412e77209384f06dd3524b59e03b16",
    // Metadata
    name: string;
    status?: DirectoryDnpStatus;
    isFeatured?: boolean;
    isTrusted?: boolean;
  },
  registryData: {
    owner: string;
  },
  privateKey: string
): Promise<void> {
  const zeroframe = ZeroFrame(registryZeronetAddress, {
    host: "127.0.0.1",
    port: 43110
  });

  // Fetch current releases or create an empty releases array
  const contentJson = await zeroframe.contentJsonGet();
  const currentFiles = contentJson.files;

  // Make sure this ZeroNet site is not a DAppNode package releases site
  if (currentFiles[releasesPath] && !currentFiles[registryPath])
    throw Error(
      `This site is a DAppNode package releases repo. Delete the ${releasesPath} file to continue`
    );

  const registry: RawDirectoryPackage[] = currentFiles[registryPath]
    ? await zeroframe.fileGetJson(registryPath)
    : [];

  if (!packageData.apm && !packageData.zeronet && !packageData.swarm)
    throw Error(`At least one dynamic source must be defined`);

  // #### Todo: Validate ZeroNet source
  // fetch releasesPath from packageData.zeronet

  const newPackage: RawDirectoryPackage = {
    name: packageData.name, // Make "name" appear first
    isTrusted: true,
    status: "Active",
    ...packageData
  };

  // Prepend new release and ignore releases for the same version if any
  const newRegistry = [
    newPackage,
    ...registry.filter(pkg => pkg.name !== packageData.name)
  ];
  await zeroframe.fileWrite(registryPath, JSON.stringify(newRegistry, null, 2));

  // Write HTML with a simple title
  await setRegistryMetadata(registryData, zeroframe);
  await generateRegistryHtml(zeroframe);

  // Sign site
  if (!privateKey) throw Error(`A private key must be provided`);
  await zeroframe.siteSign(privateKey);
  // If there are peers in the site publish it
  const siteInfo = await zeroframe.siteInfo();
  if (siteInfo.peers > 1) await zeroframe.sitePublish(privateKey);

  // Nicely close WebSocket
  zeroframe.close();
}
