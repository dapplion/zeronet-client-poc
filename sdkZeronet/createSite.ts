import ZeroFrameTs from "../zeroframe";

/**
 * #### Todo: doesn't work
 */
async function createSite() {
  const zeroframe = ZeroFrameTs(mockSite.address, {
    host: "127.0.0.1",
    port: 43110
  });

  // Update the title of the sites
  const token = String(Math.random()).slice(2);
  console.log(`Updating ${token}`);
  const resUpdate = await zeroframe.updateSiteInfo({
    title: `An amazing site: ${token}`,
    description: `Description of ${token}`
  });
  console.log({ resUpdate });

  // Create a new file
  const resNewFile = await zeroframe.fileWrite(
    `${token}.json`,
    JSON.stringify({
      what: "This is an amazing file",
      token
    })
  );
  console.log(resNewFile);

  // Sign the site
  const resSign = await zeroframe.siteSign(mockSite.privKey);
  console.log({ resSign });

  // Check result
  const siteInfo = await zeroframe.contentJsonGet();
  console.log(siteInfo);

  zeroframe.close();
}
