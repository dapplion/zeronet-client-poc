import ZeroFrame from "../zeroframe";
import { releasesPath, registryPath } from "../params";
import { setRepoMetadata, generateRepoHtml } from "./siteMetadata";
import { RepoData, RawRelease } from "../types";

/**
 * Releases a new version of a DAppnode Package to a ZeroNet site
 * It does so by writing into an entry into the releases.json file
 * If the file does not exists it will create one
 * Afterwards, it will sign and publish the site if there's a privateKey
 */
export default async function releasePackageVersion(
  dnpZeronetAddress: string,
  releaseData: {
    ipfs?: string; // "/ipfs/QmGAHSDJHVASJHDVJ"
    swarm?: string; // "c2a46c7a8c968a746c6c7a89c54ac2a345ca32a3"
    // Metadata
    version: string; // "0.2.4"
    status?: string; // "Deprecated" | "Stable" }
  },
  repoData: RepoData,
  privateKey: string
): Promise<void> {
  const zeroframe = ZeroFrame(dnpZeronetAddress, {
    host: "127.0.0.1",
    port: 43110
  });

  // Fetch current releases or create an empty releases array
  const contentJson = await zeroframe.contentJsonGet();
  const currentFiles = contentJson.files;

  // Make sure this ZeroNet site is not a DAppNode package releases site
  if (currentFiles[registryPath] && !currentFiles[releasesPath])
    throw Error(
      `This site is a DAppNode package registry. Delete the ${registryPath} file to continue`
    );

  const releases: RawRelease[] = currentFiles[releasesPath]
    ? await zeroframe.fileGetJson(releasesPath)
    : [];

  if (!releaseData.ipfs && !releaseData.swarm)
    throw Error(`At least one static source must be defined`);

  const newRelease: RawRelease = {
    ...releaseData,
    timestamp: Math.floor(Date.now() / 1000)
  };

  // Prepend new release and ignore releases for the same version if any
  const newReleases = [
    newRelease,
    ...releases.filter(release => release.version !== releaseData.version)
  ];
  await zeroframe.fileWrite(releasesPath, JSON.stringify(newReleases, null, 2));
  console.log(`Added version ${releaseData.version} to ${releasesPath}`);

  // Write HTML with a simple title
  await setRepoMetadata(repoData, zeroframe);
  await generateRepoHtml(zeroframe);

  // Sign site
  if (!privateKey) throw Error(`A private key must be provided`);
  await zeroframe.siteSign(privateKey);
  console.log(`Signed site`);
  // If there are peers in the site publish it
  const siteInfo = await zeroframe.siteInfo();
  if (siteInfo.peers > 1) {
    await zeroframe.sitePublish(privateKey);
    console.log(`Published site`);
  }

  // Nicely close WebSocket
  zeroframe.close();
}
