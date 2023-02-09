//LiteLoaderScript Dev Helper
/// <reference path="d:\CurrentProject\Orz_MinecraftBedrockPlugin\Common/dts/HelperLib-master/src/index.d.ts"/> 


if (ll.major < 2 && ll.minor < 9)
  logger.warn('当前 LiteLoader 版本过低，发生任何错误将不进行修复，请更新至 v2.9.0 或以上');
ll.registerPlugin(
  /* plugin name */ "whiteListUltra",
  /* description */ "A Ultra Whitelist Helper For Minecraft Bedrock Edition",
  /* version */[1, 0, 0],
  {
    /* open source license */ License: 'Apache 2.0 License',
    /* copyright */ copyright: 'copyright (c) Creakler'
  }
);

var globalVariable: {
  whiteListUltra: {
    fileSystem: fileSystem
    config: whiteListUltraConfig
    command: Command
  }
} = {
  whiteListUltra: {
    fileSystem: new fileSystem(),
    config: (new fileSystem().readConfigFile()),
    command: {} as Command
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
