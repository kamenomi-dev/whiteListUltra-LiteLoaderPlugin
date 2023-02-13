//LiteLoaderScript Dev Helper
/// <reference path="d:\CurrentProject\Orz_MinecraftBedrockPlugin\Common/dts/HelperLib-master/src/index.d.ts"/> 

var GPlugin: TPluginConfig;
{
  GPlugin = {
    info: {
      name: 'WhiteListUltra',
      author: 'Huang Youzhen',
      license: 'Apache 2.0 License',
      projectUrl: 'https://github.com/CreaklerFurry/whiteListUltra-LLBDS-Plugin',
      issueReportUrl: 'https://github.com/CreaklerFurry/whiteListUltra-LLBDS-Plugin/issues',
      configPath: '.\\plugins\\whiteListUltra\\',
      version: '2.2.1',
      versionTime: '20230214',
      versionStatus: 'AlphaDev'
    },
    fileSystem: new fileSystem()
  };
  GPlugin.fileSystem.configPath = GPlugin.info.configPath;
  GPlugin.config = GPlugin.fileSystem.readMessageConfigFile();
};

logger.setTitle('WhiteList-Ultra');
if (!ll.requireVersion(2, 9, 0))
  logger.warn('当前 LiteLoader 版本过低，发生任何错误将不进行修复，请更新至 v2.9.0 或以上');
var ver = GPlugin.info.version.split('.').map(ver => Number(ver));
var info = GPlugin.info;
ll.registerPlugin(
  info.name,
  "A Ultra Whitelist Helper For Minecraft Bedrock Edition",
  [
    ver[0], ver[1], ver[2]
  ],
  {
    License: info.license,
    copyright: `copyright (c) ${info.author}`
  }
);

type TPluginConfig = {
  info: {
    name: string,
    author: string,
    license: string,
    projectUrl: string,
    issueReportUrl: string,
    configPath: string,
    version: string,
    versionTime: string,
    versionStatus: string
  },
  fileSystem: fileSystem,
  config?: TMessageConfig
};
type TMessageConfig = {
  eventMessages: {
    whitelist: {
      on_timed_out: string,
      on_have_no_permission: string
    },
    blacklist: {
      on_default_reason_noTime: string,
      on_default_reason_hasTime: string
    }
  }
};
type TPlayerData = {
  playerName: string
  xuid: string
  uuid: string
  whited: boolean
  unwhiteTime: number
  banned: boolean
  bannedTime: number
  bannedResult: string
};
