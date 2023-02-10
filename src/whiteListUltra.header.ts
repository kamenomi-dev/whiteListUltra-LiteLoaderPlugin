//LiteLoaderScript Dev Helper
/// <reference path="d:\CurrentProject\Orz_MinecraftBedrockPlugin\Common/dts/HelperLib-master/src/index.d.ts"/> 

logger.setTitle('WhiteList-Ultra');
if (!ll.requireVersion(2, 9, 0))
  logger.warn('当前 LiteLoader 版本过低，发生任何错误将不进行修复，请更新至 v2.9.0 或以上');
ll.registerPlugin(
  "WhiteListUltra",
  "A Ultra Whitelist Helper For Minecraft Bedrock Edition",
  [1, 0, 0],
  {
  License: 'Apache 2.0 License',
  copyright: 'copyright (c) Creakler'
  }
);

var globalVariable: {
  whiteListUltra: {
    fileSystem: fileSystem
    config: whiteListUltraConfig
  }
} = {
  whiteListUltra: {
    fileSystem: new fileSystem(),
    config: (new fileSystem().readConfigFile()),
  }
};

type whiteListUltraConfig = {
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
type commonPlayerInfo = {
  playerName: string
  xuid: string
  uuid: string
  whited: boolean
  unwhiteTime: number
  banned: boolean
  bannedTime: number
  bannedResult: string
};
