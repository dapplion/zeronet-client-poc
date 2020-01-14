import { RawDirectoryPackage } from "./types";
import { registryPath } from "./params";

const ZeroFrame = require("zeroframe-ws-client");

const contentJsonPath = "content.json";

interface ZeroFrameOptions {
  host?: string;
  port?: number;
}

interface SiteInfo {
  auth_key: string; // "4b08f27e843ae5a0ee071501df7df24e011e81d97adc423c32413f1338d9218d";
  auth_address: string; // "196ZWmewQ7EQXRcNbtAkJPYX5aKPX6VLK1";
  cert_user_id: string | null;
  address: string; // "1BQNYotj7yJQ4GeWLotZ1BjVwnuTeZqnkN";
  address_short: string; // "1BQNYo..qnkN";
  settings: {
    own: boolean; // false;
    serving: boolean; // true;
    permissions: any[]; // ???? [];
    cache: {};
    size_files_optional: number; // 0;
    added: number; // 1578823500;
    downloaded: number; // 1578823500;
    optional_downloaded: number; // 0;
    size_optional: number; // 0;
    size: number; // 5887;
    ajax_key: string; // "e9955d8f41aca976f601ada1446fa6853d4e696cda679caa65830e15ac5382dc";
    bytes_recv: number; // 5887;
    modified: number; // 1578823432;
    peers: number; // 1;
  };
  content_updated: number; // 1578823500.774118;
  bad_files: number; // 0;
  size_limit: number; // 10;
  next_size_limit: number; // 10;
  peers: number; // 2;
  started_task_num: number; // 0;
  tasks: number; // 0;
  workers: number; // 0;
  content: {
    address: string; // "1BQNYotj7yJQ4GeWLotZ1BjVwnuTeZqnkN";
    address_index: number; // 26963364;
    "background-color": string; // "#FFF";
    clone_root: string; // "template-new";
    cloned_from: string; // "1HeLLo4uzjaLetFx6NH3PMwFP3qbRbTf3D";
    description: string; // "";
    // The ZeroNet WebsocketUI only sends the file count
    // content["files"] = len(content.get("files", {}))
    files: number; // 2;
    ignore: string; // "";
    inner_path: string; // "content.json";
    modified: number; // 1578823432;
    postmessage_nonce_security: boolean; // true;
    signs_required: number; // 1;
    title: string; // "my new site";
    translate: string; // ["js/all.js"];
    zeronet_version: string; // "0.7.1";
    files_optional: number; // 0;
    includes: number; // 0;
  };
  feed_follow_num: any | null; // ????
}

interface ContentJson {
  address: string; // "1B27wUJFvVVxUEAC9LaCWoJm9svy8k1wUk";
  address_index: number; // 204481;
  "background-color": string; // "#FFF";
  clone_root: string; ///"template-new";
  cloned_from: string; // "1HeLLo4uzjaLetFx6NH3PMwFP3qbRbTf3D";
  description: string; // "";
  files: {
    // fileName = "index.html"
    [fileName: string]: {
      sha512: string; // "66d08e6b9cb9615da488d43b019c91a5f18c8856a291ec589f4f42ee84df2441";
      size: number; // 386;
    };
  };
  ignore: string; // "";
  inner_path: string; // "content.json";
  modified: number; // 1577549593;
  postmessage_nonce_security: boolean; // true;
  signers_sign: string; // "G1Q4q/SzypDVi++SHZDeMNqfIkwXqnMOqd+P9EXySB1ASeDZtmefwv0/Gd0W4M13Hi4ubyDYa2aBzfSIwMnBK0o=";
  signs: {
    // signerAddress = "1B27wUJFvVVxUEAC9LaCWoJm9svy8k1wUk"
    [signerAddress: string]: string; // "G2+qvElG4DBNvrm4hfDC9LfDEsu8ZvgKQYH5JWY+7e9HHwkDmEFzWeP0Qjxct9++D5x6XFh76PdCiYgzasQ8buM=";
  };
  signs_required: number; // 1;
  title: string; // "my new site";
  translate: string[]; // ["js/all.js"];
  zeronet_version: string; // "0.7.1";
}

interface ContentJsonUpdatable {
  description?: string;
  title?: string;
}

interface ServerInfo {
  ip_external: boolean; // true;
  port_opened: {
    ipv4: boolean;
    ipv6: boolean;
  };
  platform: string; // "linux";
  fileserver_ip: string; // "*";
  fileserver_port: number; // 26552;
  tor_enabled: boolean; // true;
  tor_status: string; // "OK (1 onions running)";
  tor_has_meek_bridges: boolean;
  tor_use_bridges: boolean;
  ui_ip: string; // "*";
  ui_port: number; // 80;
  version: string; // "0.7.1";
  rev: number; // 4372;
  timecorrection: number; // -0.6432757377624512;
  language: string; // "en";
  debug: boolean;
  offline: boolean;
  plugins: string[];
  // plugins = [
  //   "AnnounceBitTorrent",
  //   "AnnounceLocal",
  //   "AnnounceShare",
  //   "AnnounceZero",
  //   "Benchmark",
  //   "Bigfile",
  //   "Chart",
  //   "ContentFilter",
  //   "Cors",
  //   "CryptMessage",
  //   "FilePack",
  //   "MergerSite",
  //   "Newsfeed",
  //   "OptionalManager",
  //   "PeerDb",
  //   "Sidebar",
  //   "Stats",
  //   "TranslateSite",
  //   "Trayicon",
  //   "UiConfig",
  //   "UiPluginManager",
  //   "Zeroname"
  // ];
  plugins_rev: {};
  user_settings: {};
}

type ZeroFrameCmds =
  | "siteInfo"
  | "siteList"
  | "siteSign"
  | "sitePublish"
  | "fileGet"
  | "fileWrite"
  | "serverInfo";

export interface ZeroFrameInstance {
  siteInfo: () => Promise<SiteInfo>;
  siteList: () => Promise<SiteInfo[]>;
  siteSign: (privateKey: string) => Promise<void>;
  sitePublish: (privateKey: string) => Promise<void>;
  fileGet: (innerPath: string) => Promise<string>;
  fileWrite: (innerPath: string, content: string) => Promise<void>;
  fileGetJson: <T>(innerPath: string) => Promise<T>;
  contentJsonGet: () => Promise<ContentJson>;
  updateSiteInfo: (newData: ContentJsonUpdatable) => Promise<void>;
  serverInfo: () => Promise<ServerInfo>;
  close: () => void;
}

export default function ZeroFrameTs(
  siteAddress: string,
  options?: ZeroFrameOptions
): ZeroFrameInstance {
  const zeroframe = new ZeroFrame(siteAddress, {
    instance: {
      host: options && options.host,
      port: options && options.port
    }

    // Logs info and errors to console
    // show: {
    //   log: true,
    //   error: true
    // }
  });

  const timeout = 10; // Seconds
  const messageIdAdmin = 1000000;

  function parseJson<T>(data: string): T {
    if (typeof data !== "string")
      throw Error(`Parsing non string: ${JSON.stringify(data)}`);
    try {
      return JSON.parse(data);
    } catch (e) {
      throw Error(`Error parsing JSON ${data.slice(0, 100)}: ${e.message}`);
    }
  }

  async function cmdpNoReturn(cmd: ZeroFrameCmds, kwargs?: any): Promise<void> {
    const res = await zeroframe.cmdp(cmd, kwargs);
    if (res !== "ok") throw Error(`Unknown response: ${res}`);
  }

  async function cmdpReturn(cmd: ZeroFrameCmds, kwargs?: any): Promise<string> {
    const res: string | null = await zeroframe.cmdp(cmd, kwargs);
    if (!res) throw Error("Null response");
    return res;
  }

  async function cmdpJsonReturn<T>(
    cmd: ZeroFrameCmds,
    kwargs?: any
  ): Promise<T> {
    const res: string | T | null = await zeroframe.cmdp(cmd, kwargs);
    if (!res) throw Error("Null response");
    return typeof res === "string" ? parseJson<T>(res) : res;
  }

  /**
   * To get admin priviledges the messageId has to be > 1000000
   */
  function ensureAdmin() {
    if (zeroframe.nextMessageId < messageIdAdmin)
      zeroframe.nextMessageId = messageIdAdmin;
  }

  /**
   * Returns info about a single site
   * File list in not provided. Use contentJsonGet for it
   */
  async function siteInfo(): Promise<SiteInfo> {
    return await cmdpJsonReturn<SiteInfo>("siteInfo");
  }

  /**
   * #### Todo, requires admin priviledges
   */
  async function siteList(): Promise<SiteInfo[]> {
    ensureAdmin();
    return await cmdpJsonReturn<SiteInfo[]>("siteList", {
      connecting_sites: true
    });
  }

  /**
   * Uploads a new file to the site content
   * Only places the file in the data folder, but it does not update content.json
   */
  async function fileWrite(innerPath: string, content: string): Promise<void> {
    await cmdpNoReturn("fileWrite", {
      inner_path: innerPath,
      content_base64: Buffer.from(content).toString("base64")
    });
  }

  /**
   * Download a single file as text
   * If the file is not available it will timeout
   * @param innerPath "index.html", "releases.json"
   */
  async function fileGet(innerPath: string): Promise<string> {
    return await cmdpReturn("fileGet", {
      inner_path: innerPath,
      timeout
    });
  }

  /**
   * Download a single file as JSON
   * @param innerPath "releases.json"
   */
  async function fileGetJson<T>(innerPath: string): Promise<T> {
    return await cmdpJsonReturn<T>("fileGet", {
      inner_path: innerPath,
      timeout
    });
  }

  /**
   * Get the content.json file with all the info about the site
   * and the list of its files
   */
  async function contentJsonGet(): Promise<ContentJson> {
    const contentJson = await fileGetJson<ContentJson>(contentJsonPath);
    return contentJson;
  }

  // Site managment (SDK)

  async function updateSiteInfo(newData: {
    description?: string;
    title?: string;
  }) {
    const contentJson = await contentJsonGet();
    await fileWrite(
      contentJsonPath,
      JSON.stringify({
        ...contentJson,
        ...newData
      })
    );
  }

  /**
   * Updates and Publish a content.json of the site
   * Any new files in the dir will be added to content.json
   * Must submit the privateKey of the site to sign it
   */
  async function sitePublish(privateKey: string): Promise<void> {
    await cmdpNoReturn("sitePublish", {
      privatekey: privateKey
    });
  }

  /**
   * Signs the file updating it locally. To progate content use `sitePublish`
   * Must submit the privateKey of the site to sign it
   */
  async function siteSign(privateKey: string): Promise<void> {
    await cmdpNoReturn("siteSign", {
      privatekey: privateKey,
      update_changed_files: true
    });
  }

  // Server

  /**
   * Get server info
   * Check if status is ok
   * - PORT: OPENED
   * - TOR: AVAILABLE
   * - TRACKERS: 12/16
   */
  async function serverInfo(): Promise<ServerInfo> {
    return await cmdpJsonReturn("serverInfo");
  }

  /**
   * Close the underlying websocket connection
   */
  function close(): void {
    zeroframe.close();
  }

  return {
    siteInfo,
    siteList,
    siteSign,
    sitePublish,
    fileGet,
    fileWrite,
    fileGetJson,
    contentJsonGet,
    updateSiteInfo,
    serverInfo,
    close
  };
}
