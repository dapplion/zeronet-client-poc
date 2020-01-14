import { ZeroFrameInstance } from "../zeroframe";
import { releasesPath, registryPath } from "../params";
import {
  RegistryData,
  RepoData,
  RawDirectoryPackage,
  RawRelease
} from "../types";

const ipfsGateway = "http://ipfs.dappnode:8080/ipfs/";
const zeronetGateway = "localhost:43110/";

/**
 * Add non essential cosmetic metadata to a repo's site
 * @param name
 * @param zeroframe
 */
export async function setRepoMetadata(
  { name }: RepoData,
  zeroframe: ZeroFrameInstance
) {
  // Write content.json metadata
  await zeroframe.updateSiteInfo({
    title: name,
    description: `DAppNode package repository of ${name}`
  });
}

export async function generateRepoHtml(zeroframe: ZeroFrameInstance) {
  const siteInfo = await zeroframe.siteInfo();
  const releases = await zeroframe.fileGetJson<RawRelease[]>(releasesPath);

  const html = `
<html>
<h1>${siteInfo.content.title}</h1>
<p>${siteInfo.content.description}</p>
  
<ul>
${releases.map(release => `  <li>${renderRelease(release)}</li>`)}
</ul>
  
<a href="${releasesPath}">View releases file</a>
</html>
  `;

  await zeroframe.fileWrite("index.html", html.trim());
}

function renderRelease(release: RawRelease): string {
  const sources: string[] = [];
  if (release.ipfs)
    sources.push(`<a href="${ipfsGateway}${release.ipfs}">IPFS</a>`);
  return `${release.version} (${release.timestamp}): ${sources.join(", ")}`;
}

/**
 * Add non essential cosmetic metadata to a registry's site
 * @param name
 * @param zeroframe
 */
export async function setRegistryMetadata(
  { owner }: RegistryData,
  zeroframe: ZeroFrameInstance
) {
  // Write content.json metadata
  await zeroframe.updateSiteInfo({
    title: owner,
    description: `DAppNode package registry mantained by ${owner}`
  });
}

export async function generateRegistryHtml(zeroframe: ZeroFrameInstance) {
  const siteInfo = await zeroframe.siteInfo();
  const registry = await zeroframe.fileGetJson<RawDirectoryPackage[]>(
    registryPath
  );

  const html = `
<html>
<h1>${siteInfo.content.title}</h1>
<p>${siteInfo.content.description}</p>
  
<ul>
${registry.map(pkg => `  <li>${renderPkg(pkg)}</li>`)}
</ul>
  
<a href="${releasesPath}">View registry file</a>
</html>
  `;

  await zeroframe.fileWrite("index.html", html.trim());
}

function renderPkg(pkg: RawDirectoryPackage): string {
  const sources: string[] = [];
  if (pkg.zeronet)
    sources.push(`<a href="${zeronetGateway}${pkg.zeronet}">ZeroNet</a>`);
  return `${pkg.name} (${pkg.status}): ${sources.join(", ")}`;
}
