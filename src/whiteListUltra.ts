var pluginInfo = GPlugin.info;
logger.log(`
██╗    ██╗██╗  ██╗██╗████████╗███████╗██╗     ██╗███████╗████████╗    ██╗   ██╗██╗  ████████╗██████╗  █████╗ 
██║    ██║██║  ██║██║╚══██╔══╝██╔════╝██║     ██║██╔════╝╚══██╔══╝    ██║   ██║██║  ╚══██╔══╝██╔══██╗██╔══██╗
██║ █╗ ██║███████║██║   ██║   █████╗  ██║     ██║███████╗   ██║       ██║   ██║██║     ██║   ██████╔╝███████║
██║███╗██║██╔══██║██║   ██║   ██╔══╝  ██║     ██║╚════██║   ██║       ██║   ██║██║     ██║   ██╔══██╗██╔══██║
╚███╔███╔╝██║  ██║██║   ██║   ███████╗███████╗██║███████║   ██║       ╚██████╔╝███████╗██║   ██║  ██║██║  ██║
╚══╝╚══╝ ╚═╝  ╚═╝╚═╝   ╚═╝   ╚══════╝╚══════╝╚═╝╚══════╝   ╚═╝        ╚═════╝ ╚══════╝╚═╝   ╚═╝  ╚═╝╚═╝  ╚═╝
Version - ${pluginInfo.versionTime}.${pluginInfo.version}-WhiteListUltra-${pluginInfo.versionStatus}     Powered by ${pluginInfo.author}     License: ${pluginInfo.license}
Github Project Url: ${pluginInfo.projectUrl}

${
  pluginInfo.versionStatus == 'AlphaDev'? `当前版本状态为 AlphaDev 开服测试版本
若发生bug, 请提交至 ${pluginInfo.issueReportUrl}\n` : ''
}
`);


// =============================================================================================================================================//
mc.listen('onPreJoin', (Player) => {
  playerProc(Player);
});

function playerProc(Player: Player) {
  var messages = GPlugin.config!.eventMessages;
  var playerInfo = GPlugin.fileSystem.editPlayerInfo('get', Player.realName) as TPlayerData;
  var isFirstJoin = playerInfo == null;
  var bannedReason = isFirstJoin ? '无' : playerInfo.bannedResult || '无';
  var currentTime = new Date().valueOf();
  var procResult = 0;

  var isSetBefore: boolean = isFirstJoin ? false : playerInfo.uuid == 'undefined' && playerInfo.xuid == playerInfo.uuid;
  ; (function logic() {
    // op permission proc.
    if (Player.isOP())
      return;

    // full data if it was set before.
    if (isSetBefore) {
      playerInfo.xuid = Player.xuid;
      playerInfo.uuid = Player.uuid;

      procResult = Number(GPlugin.fileSystem.editPlayerInfo('set', playerInfo));
    };

    // define infomation
    if (isFirstJoin) {
      procResult = Number(GPlugin.fileSystem.editPlayerInfo('set', {
        playerName: Player.realName,
        xuid: Player.xuid,
        uuid: Player.uuid,
        whited: false,
        unwhiteTime: 0,
        banned: false,
        bannedTime: 0,
        bannedResult: ''
      }));
      Player.disconnect(messages.whitelist.on_have_no_permission);
      return;
    };

    // check premission
    if (!playerInfo.banned && (isFirstJoin || !playerInfo.whited)) {
      procResult = 2;
      Player.disconnect(messages.whitelist.on_have_no_permission);
      return;
    };

    // check have timed out of whiteList
    if (playerInfo.whited && playerInfo.unwhiteTime < currentTime && playerInfo.unwhiteTime != 0) {
      procResult = 3;
      playerInfo.unwhiteTime = 0;
      playerInfo.whited = false;
      GPlugin.fileSystem.editPlayerInfo('set', playerInfo);
      Player.disconnect(messages.whitelist.on_timed_out);
      return;
    };

    // if the player banned
    if (playerInfo.banned) {
      if (playerInfo.bannedTime > currentTime) {
        procResult = 4;
        Player
          .disconnect(messages.blacklist.on_default_reason_hasTime
            .replace('{%t}', new Date(playerInfo.bannedTime).toDateString()));
        return;
      } else if (playerInfo.bannedTime == 0) {
        procResult = 5;
        Player.disconnect(
`${messages.blacklist.on_default_reason_noTime}
理由: ${bannedReason}`);
        return;
      };
    };
  })();
  {
    let feedback: string[] = [
      '成功通过服务器白名单校验。',
      '是一位新来的玩家。'       ,
      '没有该服务器的白名单权限。',
      '所持有的白名单权限已过期。',
      '现处于有时长的白名单封禁。',
      '现处于服务器白名单封禁中。'
    ];
    logger.log(`${Player.realName} - ${Player.uuid} ${feedback[procResult]}`);
    if (procResult >= 5)
      logger.log(`玩家被封禁原因: ${bannedReason}`);
  };
};