import releasePackageVersion from "./sdkZeronet/releasePackageVersion";
import addPackageToRegistry from "./sdkZeronet/addPackageToRegistry";

/**
 * Simulate the development and publication of DNPs
 * 1. Create a new repo
 * 2. Key derivation
 * 3. Updating the site
 * 4. Changing the metadata
 */

const helloSite = "1HeLLo4uzjaLetFx6NH3PMwFP3qbRbTf3D";

const mockSiteRepo = {
  address: "1AxA4WQdw6otkQmhHaMeC2VrMXVbEhXd8V",
  privKey: "5KX5yxMSxSbn5ddRLryKCHpD5zRvzm4PvYkCeXqYW8TRggcfk9t"
};

const mockSiteRegistry = {
  address: "1LzttgtSZCFD99Ua8t46ePyPYHNk8QXFnE",
  privKey: "5K4DV4Na3GoTrmJkNmoDbsVDZCwdEua8H89qthYYKZL7gtpDqKp"
};

(async function test() {
  // await testReleasingPackageVersion();
  await testAddPackageToRegistry();
})();

async function testReleasingPackageVersion() {
  const versionData = {
    version: "0.1.1",
    ipfs: "QmZqR8E2XAn1fytEUGePqaPrGXUGw7VWxDDpGMfURsur2s"
  };
  const repoData = {
    name: "Monero"
  };

  console.log(`Releasing ${versionData.version}...`);
  await releasePackageVersion(
    mockSiteRepo.address,
    versionData,
    repoData,
    mockSiteRepo.privKey
  );
  console.log(`Released ${versionData.version}`);
}

async function testAddPackageToRegistry() {
  const packageData = {
    name: "Monero",
    isFeatured: true,
    isTrusted: true,
    zeronet: mockSiteRepo.address
  };
  const regsitryData = {
    owner: "DAppNode Association"
  };

  console.log(`Adding ${packageData.name}...`);
  await addPackageToRegistry(
    mockSiteRegistry.address,
    packageData,
    regsitryData,
    mockSiteRegistry.privKey
  );
  console.log(`Added ${packageData.name}`);
}
