mc.listen('onServerStarted', () => {
  logger.log('Successfully running the server!');
  logger.log('Powered by Creakler');
});
mc.listen('onPreJoin', (Player) => {
  playerProc(Player);
});

function playerProc(Player: Player) {
  var pluginMessages = globalVariable.whiteListUltra.config.eventMessages;
  var playerInfo = globalVariable.whiteListUltra.fileSystem.getPlayerInfo(Player.realName) as commonPlayerInfo;
  var isFirstJoin = typeof playerInfo == 'undefined';
  var bannedReason = isFirstJoin ? '无' : playerInfo.bannedResult || '无';
  var currentTick = new Date().valueOf();
  var procResult = 0;

  (function logic () {
    // define infomation
    if (isFirstJoin) {
      procResult = globalVariable.whiteListUltra.fileSystem.addPlayerInfo({
        playerName: Player.realName,
        xuid: Player.xuid,
        uuid: Player.uuid,
        whited: false,
        unwhiteTime: 0,
        banned: false,
        bannedTime: 0,
        bannedResult: ''
      }) ? 1 : 0;
    };

    // check premission
    if (!playerInfo.banned && (isFirstJoin || !playerInfo.whited)) {
      procResult = 2;
      Player.disconnect(pluginMessages.whitelist.on_have_no_permission);
      return;
    };

    // check have timed out of whiteList
    if (playerInfo.whited && playerInfo.unwhiteTime < currentTick && playerInfo.unwhiteTime != 0) {
      procResult = 3;
      playerInfo.unwhiteTime = 0;
      playerInfo.whited = false;
      globalVariable.whiteListUltra.fileSystem.addPlayerInfo(playerInfo);
      Player.disconnect(pluginMessages.whitelist.on_timed_out);
      return;
    };

    // if on banned
    if (playerInfo.banned) {
      if (playerInfo.bannedTime > currentTick) {
        procResult = 4;
        Player
          .disconnect(pluginMessages.blacklist.on_default_reason_hasTime
            .replace('{%t}', new Date(playerInfo.bannedTime).toDateString()));
        return;
      } else if (playerInfo.bannedTime == 0) {
        procResult = 5;
        Player.disconnect(
          pluginMessages.blacklist.on_default_reason_noTime
          + '\n理由: '
          + bannedReason);
        return;
      };
    };
  })();
  {
    let prefixFormat = `${Player.realName} - ${Player.uuid}`
    let feedback: string[] = [
      `${prefixFormat} 成功通过服务器白名单校验。`,
      `${prefixFormat} ${Player.ip} 是一位新来的玩家。`,
      `${prefixFormat} 没有该服务器的白名单权限。`,
      `${prefixFormat} 所持有的白名单权限已过期。`,
      `${prefixFormat} 现处于有时长的白名单封禁。`,
      `${prefixFormat} 现处于服务器白名单封禁中。`
    ];
    logger.log(feedback[procResult]);
    if (procResult >= 5)
      logger.log(`被封禁原因: ${bannedReason}`);
  };
};