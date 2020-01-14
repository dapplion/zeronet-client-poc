import ZeroFrameTs from "./zeroframe";

const helloSite = "1HeLLo4uzjaLetFx6NH3PMwFP3qbRbTf3D";
const siteWithManifest = "1B27wUJFvVVxUEAC9LaCWoJm9svy8k1wUk";
const emptyBlankSite = "1BQNYotj7yJQ4GeWLotZ1BjVwnuTeZqnkN";
const mySite = "1PVVhxjXmVhS9hkBYWXtn7QDnWXwykwDGz";

// 5Kfk2K4XQhHYPKDvMwyvDpjKD4eQccVcBot5W83T5nLZLM3x6q5
// -                   !!! ^ Save it now, required to modify the site ^ !!!
// - Site address:     1Egr5htZpYJKH9B8nhQJGtbPh83XyTnqED

const siteToWrite = "1Egr5htZpYJKH9B8nhQJGtbPh83XyTnqED";
const siteToWritePrivKey =
  "5Kfk2K4XQhHYPKDvMwyvDpjKD4eQccVcBot5W83T5nLZLM3x6q5";

test();

async function test() {
  const zeroframe = ZeroFrameTs(siteToWrite, {
    host: "zeronet.dappnode",
    port: 80
  });

  const siteInfo = await zeroframe.siteInfo();
  console.log(`Working site: ${siteInfo.address}`);

  const contentJson = await zeroframe.contentJsonGet();
  console.log(contentJson.files);

  const filePath = "test.txt";

  const res = await zeroframe.siteList();
  console.log(res);

  // const newFile = await zeroframe.fileGet(filePath);
  // console.log(newFile);

  // const res = await zeroframe.sitePublish(siteToWritePrivKey);
  // console.log(res);

  // Try to write to
  // const rand = String(Math.random());
  // console.log(`Writing file ${rand}`);
  // const res = await zeroframe.fileWrite("test.txt", `HELLO!! ${rand}`);
  // console.log("done");
  // console.log(res);

  zeroframe.close();

  //   const jsonFiles = Object.entries(contentJson.files)
  //     .map(([path, file]) => ({
  //       path,
  //       ...file
  //     }))
  //     .filter(file => file.path.endsWith(".json"));

  //   for (const jsonFile of jsonFiles) {
  //     const jsonData = await zeroframe.fileGetJson(jsonFile.path);
  //     console.log("=".repeat(20) + "\n" + jsonFile.path + "\n" + "=".repeat(20));
  //     console.log(jsonData);
  //   }
}
